import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import { Button, Input, Card, Typography, message, List, Avatar, Badge, Spin } from 'antd';
import { UserOutlined, VideoCameraOutlined, PhoneOutlined } from '@ant-design/icons';
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
  const [roomId, setRoomId] = useState('');
  const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
  const [callStatus, setCallStatus] = useState('Disconnected');
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [pendingCandidates, setPendingCandidates] = useState([]);
  const [remoteDescriptionSet, setRemoteDescriptionSet] = useState(false);
  const [mediaError, setMediaError] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineDoctors, setOnlineDoctors] = useState([]);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reconnectionAttempts, setReconnectionAttempts] = useState(0);
  const [networkStatus, setNetworkStatus] = useState('Checking...');
  const [diagnosticInfo, setDiagnosticInfo] = useState({
    localStream: 'Not initialized',
    remoteStream: 'Not initialized',
    iceState: 'N/A',
    iceCandidates: [],
  });
  const maxReconnectionAttempts = 3;
  const iceGatheringTimeout = 10000;

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // ICE servers with multiple TURN servers
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      {
        urls: [
          'turn:openrelay.metered.ca:80',
          'turn:openrelay.metered.ca:443',
          'turn:turnserver.openrelay.metered.ca:443',
        ],
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
      {
        urls: 'turn:relay1.express-turn.com:3478',
        username: 'testuser',
        credential: 'testpass',
      },
    ],
    iceCandidatePoolSize: 10,
  };

  // Test media devices
  const testMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      console.log('Test media stream:', stream);
      setDiagnosticInfo(prev => ({ ...prev, localStream: 'Initialized' }));
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(e => console.error('Test video play error:', e));
      }
      message.success('Camera and microphone working!');
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Test media error:', error);
      setDiagnosticInfo(prev => ({ ...prev, localStream: `Error: ${error.message}` }));
      message.error('Failed to access media: ' + error.message);
    }
  };

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
      setReconnectionAttempts(0);
      await handleStoreSocketId(newSocket.id);
      await fetchOnlineUsers();
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket error:', error);
      setNetworkStatus('Connection failed');
      if (reconnectionAttempts < maxReconnectionAttempts) {
        setReconnectionAttempts(prev => prev + 1);
        message.warning(`Reconnecting... Attempt ${reconnectionAttempts + 1}/${maxReconnectionAttempts}`);
      } else {
        message.error('Failed to connect to server after retries.');
        setNetworkStatus('Disconnected');
      }
    });

    return () => {
      console.log('Cleaning up socket');
      handleLeaveCall();
      newSocket.close();
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [currentUser, reconnectionAttempts]);

  // Handle ICE candidates
  const addIceCandidateSafely = async (candidate) => {
    if (peerConnection && remoteDescriptionSet) {
      try {
        console.log('Adding ICE candidate:', candidate);
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        setDiagnosticInfo(prev => ({
          ...prev,
          iceCandidates: [...prev.iceCandidates, candidate],
        }));
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
      console.log('Processing ICE candidates:', pendingCandidates);
      for (const candidate of pendingCandidates) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          setDiagnosticInfo(prev => ({
            ...prev,
            iceCandidates: [...prev.iceCandidates, candidate],
          }));
        } catch (error) {
          console.error('Error adding pending ICE candidate:', error);
        }
      }
      setPendingCandidates([]);
    }
  };

  // Create WebRTC peer connection
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(iceServers);
    let iceGatheringTimer;

    pc.ontrack = (event) => {
      console.log('ontrack:', event);
      if (event.streams && event.streams[0]) {
        const stream = event.streams[0];
        console.log('Received remote stream:', stream);
        const videoTracks = stream.getVideoTracks();
        const audioTracks = stream.getAudioTracks();
        console.log('Remote stream video tracks:', videoTracks);
        console.log('Remote stream audio tracks:', audioTracks);
        if (videoTracks.length === 0 && audioTracks.length > 0) {
          message.warning('No video stream received, audio-only mode');
        }
        setRemoteStream(stream);
        setDiagnosticInfo(prev => ({
          ...prev,
          remoteStream: `Initialized (Video: ${videoTracks.length}, Audio: ${audioTracks.length})`,
        }));
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          remoteVideoRef.current.muted = true; // Mute to bypass autoplay restrictions
          remoteVideoRef.current.play().catch(e => {
            console.error('Remote video play error:', e);
            message.error('Failed to play remote video: ' + e.message);
            setDiagnosticInfo(prev => ({ ...prev, remoteStream: `Error: ${e.message}` }));
            // Retry playback after a delay
            setTimeout(() => {
              remoteVideoRef.current.play().catch(err => {
                console.error('Retry play failed:', err);
                message.error('Retry play failed: ' + err.message);
              });
            }, 1000);
          });
        }
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate:', event.candidate);
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          to: callerData?.from || connectedUsers[0],
        });
        setDiagnosticInfo(prev => ({
          ...prev,
          iceCandidates: [...prev.iceCandidates, event.candidate],
        }));
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('ICE Connection State:', pc.iceConnectionState);
      setCallStatus(`Connection: ${pc.iceConnectionState}`);
      setNetworkStatus(`ICE: ${pc.iceConnectionState}`);
      setDiagnosticInfo(prev => ({ ...prev, iceState: pc.iceConnectionState }));
      if (['failed', 'disconnected', 'closed'].includes(pc.iceConnectionState)) {
        console.warn('Connection issue, attempting reconnect...');
        if (reconnectionAttempts < maxReconnectionAttempts) {
          setReconnectionAttempts(prev => prev + 1);
          attemptReconnection();
        } else {
          endCall();
          message.error('Connection failed after retries.');
          setNetworkStatus('Disconnected');
        }
      } else if (pc.iceConnectionState === 'connected') {
        setReconnectionAttempts(0);
      }
    };

    pc.onicegatheringstatechange = () => {
      console.log('ICE Gathering State:', pc.iceGatheringState);
      if (pc.iceGatheringState === 'complete') {
        clearTimeout(iceGatheringTimer);
        console.log('ICE gathering complete');
      }
    };

    pc.onnegotiationneeded = async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log('Created offer:', offer);
        if (socket && connectedUsers[0]) {
          socket.emit('offer', { offer: pc.localDescription, to: connectedUsers[0], from: socket.id });
        }
      } catch (err) {
        console.error('Negotiation error:', err);
        message.error('Failed to negotiate call');
        attemptReconnection();
      }
    };

    // ICE gathering timeout
    iceGatheringTimer = setTimeout(() => {
      console.warn('ICE gathering timeout, forcing completion');
      if (pc.iceGatheringState !== 'complete') {
        socket.emit('ice-candidate', {
          candidate: null,
          to: callerData?.from || connectedUsers[0],
        });
      }
    }, iceGatheringTimeout);

    return pc;
  };

  // Reconnection logic with exponential backoff
  const attemptReconnection = async () => {
    console.log('Attempting reconnection...');
    if (localStream && roomId && socket) {
      await endCall();
      const backoff = Math.pow(2, reconnectionAttempts) * 1000;
      setTimeout(async () => {
        await joinRoom();
        if (callerData?.from) {
          await makeCall(callerData.from);
        }
      }, backoff);
    }
  };

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

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

    socket.on('call-made', async ({ signal, from, name }) => {
      console.log('Call-made:', { signal, from, name });
      setIsIncomingCall(true);
      setCallerData({ signal, from, name });
      setCallStatus('Incoming call...');
      setRemoteDescriptionSet(false);
      setPendingCandidates([]);
      setRemoteStream(null);

      const pc = createPeerConnection();
      setPeerConnection(pc);
      if (localStream) {
        localStream.getTracks().forEach(track => {
          if (track.readyState === 'live') {
            console.log('Adding track:', track);
            pc.addTrack(track, localStream);
          } else {
            console.warn('Track not live:', track);
          }
        });
      }
    });

    socket.on('call-accepted', async (signal) => {
      console.log('Call accepted:', signal);
      setIsCallActive(true);
      setCallStatus('Call connected');
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
          setRemoteDescriptionSet(true);
          await processPendingCandidates();
        } catch (error) {
          console.error('Error setting remote description:', error);
          message.error('Failed to connect call');
          attemptReconnection();
        }
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

    socket.on('offer', async ({ offer, from }) => {
      console.log('Received offer:', { offer, from });
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          setRemoteDescriptionSet(true);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          console.log('Sending answer:', answer);
          socket.emit('answer', { answer, to: from });
          await processPendingCandidates();
        } catch (error) {
          console.error('Error handling offer:', error);
          message.error('Failed to handle offer');
          attemptReconnection();
        }
      }
    });

    socket.on('answer', async ({ answer }) => {
      console.log('Received answer:', answer);
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          setRemoteDescriptionSet(true);
          await processPendingCandidates();
        } catch (error) {
          console.error('Error handling answer:', error);
          message.error('Failed to handle answer');
          attemptReconnection();
        }
      }
    });

    socket.on('ice-candidate', ({ candidate }) => {
      if (candidate) {
        console.log('Received ICE candidate:', candidate);
        addIceCandidateSafely(candidate);
      }
    });

    return () => {
      socket.off('room-users');
      socket.off('user-connected');
      socket.off('user-disconnected');
      socket.off('call-made');
      socket.off('call-accepted');
      socket.off('call-rejected');
      socket.off('call-ended');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  }, [socket, peerConnection, remoteDescriptionSet, pendingCandidates, localStream]);

  // Update remote video stream
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      console.log('Setting remote stream:', remoteStream);
      const videoTracks = remoteStream.getVideoTracks();
      if (videoTracks.length === 0) {
        console.warn('No video tracks in remote stream');
        message.warning('No video stream received from remote user');
      }
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.muted = true; // Mute to bypass autoplay restrictions
      remoteVideoRef.current.play().catch(e => {
        console.error('Remote video play error:', e);
        message.error('Failed to play remote video: ' + e.message);
        setDiagnosticInfo(prev => ({ ...prev, remoteStream: `Error: ${e.message}` }));
        // Retry playback
        setTimeout(() => {
          remoteVideoRef.current.play().catch(err => {
            console.error('Retry play failed:', err);
            message.error('Retry play failed: ' + err.message);
          });
        }, 1000);
      });
    } else if (!remoteStream && remoteVideoRef.current) {
      console.log('Clearing remote video');
      remoteVideoRef.current.srcObject = null;
      setDiagnosticInfo(prev => ({ ...prev, remoteStream: 'Not initialized' }));
    }
  }, [remoteStream]);

  // Join room and initialize media
  const joinRoom = async (retryCount = 0) => {
    if (!roomId || !socket) {
      message.error('Room ID or socket not available');
      return;
    }
    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
      } catch (videoError) {
        console.warn('Video failed, trying audio-only:', videoError);
        if (retryCount < 2) {
          message.warning('Video not available, retrying...');
          setTimeout(() => joinRoom(retryCount + 1), 1000);
          return;
        }
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
        message.warning('Video not available, using audio-only');
        setIsVideoOn(false);
      }

      console.log('Local stream:', stream);
      setLocalStream(stream);
      setMediaError(null);
      setDiagnosticInfo(prev => ({ ...prev, localStream: 'Initialized' }));
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true;
        localVideoRef.current.play().catch(e => {
          console.error('Local video play error:', e);
          setDiagnosticInfo(prev => ({ ...prev, localStream: `Error: ${e.message}` }));
        });
      }

      const pc = createPeerConnection();
      setPeerConnection(pc);
      stream.getTracks().forEach(track => {
        if (track.readyState === 'live') {
          console.log('Adding track to peer:', track);
          pc.addTrack(track, stream);
        } else {
          console.warn('Track not live:', track);
          setDiagnosticInfo(prev => ({
            ...prev,
            localStream: `Error: Track ${track.kind} not live`,
          }));
        }
      });

      socket.emit('join-room', { roomId: roomId.toLowerCase(), userId: socket.id });
      setCallStatus('Connected to room');
      setNetworkStatus('Connected to room');
      await handleStoreSocketId(socket.id);
      setReconnectionAttempts(0);
    } catch (error) {
      console.error('Error joining room:', error);
      setDiagnosticInfo(prev => ({ ...prev, localStream: `Error: ${error.message}` }));
      if (error.name === 'NotAllowedError') {
        setMediaError('Camera or microphone access denied.');
        message.error('Camera or microphone access denied.');
      } else if (error.name === 'NotFoundError') {
        setMediaError('No camera or microphone found.');
        message.error('No camera or microphone found.');
      } else {
        setMediaError('Failed to access media: ' + error.message);
        message.error('Failed to access media: ' + error.message);
      }
    }
  };

  // Call user by socket ID
  const callUserBySocketId = async (targetSocketId, targetUserId) => {
    if (!peerConnection || !socket || !targetSocketId) {
      message.error('Cannot make call: Missing connection or target');
      return;
    }
    try {
      const offer = await peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
      await peerConnection.setLocalDescription(offer);
      console.log('Making call with offer:', offer);
      socket.emit('initiate-call', {
        callerId: currentUser.id,
        calleeId: targetUserId,
        callerName: currentUser.name || currentUser.email,
      });
      setCallStatus('Calling...');
      setNetworkStatus('Calling...');
      setReconnectionAttempts(0);
    } catch (error) {
      console.error('Error making call:', error);
      message.error('Failed to initiate call');
      attemptReconnection();
    }
  };

  // Initiate a call
  const makeCall = async (targetUserId) => {
    if (!peerConnection || !socket || !targetUserId) {
      message.error('Cannot make call: Missing connection or target');
      return;
    }
    try {
      const offer = await peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
      await peerConnection.setLocalDescription(offer);
      console.log('Making call with offer:', offer);
      socket.emit('call-user', { userToCall: targetUserId, signalData: offer, from: socket.id, name: userId });
      setCallStatus('Calling...');
      setNetworkStatus('Calling...');
      setReconnectionAttempts(0);
    } catch (error) {
      console.error('Error making call:', error);
      message.error('Failed to initiate call');
      attemptReconnection();
    }
  };

  // Answer call
  const answerCall = async () => {
    if (!callerData || !peerConnection) {
      message.error('Cannot answer call: Missing data or connection');
      return;
    }
    try {
      console.log('Answering call:', callerData.signal);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(callerData.signal));
      setRemoteDescriptionSet(true);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('answer-call', { signal: answer, to: callerData.from });
      setIsCallActive(true);
      setIsIncomingCall(false);
      setCallStatus('Call connected');
      setNetworkStatus('Call connected');
      await processPendingCandidates();
      setReconnectionAttempts(0);
    } catch (error) {
      console.error('Error answering call:', error);
      message.error('Failed to answer call');
      attemptReconnection();
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
    setRemoteDescriptionSet(false);
    setPendingCandidates([]);
    setRemoteStream(null);
    console.log('Call rejected');
  };

  // End call
  const endCall = async () => {
    console.log('Ending call');
    if (socket && callerData) socket.emit('end-call', { to: callerData.from });
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
    setNetworkStatus('Disconnected');
    setRemoteDescriptionSet(false);
    setPendingCandidates([]);
    setDiagnosticInfo(prev => ({
      ...prev,
      localStream: 'Not initialized',
      remoteStream: 'Not initialized',
      iceState: 'N/A',
      iceCandidates: [],
    }));
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
        console.log('Audio track:', audioTrack.enabled);
        message.info(audioTrack.enabled ? 'Microphone ON' : 'Microphone OFF');
      } else {
        console.warn('No audio track');
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
        console.log('Video track:', videoTrack.enabled);
        message.info(videoTrack.enabled ? 'Camera ON' : 'Camera OFF');
      } else {
        console.warn('No video track');
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
            <strong>ICE State:</strong> {diagnosticInfo.iceState}
          </Paragraph>
          <Paragraph>
            <strong>ICE Candidates:</strong> {diagnosticInfo.iceCandidates.length} received
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
                disabled={!roomId.trim() || !socket}
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