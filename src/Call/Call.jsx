import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { Button, Input, Card, Typography, message, List, Avatar, Badge, Spin } from 'antd';
import { UserOutlined, VideoCameraOutlined, PhoneOutlined } from '@ant-design/icons';
import { AuthContext } from '../components/context/AuthContext';
import { storeSocketId, getOnlineUsers, getOnlineDoctors, leaveCall } from '../api/callApi';

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
  const [isCallActive, setIsCallActive] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [callerData, setCallerData] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
  const [callStatus, setCallStatus] = useState('Disconnected');
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [mediaError, setMediaError] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineDoctors, setOnlineDoctors] = useState([]);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [networkStatus, setNetworkStatus] = useState('Checking...');
  const [diagnosticInfo, setDiagnosticInfo] = useState({
    localStream: 'Not initialized',
    remoteStream: 'Not initialized',
    connectionState: 'N/A',
  });

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Initialize ZEGOCLOUD client
  useEffect(() => {
    const zg = new ZegoExpressEngine(appID, serverSecret);
    setZegoClient(zg);

    // Check environment compatibility
    zg.checkSystemRequirements().then(result => {
      console.log('System requirements:', result);
      if (!result.webRTC) {
        message.error('WebRTC not supported in this browser.');
        setDiagnosticInfo(prev => ({ ...prev, connectionState: 'WebRTC not supported' }));
      }
    });

    return () => {
      if (zg) {
        zg.destroy();
      }
    };
  }, []);

  // Initialize Socket.IO
  useEffect(() => {
    const newSocket = io('https://empolyee-backedn.onrender.com/', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    setSocket(newSocket);

    newSocket.on('connect', async () => {
      console.log('Socket connected:', newSocket.id);
      setCallStatus('Socket connected');
      setNetworkStatus('Connected');
      await handleStoreSocketId(newSocket.id);
      await fetchOnlineUsers();
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket error:', error);
      setNetworkStatus('Connection failed');
      message.error('Failed to connect to server.');
    });

    return () => {
      console.log('Cleaning up socket');
      handleLeaveCall();
      newSocket.close();
      if (localStream) {
        zegoClient.stopPublishingStream(userId);
        zegoClient.destroyStream(localStream);
      }
    };
  }, [zegoClient, currentUser]);

  // Store socket ID
  const handleStoreSocketId = async (socketId) => {
    if (!currentUser?.id) {
      console.warn('No current user');
      return;
    }
    try {
      const response = await storeSocketId(currentUser.id, socketId);
      if (response.success) {
        console.log('Socket ID stored:', response);
        setIsUserOnline(true);
        message.success('Connected to call service');
      }
    } catch (error) {
      console.error('Error storing socket ID:', error);
      message.error('Failed to connect to call service');
    }
  };

  // Handle disconnection
  const handleLeaveCall = async () => {
    if (!currentUser?.id) {
      console.warn('No current user');
      return;
    }
    try {
      const response = await leaveCall(currentUser.id);
      if (response.success) {
        console.log('User disconnected:', response);
        setIsUserOnline(false);
        message.success('Disconnected from call service');
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
      message.error('Failed to disconnect from call service');
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

  // Handle socket events
  useEffect(() => {
    if (!socket || !zegoClient) return;

    socket.on('room-users', (users) => {
      console.log('Room users:', users);
      setConnectedUsers(users.filter(user => user !== socket.id));
      setCallStatus(users.length > 1 ? 'Users in room' : 'Waiting for users');
    });

    socket.on('user-connected', (newUserId) => {
      console.log('User connected:', newUserId);
      if (newUserId !== socket.id) {
        setConnectedUsers(prev => [...new Set([...prev, newUserId])]);
        setCallStatus(`User ${newUserId} joined`);
      }
    });

    socket.on('user-disconnected', (disconnectedUserId) => {
      console.log('User disconnected:', disconnectedUserId);
      setConnectedUsers(prev => prev.filter(id => id !== disconnectedUserId));
      setCallStatus(`User ${disconnectedUserId} left`);
    });

    socket.on('call-made', async ({ from, name }) => {
      console.log('Incoming call from:', { from, name });
      setIsIncomingCall(true);
      setCallerData({ from, name });
      setCallStatus('Incoming call...');
    });

    socket.on('call-accepted', () => {
      console.log('Call accepted');
      setIsCallActive(true);
      setCallStatus('Call connected');
      setNetworkStatus('Call connected');
    });

    socket.on('call-rejected', () => {
      console.log('Call rejected');
      setCallStatus('Call rejected');
      endCall();
      message.warning('Call was rejected');
    });

    socket.on('call-ended', () => {
      console.log('Call ended');
      setCallStatus('Call ended');
      endCall();
      message.info('Call ended');
    });

    return () => {
      socket.off('room-users');
      socket.off('user-connected');
      socket.off('user-disconnected');
      socket.off('call-made');
      socket.off('call-accepted');
      socket.off('call-rejected');
      socket.off('call-ended');
    };
  }, [socket, zegoClient]);

  // Join room and initialize media
  const joinRoom = async () => {
    if (!roomId || !socket || !zegoClient) {
      message.error('Room ID, socket, or ZEGOCLOUD client not available');
      return;
    }
    try {
      // Log in to ZEGOCLOUD room
      await zegoClient.loginRoom(
        roomId.toLowerCase(),
        { userID: userId, userName: currentUser?.name || userId },
        { appID, serverSecret }
      );
      console.log('Logged into ZEGOCLOUD room:', roomId);

      // Create and publish local stream
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
        });
      }

      // Subscribe to remote streams
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
          remoteVideoRef.current.srcObject = streamObj;
          remoteVideoRef.current.play().catch(e => {
            console.error('Remote video play error:', e);
            setDiagnosticInfo(prev => ({ ...prev, remoteStream: `Error: ${e.message}` }));
            message.error(`Failed to play remote video: ${e.message}`);
          });
        }
      });

      socket.emit('join-room', { roomId: roomId.toLowerCase(), userId: socket.id });
      setCallStatus('Connected to room');
      setNetworkStatus('Connected to room');
      await handleStoreSocketId(socket.id);
    } catch (error) {
      console.error('Error joining room:', error);
      setDiagnosticInfo(prev => ({ ...prev, localStream: `Error: ${error.message}` }));
      setMediaError('Failed to access media: ' + error.message);
      message.error('Failed to access media: ' + error.message);
    }
  };

  // Call user by socket ID
  const callUserBySocketId = async (targetSocketId, targetUserId) => {
    if (!zegoClient || !socket || !targetSocketId) {
      message.error('Cannot make call: Missing connection or target');
      return;
    }
    try {
      socket.emit('initiate-call', {
        callerId: currentUser.id,
        calleeId: targetUserId,
        callerName: currentUser.name || currentUser.email,
      });
      setCallStatus('Calling...');
      setNetworkStatus('Calling...');
    } catch (error) {
      console.error('Error making call:', error);
      message.error('Failed to initiate call');
    }
  };

  // Initiate a call
  const makeCall = async (targetUserId) => {
    if (!zegoClient || !socket || !targetUserId) {
      message.error('Cannot make call: Missing connection or target');
      return;
    }
    try {
      socket.emit('call-user', {
        userToCall: targetUserId,
        from: socket.id,
        name: userId,
      });
      setCallStatus('Calling...');
      setNetworkStatus('Calling...');
    } catch (error) {
      console.error('Error making call:', error);
      message.error('Failed to initiate call');
    }
  };

  // Answer call
  const answerCall = async () => {
    if (!callerData || !zegoClient) {
      message.error('Cannot answer call: Missing data or connection');
      return;
    }
    try {
      socket.emit('answer-call', { to: callerData.from });
      setIsCallActive(true);
      setIsIncomingCall(false);
      setCallStatus('Call connected');
      setNetworkStatus('Call connected');
    } catch (error) {
      console.error('Error answering call:', error);
      message.error('Failed to answer call');
    }
  };

  // Reject call
  const rejectCall = () => {
    if (socket && callerData) {
      socket.emit('reject-call', { to: callerData.from });
    }
    setIsIncomingCall(false);
    setCallerData(null);
    setCallStatus('Call rejected');
    setNetworkStatus('Disconnected');
    setRemoteStream(null);
    console.log('Call rejected');
  };

  // End call
  const endCall = async () => {
    console.log('Ending call');
    if (socket && callerData) socket.emit('end-call', { to: callerData.from });
    if (zegoClient && localStream) {
      zegoClient.stopPublishingStream(userId);
      zegoClient.destroyStream(localStream);
      setLocalStream(null);
    }
    setRemoteStream(null);
    setIsCallActive(false);
    setIsIncomingCall(false);
    setCallerData(null);
    setCallStatus('Disconnected');
    setNetworkStatus('Disconnected');
    setDiagnosticInfo(prev => ({
      ...prev,
      localStream: 'Not initialized',
      remoteStream: 'Not initialized',
      connectionState: 'N/A',
    }));
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    await handleLeaveCall();
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
    }
  };

  // Refresh online users
  const refreshOnlineUsers = () => {
    fetchOnlineUsers();
  };

  // Test media devices
  const testMedia = async () => {
    if (!zegoClient) {
      message.error('ZEGOCLOUD client not initialized');
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
        localVideoRef.current.play().catch(e => console.error('Test video play error:', e));
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
          <span className="text-sm">User ID: {socket?.id || 'Not connected'}</span>
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
            <strong>Local Stream:</strong> {diagnosticInfo.localStream}
          </Paragraph>
          <Paragraph>
            <strong>Remote Stream:</strong> {diagnosticInfo.remoteStream}
          </Paragraph>
          <Paragraph>
            <strong>Connection State:</strong> {diagnosticInfo.connectionState}
          </Paragraph>
        </Card>

        {mediaError && (
          <Card className="mb-4 border-red-500 border-2">
            <Title level={4}>Media Error</Title>
            <Paragraph className="text-red-500">{mediaError}</Paragraph>
            <Button type="primary" onClick={() => joinRoom()}>
              Retry
            </Button>
          </Card>
        )}

        {!localStream && !mediaError && (
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
              Share the Room ID to start a video call!
            </Paragraph>
            <Paragraph className="text-sm text-gray-500">
              <span>Your User ID: {socket?.id || 'Not connected'}</span>
            </Paragraph>
          </Card>
        )}

        {currentUser && !isCallActive && !isIncomingCall && (
          <Card className="mb-4 border-green-500 border-2">
            <div className="flex justify-between items-center mb-4">
              <Title level={4}>
                {currentUser?.role === 'doctor' ? 'Online Employees' : 'Online Doctors'}
              </Title>
              <div className="flex space-x-2">
                <Button onClick={fetchOnlineUsers} loading={loading}>
                  Fetch Online Users
                </Button>
                <Button onClick={refreshOnlineUsers} loading={loading}>
                  Refresh
                </Button>
              </div>
            </div>
            
            {currentUser?.role === 'doctor' && onlineUsers.length > 0 && (
              <List
                dataSource={onlineUsers}
                renderItem={(user) => (
                  <List.Item
                    actions={[
                      <Button 
                        type="primary" 
                        icon={<PhoneOutlined />}
                        onClick={() => callUserBySocketId(user.socketId, user._id)}
                        className="bg-green-600"
                      >
                        Call
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={`Employee ${user._id}`}
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
                        icon={<PhoneOutlined />}
                        onClick={() => callUserBySocketId(doctor.socketId, doctor._id)}
                        className="bg-green-600"
                      >
                        Call
                      </Button>
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
                  No {currentUser?.role === 'doctor' ? 'employees' : 'doctors'} online at the moment.
                </Paragraph>
                <Paragraph className="text-sm text-gray-400">
                  Make sure doctors/employees are logged in and connected.
                </Paragraph>
              </div>
            )}
          </Card>
        )}

        {localStream && !isCallActive && !isIncomingCall && connectedUsers.length > 0 && (
          <Card className="mb-4 border-green-500 border-2">
            <Title level={4}>Available Users in Room</Title>
            {connectedUsers.map(user => (
              <div key={user} className="flex justify-between items-center p-2 bg-gray-50 rounded mb-2">
                <span className="font-medium">{user}</span>
                <Button type="primary" className="bg-green-600" onClick={() => makeCall(user)}>
                  Call
                </Button>
              </div>
            ))}
          </Card>
        )}

        {localStream && !isCallActive && !isIncomingCall && connectedUsers.length === 0 && (
          <Card className="mb-4 border-yellow-400 border-2">
            <Paragraph>
              <strong>Waiting for users to join room "{roomId}"...</strong>
            </Paragraph>
            <Paragraph>Share this Room ID to start a video call!</Paragraph>
          </Card>
        )}

        {isIncomingCall && (
          <Card className="mb-4 bg-blue-50 border-blue-500 border-2">
            <Title level={4}>Incoming Call from {callerData?.name || 'Unknown'}</Title>
            <div className="flex space-x-2">
              <Button type="primary" className="bg-green-600" onClick={answerCall}>
                Accept
              </Button>
              <Button danger onClick={rejectCall}>
                Reject
              </Button>
            </div>
          </Card>
        )}

        {isCallActive && (
          <Card className="mb-4 bg-green-50">
            <Title level={4}>Call Controls</Title>
            <div className="flex space-x-2">
              <Button
                style={{ backgroundColor: 'black' }}
                type={isAudioOn ? 'primary' : 'default'}
                onClick={toggleAudio}
                icon={<span>{isAudioOn ? '🎤' : '🔇'}</span>}
              >
                {isAudioOn ? 'Mute' : 'Unmute'}
              </Button>
              <Button
                style={{ backgroundColor: 'black' }}
                type={isVideoOn ? 'primary' : 'default'}
                onClick={toggleVideo}
                icon={<span>{isVideoOn ? '📹' : '📷'}</span>}
              >
                {isVideoOn ? 'Stop Video' : 'Start Video'}
              </Button>
              <Button danger onClick={endCall}>
                End Call
              </Button>
            </div>
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
              You ({isVideoOn ? 'Camera On' : 'Camera Off'})
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
                <Spin tip="Waiting for remote video..." />
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-gray-800 text-white px-2 py-1 rounded text-sm">
              {remoteStream ? 'Remote User' : 'Waiting for remote video...'}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Call;