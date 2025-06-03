import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Button, Input, Card, Typography, message } from 'antd';
import { BreadCrumb } from '../components/BreadCrumbs';
// import 'antd/dist/antd.min.css';

const { Title, Paragraph } = Typography;

const Call = () => {

   const breadcrumbs = [
    {
      title: <a href="/health">Home</a>,
    },
    {
      title: <a href=" /health">Health</a>,
    },
    {
      title: <a href="/health/appointments">Appointment</a>,
    },
    {
      title: "Call/Chat",
    },
  ]; 


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

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
    ],
  };

  useEffect(() => {
    const newSocket = io('https://e-health-backend-production.up.railway.app/', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
    setSocket(newSocket);
    return () => {
      newSocket.close();
      if (localStream) localStream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const addIceCandidateSafely = async (candidate) => {
    if (peerConnection && remoteDescriptionSet) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    } else {
      setPendingCandidates(prev => [...prev, candidate]);
    }
  };

  const processPendingCandidates = async () => {
    if (peerConnection && remoteDescriptionSet && pendingCandidates.length > 0) {
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

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(iceServers);
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          remoteVideoRef.current.play().catch(e => console.log('Remote video play error:', e));
        }
      }
    };
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          to: callerData?.from || connectedUsers[0],
        });
      }
    };
    pc.oniceconnectionstatechange = () => {
      setCallStatus(`Connection: ${pc.iceConnectionState}`);
      if (pc.iceConnectionState === 'failed') {
        endCall();
        message.error('Connection failed');
      }
    };
    pc.onnegotiationneeded = async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        if (socket && connectedUsers[0]) {
          socket.emit('offer', { offer: pc.localDescription, to: connectedUsers[0] });
        }
      } catch (err) {
        console.error('Error during negotiation:', err);
      }
    };
    return pc;
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('room-users', (users) => {
      setConnectedUsers(users.filter(user => user !== userId));
    });

    socket.on('user-connected', (newUserId) => {
      if (newUserId !== userId) {
        setConnectedUsers(prev => [...new Set([...prev, newUserId])]);
        setCallStatus(`User ${newUserId} joined`);
      }
    });

    socket.on('user-disconnected', (disconnectedUserId) => {
      setConnectedUsers(prev => prev.filter(id => id !== disconnectedUserId));
      setCallStatus(`User ${disconnectedUserId} left`);
    });

    socket.on('call-made', async ({ signal, from, name }) => {
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

    socket.on('call-accepted', async (signal) => {
      setIsCallActive(true);
      setCallStatus('Call connected');
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
          setRemoteDescriptionSet(true);
          await processPendingCandidates();
        } catch (error) {
          console.error('Error setting remote description:', error);
        }
      }
    });

    socket.on('call-rejected', () => {
      setCallStatus('Call rejected');
      endCall();
      message.warning('Call was rejected');
    });

    socket.on('call-ended', () => {
      setCallStatus('Call ended');
      endCall();
      message.info('Call ended');
    });

    socket.on('offer', async ({ offer, from }) => {
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          setRemoteDescriptionSet(true);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit('answer', { answer, to: from });
          await processPendingCandidates();
        } catch (error) {
          console.error('Error handling offer:', error);
        }
      }
    });

    socket.on('answer', async ({ answer }) => {
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          setRemoteDescriptionSet(true);
          await processPendingCandidates();
        } catch (error) {
          console.error('Error handling answer:', error);
        }
      }
    });

    socket.on('ice-candidate', ({ candidate }) => {
      if (candidate) addIceCandidateSafely(candidate);
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
  }, [socket, peerConnection, remoteDescriptionSet, pendingCandidates, localStream, userId, callerData, connectedUsers]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(e => {
        console.log('Remote video autoplay prevented:', e);
        remoteVideoRef.current.muted = true;
        remoteVideoRef.current.play();
      });
    } else if (!remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }, [remoteStream]);

  const joinRoom = async () => {
    if (!roomId || !socket) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(e => {
          localVideoRef.current.muted = true;
          localVideoRef.current.play();
        });
      }

      const pc = createPeerConnection();
      setPeerConnection(pc);
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      socket.emit('join-room', { roomId, userId });
      setCallStatus('Connected to room');
    } catch (error) {
      console.error('Error joining room:', error);
      message.error(
        error.name === 'NotAllowedError'
          ? 'Camera/microphone permission denied'
          : 'Failed to access camera/microphone'
      );
    }
  };

  const makeCall = async (targetUserId) => {
    if (!peerConnection || !socket || !targetUserId) return;
    try {
      const offer = await peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
      await peerConnection.setLocalDescription(offer);
      socket.emit('call-user', { userToCall: targetUserId, signalData: offer, from: socket.id, name: userId });
      setCallStatus('Calling...');
    } catch (error) {
      console.error('Error making call:', error);
      message.error('Failed to initiate call');
    }
  };

  const answerCall = async () => {
    if (!callerData || !peerConnection) return;
    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(callerData.signal));
      setRemoteDescriptionSet(true);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('answer-call', { signal: answer, to: callerData.from });
      setIsCallActive(true);
      setIsIncomingCall(false);
      setCallStatus('Call connected');
      await processPendingCandidates();
    } catch (error) {
      console.error('Error answering call:', error);
      message.error('Failed to answer call');
    }
  };

  const rejectCall = () => {
    if (socket && callerData) {
      socket.emit('reject-call', { to: callerData.from });
    }
    setIsIncomingCall(false);
    setCallerData(null);
    setCallStatus('Call rejected');
    setRemoteDescriptionSet(false);
    setPendingCandidates([]);
    setRemoteStream(null);
  };

  const endCall = () => {
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
    setRemoteDescriptionSet(false);
    setPendingCandidates([]);
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
        message.info(audioTrack.enabled ? 'Microphone ON' : 'Microphone OFF');
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
        message.info(videoTrack.enabled ? 'Camera ON' : 'Camera OFF');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
            <BreadCrumb items={breadcrumbs} />
      
      <header className=" p-4 flex justify-between items-center">
        <Title level={3} className=""> Video Call</Title>
        <div className="flex items-center space-x-4">
          <span className="text-sm"> Use this id to start call{userId}</span>
          <Button type="primary" danger onClick={endCall} >
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
        </Card>

        {!localStream && (
          <Card className="mb-4 border-blue-500 border-2">
            <Title level={4}>Join Room</Title>
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Enter Room ID (e.g., room123)"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-64"
              />
              <Button type="primary" onClick={joinRoom} disabled={!roomId.trim()} style={{backgroundColor:'black'}}>
                Join
              </Button>
            </div>
            <Paragraph className="text-sm text-gray-500">
              Share the Room ID with others to start a video call!
            </Paragraph>
              <Paragraph className="text-sm text-gray-500">
                   <span className="text-sm"> Use this id to start call :: {userId}</span>

            </Paragraph>
          </Card>
        )}

        {localStream && !isCallActive && !isIncomingCall && connectedUsers.length > 0 && (
          <Card className="mb-4 border-green-500 border-2">
            <Title level={4}>Available Users</Title>
            {connectedUsers.map(user => (
              <div
                key={user}
                className="flex justify-between items-center p-2 bg-gray-50 rounded mb-2"
              >
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
            <Title level={4}>Incoming Call from {callerData?.name}</Title>
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
              style={{backgroundColor:'black'}}
                type={isAudioOn ? 'primary' : 'default'}
                onClick={toggleAudio}
                icon={<span>{isAudioOn ? '🎤' : '🔇'}</span>}
              >
                {isAudioOn ? 'Mute' : 'Unmute'}
              </Button>
              <Button
              style={{backgroundColor:'black'}}

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
              You  ({isVideoOn ? 'Camera On' : 'Camera Off'})
            </div>
          </div>
          <div className="relative">
            <Title level={4} className="text-center">
            Doctor 
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