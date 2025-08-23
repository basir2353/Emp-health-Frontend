import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import { Button, Card, Typography, message, List, Avatar, Badge } from 'antd';
import { UserOutlined, PhoneOutlined, AudioOutlined, AudioMutedOutlined, VideoCameraOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import { AuthContext } from '../components/context/AuthContext';
import { storeSocketId, getOnlineUsers, getOnlineDoctors, leaveCall } from '../api/callApi';

const { Title, Paragraph } = Typography;

const Call = () => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [callerData, setCallerData] = useState(null);
  const [callStatus, setCallStatus] = useState('Disconnected');
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [pendingCandidates, setPendingCandidates] = useState([]);
  const [remoteDescriptionSet, setRemoteDescriptionSet] = useState(false);
  const [mediaError, setMediaError] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineDoctors, setOnlineDoctors] = useState([]);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [loading, setLoading] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
    ],
  };

  // Store socket ID in backend
  const handleStoreSocketId = async (socketId) => {
    if (!currentUser?.id) {
      console.warn('No current user found');
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

  // Handle user disconnection
  const handleLeaveCall = async () => {
    if (!currentUser?.id) {
      console.warn('No current user found');
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

  // Fetch online users based on role
  const fetchOnlineUsers = async () => {
    if (!currentUser?.id) {
      console.log('No current user, cannot fetch online users');
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
      console.error('Error fetching online users:', error);
      message.error('Failed to fetch online users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize Socket.IO
  useEffect(() => {
    const newSocket = io('https://empolyee-backedn.onrender.com/', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on('connect', async () => {
      console.log('Socket connected:', newSocket.id);
      setCallStatus('Socket connected');
      await handleStoreSocketId(newSocket.id);
      await fetchOnlineUsers();
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      message.error('Failed to connect to server');
      setCallStatus('Socket connection failed');
    });

    return () => {
      console.log('Cleaning up socket');
      handleLeaveCall();
      newSocket.close();
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [currentUser]);

  // Create WebRTC peer connection
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(iceServers);
    pc.ontrack = (event) => {
      console.log('Received remote stream:', event.streams[0]);
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.play().catch(e => {
          console.error('Remote video play error:', e);
          remoteVideoRef.current.muted = true;
          remoteVideoRef.current.play();
        });
      }
    };
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate:', event.candidate);
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          target: callerData?.from || onlineUsers[0]?.socketId || onlineDoctors[0]?.socketId,
        });
      }
    };
    pc.oniceconnectionstatechange = () => {
      console.log('ICE Connection State:', pc.iceConnectionState, 'Signaling State:', pc.signalingState);
      setCallStatus(`Connection: ${pc.iceConnectionState}`);
      if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
        endCall();
        message.error('Connection failed or disconnected');
      }
    };
    return pc;
  };

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    socket.on('call-made', async ({ signal, from, name }) => {
      console.log('Received call-made:', { signal, from, name });
      setIsIncomingCall(true);
      setCallerData({ signal, from, name });
      setCallStatus('Incoming call...');
      setRemoteDescriptionSet(false);
      setPendingCandidates([]);
      setRemoteStream(null);

      const pc = createPeerConnection();
      setPeerConnection(pc);
      if (localStream) {
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
      }
    });

    socket.on('answer', async ({ answer, from }) => {
      console.log('Received answer:', answer);
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          setRemoteDescriptionSet(true);
          await processPendingCandidates();
          setIsCallActive(true);
          setCallStatus('Call connected');
        } catch (error) {
          console.error('Error setting answer:', error);
          message.error('Failed to connect call');
        }
      }
    });

    socket.on('ice-candidate', ({ candidate }) => {
      if (candidate) {
        console.log('Received ICE candidate:', candidate);
        addIceCandidateSafely(candidate);
      }
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
      socket.off('call-made');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('call-rejected');
      socket.off('call-ended');
    };
  }, [socket, peerConnection, remoteDescriptionSet, pendingCandidates, localStream]);

  // Add ICE candidate safely
  const addIceCandidateSafely = async (candidate) => {
    if (peerConnection && remoteDescriptionSet) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    } else {
      console.log('Queuing ICE candidate:', candidate);
      setPendingCandidates(prev => [...prev, candidate]);
    }
  };

  // Process queued ICE candidates
  const processPendingCandidates = async () => {
    if (peerConnection && remoteDescriptionSet && pendingCandidates.length > 0) {
      console.log('Processing pending ICE candidates:', pendingCandidates);
      for (const candidate of pendingCandidates) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error('Error adding pending ICE candidate:', error);
        }
      }
      setPendingCandidates([]);
    }
  };

  // Initialize media
  const initializeMedia = async () => {
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
          console.error('Local video play error:', e);
          localVideoRef.current.muted = true;
          localVideoRef.current.play();
        });
      }
    } catch (error) {
      console.error('Error accessing media:', error);
      if (error.name === 'NotAllowedError') {
        setMediaError('Camera or microphone access denied.');
        message.error('Camera or microphone access denied.');
      } else if (error.name === 'NotFoundError') {
        setMediaError('No camera or microphone found.');
        message.error('No camera or microphone found.');
      } else {
        setMediaError('Failed to access camera/microphone: ' + error.message);
        message.error('Failed to access camera/microphone.');
      }
    }
  };

  // Call user by socket ID
  const callUserBySocketId = async (targetSocketId, targetUserId) => {
    if (!socket || !targetSocketId) {
      message.error('Cannot make call: Missing socket or target user');
      return;
    }
    try {
      const pc = createPeerConnection();
      setPeerConnection(pc);
      if (localStream) {
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
      } else {
        await initializeMedia();
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
      }
      const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
      await pc.setLocalDescription(offer);
      console.log('Making call with offer:', offer);
      socket.emit('initiate-call', {
        callerId: currentUser.id,
        calleeId: targetUserId,
        callerName: currentUser.name || currentUser.email,
        offer,
        from: socket.id,
      });
      setCallStatus('Calling...');
    } catch (error) {
      console.error('Error making call:', error);
      message.error('Failed to initiate call');
    }
  };

  // Answer call
  const answerCall = async () => {
    if (!callerData || !peerConnection) {
      message.error('Cannot answer call: Missing caller data or peer connection');
      return;
    }
    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(callerData.signal));
      setRemoteDescriptionSet(true);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('answer', { answer, target: callerData.from });
      setIsCallActive(true);
      setIsIncomingCall(false);
      setCallStatus('Call connected');
      await processPendingCandidates();
    } catch (error) {
      console.error('Error answering call:', error);
      message.error('Failed to answer call');
    }
  };

  // Reject call
  const rejectCall = () => {
    if (socket && callerData) {
      socket.emit('reject-call', { target: callerData.from });
    }
    setIsIncomingCall(false);
    setCallerData(null);
    setCallStatus('Call rejected');
    setRemoteDescriptionSet(false);
    setPendingCandidates([]);
    setRemoteStream(null);
  };

  // End call
  const endCall = async () => {
    console.log('Ending call');
    if (socket && callerData) {
      socket.emit('end-call', { target: callerData.from });
    }
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
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
    setRemoteDescriptionSet(false);
    setPendingCandidates([]);
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    await handleLeaveCall();
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
        message.info(audioTrack.enabled ? 'Microphone ON' : 'Microphone OFF');
      } else {
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
        message.info(videoTrack.enabled ? 'Camera ON' : 'Camera OFF');
      } else {
        message.error('No video track available');
      }
    }
  };

  // Update remote video
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(e => {
        console.error('Remote video autoplay error:', e);
        remoteVideoRef.current.muted = true;
        remoteVideoRef.current.play();
      });
    } else if (!remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }, [remoteStream]);

  // Initialize media on mount
  useEffect(() => {
    if (currentUser && socket && socket.connected && !localStream && !mediaError) {
      initializeMedia();
    }
  }, [currentUser, socket]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <header className="p-4 flex justify-between items-center">
        <Title level={3}>Video Call</Title>
        <div className="flex items-center space-x-4">
          <span className="text-sm">User ID: {socket?.id || 'Not connected'}</span>
          <Badge status={isUserOnline ? 'success' : 'error'} text={isUserOnline ? 'Online' : 'Offline'} />
          <Button type="primary" danger onClick={endCall}>
            Leave Call
          </Button>
        </div>
      </header>
      <main className="flex-grow p-4">
        <Card className="mb-4 shadow-md">
          <Paragraph><strong>Status:</strong> {callStatus}</Paragraph>
          {currentUser && (
            <Paragraph><strong>Logged in as:</strong> {currentUser.name || currentUser.email} ({currentUser.role})</Paragraph>
          )}
        </Card>

        {mediaError && (
          <Card className="mb-4 border-red-500 border-2">
            <Title level={4}>Media Error</Title>
            <Paragraph className="text-red-500">{mediaError}</Paragraph>
            <Button type="primary" onClick={initializeMedia}>
              Retry
            </Button>
          </Card>
        )}

        {currentUser && !isCallActive && !isIncomingCall && (
          <Card className="mb-4 border-green-500 border-2">
            <div className="flex justify-between items-center mb-4">
              <Title level={4}>{currentUser.role === 'doctor' ? 'Online Employees' : 'Online Doctors'}</Title>
              <Button onClick={fetchOnlineUsers} loading={loading}>
                Refresh
              </Button>
            </div>
            {currentUser.role === 'doctor' && onlineUsers.length > 0 && (
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
                      </Button>,
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
            {currentUser.role === 'employee' && onlineDoctors.length > 0 && (
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
            {((currentUser.role === 'doctor' && onlineUsers.length === 0) ||
              (currentUser.role === 'employee' && onlineDoctors.length === 0)) && (
              <Paragraph className="text-gray-500">
                No {currentUser.role === 'doctor' ? 'employees' : 'doctors'} online.
              </Paragraph>
            )}
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
                type={isAudioOn ? 'primary' : 'default'}
                onClick={toggleAudio}
                icon={isAudioOn ? <AudioOutlined /> : <AudioMutedOutlined />}
              >
                {isAudioOn ? 'Mute' : 'Unmute'}
              </Button>
              <Button
                type={isVideoOn ? 'primary' : 'default'}
                onClick={toggleVideo}
                icon={isVideoOn ? <VideoCameraOutlined /> : <VideoCameraAddOutlined />}
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
            <Title level={4} className="text-center">Your Video</Title>
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
            <Title level={4} className="text-center">{currentUser?.role === 'doctor' ? 'Patient' : 'Doctor'}</Title>
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
