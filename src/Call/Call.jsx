import React, { useState, useEffect, useRef, useContext } from 'react';
import { Button, Input, Card, Typography, message, List, Avatar, Badge } from 'antd';
import { UserOutlined, VideoCameraOutlined, PhoneOutlined } from '@ant-design/icons';
import { AuthContext } from '../components/context/AuthContext';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import CryptoJS from 'crypto-js';

const { Title, Paragraph } = Typography;

// ZEGOCLOUD credentials
const appID = 695626790;
const serverSecret = '08b17ed68b9d48ed301e32184ed7a624';

const Call = () => {
  const { currentUser } = useContext(AuthContext);
  const [zg, setZg] = useState(null);
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

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Generate ZEGOCLOUD token
  const generateToken = (userID, roomID) => {
    try {
      const time = Math.floor(Date.now() / 1000);
      const effectiveTimeInSeconds = 3600; // Token valid for 1 hour
      const payload = '';
      const hash = CryptoJS.HmacSHA256(
        `${roomID}${userID}${time}${effectiveTimeInSeconds}${payload}`,
        serverSecret
      ).toString(CryptoJS.enc.Hex);
      return `04AAAA${time}${effectiveTimeInSeconds}${userID}${roomID}${hash}`;
    } catch (error) {
      console.error('Error generating token:', error);
      throw new Error('Failed to generate ZEGOCLOUD token');
    }
  };

  // Initialize ZEGOCLOUD SDK
  useEffect(() => {
    const zgInstance = new ZegoExpressEngine(appID, 'wss://webliveroom695626790-api.coolzcloud.com/ws');
    setZg(zgInstance);

    zgInstance.on('roomStateUpdate', (roomID, state, errorCode) => {
      console.log('Room state update:', { roomID, state, errorCode });
      if (state === 'CONNECTED') {
        setCallStatus('Connected to room');
        setIsUserOnline(true);
        message.success('Successfully connected to call service');
      } else if (state === 'DISCONNECTED') {
        setCallStatus('Disconnected');
        setIsUserOnline(false);
        message.error('Disconnected from call service');
      }
    });

    zgInstance.on('roomUserUpdate', (roomID, updateType, userList) => {
      console.log('Room user update:', { roomID, updateType, userList });
      if (updateType === 'ADD') {
        setConnectedUsers(userList.map(user => user.userID));
        setCallStatus(`User ${userList[0]?.userID} joined`);
      } else if (updateType === 'DELETE') {
        setConnectedUsers(prev => prev.filter(id => !userList.some(user => user.userID === id)));
        setCallStatus(`User ${userList[0]?.userID} left`);
      }
    });

    zgInstance.on('roomStreamUpdate', async (roomID, updateType, streamList) => {
      console.log('Room stream update:', { roomID, updateType, streamList });
      if (updateType === 'ADD') {
        const stream = streamList[0];
        try {
          const remoteStream = await zgInstance.startPlayingStream(stream.streamID);
          setRemoteStream(remoteStream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play().catch(e => console.error('Remote video play error:', e));
          }
          setIsCallActive(true);
          setCallStatus('Call connected');
        } catch (error) {
          console.error('Error playing stream:', error);
          message.error('Failed to play remote stream');
        }
      } else if (updateType === 'DELETE') {
        setRemoteStream(null);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
        setIsCallActive(false);
        setCallStatus('Call ended');
      }
    });

    return () => {
      if (zgInstance) {
        zgInstance.logoutRoom(roomId);
        if (localStream) {
          zgInstance.stopPublishingStream(userId);
          localStream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, []);

  // Fetch online users (mocked for simplicity, replace with actual API calls if needed)
  const fetchOnlineUsers = async () => {
    if (!currentUser?.id) {
      console.log('No current user found, cannot fetch online users');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching online users for role:', currentUser.role);
      // Mocked data - replace with actual API calls to your backend
      const mockUsers = [
        { _id: 'user1', socketId: 'user1_socket', name: 'Employee 1' },
        { _id: 'user2', socketId: 'user2_socket', name: 'Employee 2' },
      ];
      const mockDoctors = [
        { _id: 'doc1', socketId: 'doc1_socket', name: 'Doctor 1' },
        { _id: 'doc2', socketId: 'doc2_socket', name: 'Doctor 2' },
      ];

      if (currentUser.role === 'doctor') {
        setOnlineUsers(mockUsers);
        console.log('Set online users:', mockUsers);
      } else if (currentUser.role === 'employee') {
        setOnlineDoctors(mockDoctors);
        console.log('Set online doctors:', mockDoctors);
      }
    } catch (error) {
      console.error('Error fetching online users:', error);
      message.error('Failed to fetch online users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Join room and initialize media
  const joinRoom = async () => {
    if (!roomId || !zg) {
      message.error('Room ID or ZEGOCLOUD instance not available');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      console.log('Local stream obtained:', stream);
      setLocalStream(stream);
      setMediaError(null);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(e => {
          console.error('Local video autoplay error:', e);
          localVideoRef.current.muted = true;
          localVideoRef.current.play();
        });
      }

      const token = generateToken(userId, roomId);
      await zg.loginRoom(roomId, token, { userID: userId, userName: currentUser?.name || userId });
      await zg.startPublishingStream(userId, stream);
      setCallStatus('Connected to room');
      await fetchOnlineUsers();
    } catch (error) {
      console.error('Error joining room:', error);
      if (error.message === 'Failed to generate ZEGOCLOUD token') {
        setMediaError('Failed to generate authentication token. Please check your setup.');
        message.error('Failed to generate authentication token. Please check your setup.');
      } else if (error.name === 'NotAllowedError') {
        setMediaError('Camera or microphone access denied. Please allow permissions.');
        message.error('Camera or microphone access denied. Please allow permissions.');
      } else if (error.name === 'NotFoundError') {
        setMediaError('No camera or microphone found. Please check your devices.');
        message.error('No camera or microphone found. Please check your devices.');
      } else {
        setMediaError(`Failed to join room: ${error.message}`);
        message.error(`Failed to join room: ${error.message}`);
      }
    }
  };

  // Call user directly
  const callUserBySocketId = async (targetSocketId, targetUserId) => {
    if (!zg || !roomId) {
      message.error('Cannot make call: ZEGOCLOUD or room not initialized');
      return;
    }
    try {
      const token = generateToken(userId, roomId);
      await zg.loginRoom(roomId, token, { userID: userId, userName: currentUser?.name || userId });
      setCallStatus('Calling...');
      setIsCallActive(true);
    } catch (error) {
      console.error('Error making call:', error);
      if (error.message === 'Failed to generate ZEGOCLOUD token') {
        message.error('Failed to generate authentication token. Please check your setup.');
      } else {
        message.error('Failed to initiate call: ' + error.message);
      }
    }
  };

  // End the call
  const endCall = async () => {
    console.log('Ending call');
    if (zg) {
      zg.logoutRoom(roomId);
      zg.stopPublishingStream(userId);
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
    setIsCallActive(false);
    setIsIncomingCall(false);
    setCallerData(null);
    setCallStatus('Disconnected');
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
        console.log('Audio track enabled:', audioTrack.enabled);
        message.info(audioTrack.enabled ? 'Microphone ON' : 'Microphone OFF');
      } else {
        console.warn('No audio track found');
        message.error('No audio track available');
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
        console.log('Video track enabled:', videoTrack.enabled);
        message.info(videoTrack.enabled ? 'Camera ON' : 'Camera OFF');
      } else {
        console.warn('No video track found');
        message.error('No video track available');
      }
    }
  };

  // Refresh online users
  const refreshOnlineUsers = () => {
    fetchOnlineUsers();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <header className="p-4 flex justify-between items-center">
        <Title level={3}>Video Call</Title>
        <div className="flex items-center space-x-4">
          <span className="text-sm">User ID: {userId}</span>
          <Badge status={isUserOnline ? 'success' : 'error'} text={isUserOnline ? 'Online' : 'Offline'} />
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

        {mediaError && (
          <Card className="mb-4 border-red-500 border-2">
            <Title level={4}>Error</Title>
            <Paragraph className="text-red-500">{mediaError}</Paragraph>
            <Button type="primary" onClick={joinRoom}>
              Retry
            </Button>
          </Card>
        )}

        {/* Online Users Section */}
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
                      title={`Employee ${user.name || user._id}`}
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
                      title={`Doctor ${doctor.name || doctor._id}`}
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
                  Make sure doctors/employees are logged in and have connected to the call service.
                </Paragraph>
              </div>
            )}
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
              <Button type="primary" onClick={joinRoom} disabled={!roomId.trim() || !zg} style={{ backgroundColor: 'black' }}>
                Join
              </Button>
            </div>
            <Paragraph className="text-sm text-gray-500">
              Share the Room ID with others to start a video call!
            </Paragraph>
            <Paragraph className="text-sm text-gray-500">
              <span>Your User ID: {userId}</span>
            </Paragraph>
          </Card>
        )}

        {localStream && !isCallActive && !isIncomingCall && connectedUsers.length > 0 && (
          <Card className="mb-4 border-green-500 border-2">
            <Title level={4}>Available Users in Room</Title>
            {connectedUsers.map(user => (
              <div key={user} className="flex justify-between items-center p-2 bg-gray-50 rounded mb-2">
                <span className="font-medium">{user}</span>
                <Button type="primary" className="bg-green-600" onClick={() => callUserBySocketId(user, user)}>
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
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-[500px] bg-black rounded-lg object-cover border-2 border-green-500"
            />
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