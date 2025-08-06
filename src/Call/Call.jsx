import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { Button, Input, Card, Typography, message, List, Avatar, Badge, Spin } from 'antd';
import { UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { AuthContext } from '../components/context/AuthContext';
import { storeSocketId, getOnlineUsers, getOnlineDoctors } from '../api/callApi';

const { Title, Paragraph } = Typography;

// ZEGOCLOUD credentials
const appID = 695626790;
const serverSecret = '08b17ed68b9d48ed301e32184ed7a624';

const Call = () => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [zegoClient, setZegoClient] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const [callStatus, setCallStatus] = useState('Disconnected');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineDoctors, setOnlineDoctors] = useState([]);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [networkStatus, setNetworkStatus] = useState('Checking...');
  const [diagnosticInfo, setDiagnosticInfo] = useState({
    localStream: 'Not initialized',
    remoteStream: 'Not initialized',
    socketId: 'Not connected',
    connectionState: 'N/A',
  });

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Initialize ZEGOCLOUD client
  useEffect(() => {
    const zg = new ZegoExpressEngine(appID, serverSecret);
    setZegoClient(zg);

    zg.checkSystemRequirements().then(result => {
      console.log('System requirements:', result);
      if (!result.webRTC) {
        message.error('WebRTC not supported in this browser.');
        setDiagnosticInfo(prev => ({ ...prev, connectionState: 'WebRTC not supported' }));
      }
    });

    return () => {
      console.log('Cleaning up ZEGOCLOUD client');
      if (zg && roomId) {
        zg.logoutRoom(roomId.toLowerCase());
      }
      if (zg && localStream) {
        zg.stopPublishingStream(userId);
        zg.destroyStream(localStream);
      }
    };
  }, [roomId, localStream, userId]);

  // Initialize Socket.IO
  useEffect(() => {
    const newSocket = io('https://empolyee-backedn.onrender.com/', {
      transports: ['websocket'],
      withCredentials: true,
      reconnection: false, // Disable auto-reconnection to prevent address changes
    });
    setSocket(newSocket);

    newSocket.on('connect', async () => {
      console.log('Socket connected:', newSocket.id);
      setUserId(newSocket.id); // Sync userId with socket.id
      setCallStatus('Socket connected');
      setNetworkStatus('Connected');
      setDiagnosticInfo(prev => ({ ...prev, socketId: newSocket.id }));
      await handleStoreSocketId(newSocket.id);
      await fetchOnlineUsers();
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connect error:', error);
      setNetworkStatus('Connection failed');
      setDiagnosticInfo(prev => ({ ...prev, socketId: 'Connection failed', connectionState: `Error: ${error.message}` }));
      message.error('Failed to connect to server: ' + error.message);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setNetworkStatus('Disconnected');
      setIsUserOnline(false);
      setDiagnosticInfo(prev => ({ ...prev, socketId: 'Disconnected', connectionState: `Disconnected: ${reason}` }));
      message.error('Socket disconnected: ' + reason);
    });

    return () => {
      console.log('Cleaning up socket');
      newSocket.close();
      if (localStream && zegoClient) {
        zegoClient.stopPublishingStream(userId);
        zegoClient.destroyStream(localStream);
      }
    };
  }, [zegoClient, currentUser]);

  // Store socket ID
  const handleStoreSocketId = async (socketId) => {
    if (!currentUser?.id) {
      console.warn('No current user');
      setDiagnosticInfo(prev => ({ ...prev, socketId: 'No current user' }));
      return;
    }
    try {
      const response = await storeSocketId(currentUser.id, socketId);
      if (response.success) {
        console.log('Socket ID stored:', response);
        setIsUserOnline(true);
        message.success('Connected to call service');
      } else {
        console.error('Failed to store socket ID:', response);
        setDiagnosticInfo(prev => ({ ...prev, socketId: `Error: ${response.message}` }));
        message.error('Failed to store socket ID');
      }
    } catch (error) {
      console.error('Error storing socket ID:', error);
      setDiagnosticInfo(prev => ({ ...prev, socketId: `Error: ${error.message}` }));
      message.error('Failed to connect to call service: ' + error.message);
    }
  };

  // Fetch online users
  const fetchOnlineUsers = async () => {
    if (!currentUser?.id) {
      console.log('No current user');
      return;
    }
    try {
      setLoading(true);
      if (currentUser.role === 'doctor') {
        const response = await getOnlineUsers();
        if (response.success) {
          setOnlineUsers(response.data);
          console.log('Online users:', response.data);
        }
      } else if (currentUser.role === 'employee') {
        const response = await getOnlineDoctors();
        if (response.success) {
          setOnlineDoctors(response.data);
          console.log('Online doctors:', response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle socket events for room users
  useEffect(() => {
    if (!socket || !zegoClient) return;

    socket.on('room-users', (users) => {
      console.log('Room users:', users);
      setDiagnosticInfo(prev => ({ ...prev, connectionState: `Room users: ${users.length}` }));
    });

    socket.on('user-connected', (newUserId) => {
      console.log('User connected:', newUserId);
      setDiagnosticInfo(prev => ({ ...prev, connectionState: `User connected: ${newUserId}` }));
    });

    socket.on('user-disconnected', (disconnectedUserId) => {
      console.log('User disconnected:', disconnectedUserId);
      setDiagnosticInfo(prev => ({ ...prev, connectionState: `User disconnected: ${disconnectedUserId}` }));
    });

    return () => {
      socket.off('room-users');
      socket.off('user-connected');
      socket.off('user-disconnected');
    };
  }, [socket, zegoClient]);

  // Join room and initialize media
  const joinRoom = async () => {
    if (!roomId || !socket || !zegoClient) {
      message.error('Room ID, socket, or ZEGOCLOUD client not available');
      setDiagnosticInfo(prev => ({ ...prev, connectionState: 'Missing room ID or client' }));
      return;
    }
    try {
      await zegoClient.loginRoom(
        roomId.toLowerCase(),
        { userID: userId, userName: currentUser?.name || userId },
        { appID, serverSecret }
      );
      console.log('Logged into ZEGOCLOUD room:', roomId);
      setDiagnosticInfo(prev => ({ ...prev, connectionState: `Logged into room ${roomId}` }));

      const stream = await zegoClient.createStream({
        camera: { video: true, audio: true, videoQuality: 4 },
      });
      setLocalStream(stream);
      setDiagnosticInfo(prev => ({ ...prev, localStream: 'Initialized' }));
      await zegoClient.startPublishingStream(userId, stream);
      console.log('Publishing local stream:', stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true;
        localVideoRef.current.play().catch(e => {
          console.error('Local video play error:', e);
          setDiagnosticInfo(prev => ({ ...prev, localStream: `Error: ${e.message}` }));
          message.error(`Local video error: ${e.message}`);
        });
      }

      zegoClient.on('streamAdd', async (streamList) => {
        const remote = streamList[0];
        console.log('Remote stream added:', remote);
        const streamObj = await zegoClient.startPlayingStream(remote.streamID);
        setRemoteStream(streamObj);
        setDiagnosticInfo(prev => ({
          ...prev,
          remoteStream: `Initialized (Stream ID: ${remote.streamID})`,
        }));
        if (remoteVideoRef.current) {
          setTimeout(() => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = streamObj;
              remoteVideoRef.current.play().catch(e => {
                console.error('Remote video play error:', e);
                setDiagnosticInfo(prev => ({ ...prev, remoteStream: `Error: ${e.message}` }));
                message.error(`Failed to play remote video: ${e.message}`);
              });
            }
          }, 3000); // Increased delay to prevent play interruption
        }
      });

      socket.emit('join-room', { roomId: roomId.toLowerCase(), userId: socket.id });
      setCallStatus('Connected to room');
      setNetworkStatus('Connected to room');
      await handleStoreSocketId(socket.id);
    } catch (error) {
      console.error('Error joining room:', error);
      setDiagnosticInfo(prev => ({ ...prev, localStream: `Error: ${error.message}`, connectionState: `Error: ${error.message}` }));
      message.error('Failed to access media: ' + error.message);
    }
  };

  // Call user by socket ID
  const callUserBySocketId = async (targetSocketId, targetUserId) => {
    if (!zegoClient || !socket || !targetSocketId) {
      message.error('Cannot make call: Missing connection or target');
      setDiagnosticInfo(prev => ({ ...prev, connectionState: 'Missing client or target' }));
      return;
    }
    try {
      console.log('Initiating call to:', { targetSocketId, targetUserId, callerSocketId: socket.id });
      socket.emit('join-room', { roomId: roomId.toLowerCase(), userId: socket.id });
      setCallStatus('Calling...');
      setNetworkStatus('Calling...');
      setDiagnosticInfo(prev => ({ ...prev, connectionState: `Calling ${targetSocketId}` }));
    } catch (error) {
      console.error('Error making call:', error);
      setDiagnosticInfo(prev => ({ ...prev, connectionState: `Call error: ${error.message}` }));
      message.error('Failed to initiate call: ' + error.message);
    }
  };

  // End call
  const endCall = async () => {
    console.log('Ending call');
    if (zegoClient && localStream) {
      zegoClient.stopPublishingStream(userId);
      zegoClient.destroyStream(localStream);
      setLocalStream(null);
    }
    if (zegoClient && roomId) {
      zegoClient.logoutRoom(roomId.toLowerCase());
    }
    setRemoteStream(null);
    setCallStatus('Disconnected');
    setNetworkStatus('Disconnected');
    setDiagnosticInfo(prev => ({
      ...prev,
      localStream: 'Not initialized',
      remoteStream: 'Not initialized',
      connectionState: 'Disconnected',
    }));
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) localVideoRef.current.srcObject = null;
    socket.emit('leave-room', { roomId: roomId.toLowerCase(), userId: socket.id });
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream && zegoClient) {
      const enabled = !isAudioOn;
      zegoClient.muteMicrophone(!enabled);
      setIsAudioOn(enabled);
      console.log('Audio:', enabled);
      message.info(enabled ? 'Microphone ON' : 'Microphone OFF');
    } else {
      message.error('No stream or client available');
      setDiagnosticInfo(prev => ({ ...prev, localStream: 'No stream or client' }));
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream && zegoClient) {
      const enabled = !isVideoOn;
      zegoClient.muteCamera(!enabled);
      setIsVideoOn(enabled);
      console.log('Video:', enabled);
      message.info(enabled ? 'Camera ON' : 'Camera OFF');
    } else {
      message.error('No stream or client available');
      setDiagnosticInfo(prev => ({ ...prev, localStream: 'No stream or client' }));
    }
  };

  // Test media devices
  const testMedia = async () => {
    if (!zegoClient) {
      message.error('ZEGOCLOUD client not initialized');
      setDiagnosticInfo(prev => ({ ...prev, localStream: 'Client not initialized' }));
      return;
    }
    try {
      const stream = await zegoClient.createStream({
        camera: { video: true, audio: true, videoQuality: 4 },
      });
      console.log('Test media stream:', stream);
      setDiagnosticInfo(prev => ({ ...prev, localStream: 'Initialized' }));
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(e => {
          console.error('Test video play error:', e);
          setDiagnosticInfo(prev => ({ ...prev, localStream: `Error: ${e.message}` }));
        });
      }
      message.success('Camera and microphone working!');
      zegoClient.destroyStream(stream);
    } catch (error) {
      console.error('Test media error:', error);
      setDiagnosticInfo(prev => ({ ...prev, localStream: `Error: ${error.message}` }));
      message.error('Failed to access media: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <header className="p-4 flex justify-between items-center">
        <Title level={3}>Video Call</Title>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Socket ID: {socket?.id || 'Not connected'}</span>
          <span className="text-sm">ZEGO User ID: {userId || 'Not set'}</span>
          <Badge status={isUserOnline ? 'success' : 'error'} text={isUserOnline ? 'Online' : 'Offline'} />
          <span className="text-sm">Network: {networkStatus}</span>
          <Button type="primary" danger onClick={endCall}>
            Leave Call
          </Button>
        </div>
      </header>
      <main className="flex-grow p-4">
        <Card className="mb-4 shadow-md">
          <Paragraph>
            <strong>Status:</strong> {callStatus}
          </Paragraph>
          {roomId && (
            <Paragraph>
              <strong>Room ID:</strong> {roomId}
            </Paragraph>
          )}
          {currentUser && (
            <Paragraph>
              <strong>Logged in as:</strong> {currentUser.name || currentUser.email} ({currentUser.role})
            </Paragraph>
          )}
        </Card>

        <Card className="mb-4 border-blue-500 border-2">
          <Title level={4}>Diagnostics</Title>
          <Paragraph>
            <strong>Socket ID:</strong> {diagnosticInfo.socketId}
          </Paragraph>
          <Paragraph>
            <strong>Local Stream:</strong> {diagnosticInfo.localStream}
          </Paragraph>
          <Paragraph>
            <strong>Remote Stream:</strong> {diagnosticInfo.remoteStream}
          </Paragraph>
          <Paragraph>
            <strong>Connection State:</strong> {diagnosticInfo.connectionState}
          </Paragraph>
        </Card>

        {!localStream && (
          <Card className="mb-4 border-blue-500 border-2">
            <Title level={4}>Join Room</Title>
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Enter Room ID (e.g., room123)"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toLowerCase())}
                className="w-64"
              />
              <Button
                type="primary"
                onClick={() => joinRoom()}
                disabled={!roomId.trim() || !socket || !zegoClient}
                style={{ backgroundColor: 'black' }}
              >
                Join
              </Button>
              <Button onClick={testMedia}>
                Test Media
              </Button>
            </div>
            <Paragraph className="text-sm text-gray-500">
              Share the Room ID to connect with {currentUser?.role === 'doctor' ? 'a patient' : 'a doctor'}!
            </Paragraph>
          </Card>
        )}

        {currentUser && (
          <Card className="mb-4 border-green-500 border-2">
            <div className="flex justify-between items-center mb-4">
              <Title level={4}>
                {currentUser?.role === 'doctor' ? 'Online Patients' : 'Online Doctors'}
              </Title>
              <Button onClick={fetchOnlineUsers} loading={loading}>
                Refresh
              </Button>
            </div>
            {currentUser?.role === 'doctor' && onlineUsers.length > 0 && (
              <List
                dataSource={onlineUsers}
                renderItem={(user) => (
                  <List.Item
                    actions={[
                      <Button
                        type="primary"
                        icon={<VideoCameraOutlined />}
                        onClick={() => callUserBySocketId(user.socketId, user._id)}
                        className="bg-green-600"
                      >
                        Call
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={`Patient ${user._id}`}
                      description={`Socket ID: ${user.socketId}`}
                    />
                  </List.Item>
                )}
              />
            )}
            {currentUser?.role === 'employee' && onlineDoctors.length > 0 && (
              <List
                dataSource={onlineDoctors}
                renderItem={(doctor) => (
                  <List.Item
                    actions={[
                      <Button
                        type="primary"
                        icon={<VideoCameraOutlined />}
                        onClick={() => callUserBySocketId(doctor.socketId, doctor._id)}
                        className="bg-green-600"
                      >
                        Call
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={`Doctor ${doctor._id}`}
                      description={`Socket ID: ${doctor.socketId}`}
                    />
                  </List.Item>
                )}
              />
            )}
            {((currentUser?.role === 'doctor' && onlineUsers.length === 0) ||
              (currentUser?.role === 'employee' && onlineDoctors.length === 0)) && (
              <div>
                <Paragraph className="text-gray-500">
                  No {currentUser?.role === 'doctor' ? 'patients' : 'doctors'} online at the moment.
                </Paragraph>
                <Paragraph className="text-sm text-gray-400">
                  Make sure {currentUser?.role === 'doctor' ? 'patients' : 'doctors'} are logged in and connected.
                </Paragraph>
              </div>
            )}
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Title level={4} className="text-center">
              Your Video
            </Title>
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-[500px] bg-black rounded-lg object-cover border-2 border-blue-500"
            />
            <div className="absolute bottom-2 left-2 bg-gray-800 text-white px-2 py-1 rounded text-sm">
              You
            </div>
          </div>
          <div className="relative">
            <Title level={4} className="text-center">
              {currentUser?.role === 'doctor' ? 'Patient' : 'Doctor'}
            </Title>
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-[500px] bg-black rounded-lg object-cover border-2 border-green-500"
              />
            ) : (
              <div className="w-full h-[500px] bg-black rounded-lg flex items-center justify-center border-2 border-green-500">
                <Spin tip={`Waiting for ${currentUser?.role === 'doctor' ? 'patient' : 'doctor'} video...`} />
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-gray-800 text-white px-2 py-1 rounded text-sm">
              {remoteStream ? (currentUser?.role === 'doctor' ? 'Patient' : 'Doctor') : `Waiting for ${currentUser?.role === 'doctor' ? 'patient' : 'doctor'}...`}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Call;