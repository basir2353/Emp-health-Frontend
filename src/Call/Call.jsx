import React, { useState, useEffect, useRef } from 'react';
    import { render } from 'react-dom';
    import io from 'socket.io-client';
    import { Button, Input, Alert, Card, Typography, Tag, message } from 'antd';
    import { Link } from 'react-router-dom';
    import { AudioMutedOutlined, AudioOutlined, VideoCameraOutlined, VideoCameraAddOutlined, PhoneOutlined, CopyOutlined } from '@ant-design/icons';

    const { Title, Paragraph, Text } = Typography;

    const Call = () => {
      const [socket, setSocket] = useState(null);
      const [localStream, setLocalStream] = useState(null);
      const [remoteStream, setRemoteStream] = useState(null);
      const [peerConnection, setPeerConnection] = useState(null);
      const [isCallActive, setIsCallActive] = useState(false);
      const [isIncomingCall, setIsIncomingCall] = useState(false);
      const [callerData, setCallerData] = useState(null);
      const [roomId, setRoomId] = useState('');
      const [userId, setUserId] = useState('');
      const [isConnected, setIsConnected] = useState(false);
      const [callStatus, setCallStatus] = useState('Disconnected');
      const [connectedUsers, setConnectedUsers] = useState([]);
      const [pendingCandidates, setPendingCandidates] = useState([]);
      const [remoteDescriptionSet, setRemoteDescriptionSet] = useState(false);
      const [isAudioMuted, setIsAudioMuted] = useState(false);
      const [isVideoMuted, setIsVideoMuted] = useState(false);

      const localVideoRef = useRef(null);
      const remoteVideoRef = useRef(null);

      const iceServers = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
        ],
      };

      useEffect(() => {
        const storedUserId = localStorage.getItem('userId') || `user_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('userId', storedUserId);
        setUserId(storedUserId);

        const newSocket = io('https://e-health-backend-production.up.railway.app/', {
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });
        setSocket(newSocket);

        return () => {
          newSocket.close();
          if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
          }
        };
      }, []);

      const addIceCandidateSafely = async (candidate) => {
        if (peerConnection && remoteDescriptionSet) {
          try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            console.log('Added ICE candidate:', candidate);
          } catch (error) {
            console.error('Error adding ICE candidate:', error);
          }
        } else {
          setPendingCandidates(prev => [...prev, candidate]);
          console.log('Added candidate to pending:', candidate);
        }
      };

      const processPendingCandidates = async () => {
        if (peerConnection && remoteDescriptionSet && pendingCandidates.length > 0) {
          for (const candidate of pendingCandidates) {
            try {
              await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
              console.log('Processed pending ICE candidate:', candidate);
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
            console.log('Received remote stream with tracks:', event.streams[0].getTracks());
            setRemoteStream(event.streams[0]);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = event.streams[0];
              remoteVideoRef.current.play().catch(e => console.log('Remote video autoplay prevented:', e));
            }
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            if (socket) {
              const targetId = callerData?.from || connectedUsers[0];
              socket.emit('ice-candidate', {
                candidate: event.candidate,
                to: targetId,
              });
              console.log('Sent ICE candidate:', event.candidate);
            }
          }
        };

        pc.oniceconnectionstatechange = () => {
          setCallStatus(`Connection: ${pc.iceConnectionState}`);
          if (pc.iceConnectionState === 'disconnected') {
            message.warning('Network issue detected. Attempting to reconnect...');
          }
        };

        pc.onconnectionstatechange = () => {
          if (pc.connectionState === 'connected') {
            setCallStatus('Connected');
          } else if (pc.connectionState === 'failed') {
            setCallStatus('Connection failed');
            endCall();
          }
        };

        pc.onnegotiationneeded = async () => {
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            if (socket && connectedUsers[0]) {
              socket.emit('offer', {
                offer: pc.localDescription,
                to: connectedUsers[0],
              });
              console.log('Sent offer on negotiation needed:', pc.localDescription);
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
          console.log('Room users updated:', users);
        });

        socket.on('user-connected', (newUserId) => {
          if (newUserId !== userId) {
            setConnectedUsers(prev => [...prev, newUserId]);
            setCallStatus(`User ${newUserId} joined the room`);
          }
        });

        socket.on('user-disconnected', (disconnectedUserId) => {
          setConnectedUsers(prev => prev.filter(id => id !== disconnectedUserId));
          setCallStatus(`User ${disconnectedUserId} left the room`);
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
            localStream.getTracks().forEach(track => {
              pc.addTrack(track, localStream);
              console.log('Added local track to peer connection:', track);
            });
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
              console.log('Set remote description for accepted call:', signal);
            } catch (error) {
              console.error('Error setting remote description:', error);
            }
          }
        });

        socket.on('call-rejected', () => {
          setCallStatus('Call rejected');
          endCall();
        });

        socket.on('call-ended', () => {
          setCallStatus('Call ended');
          endCall();
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
              console.log('Handled offer and sent answer:', answer);
            } catch (error) {
              console.error('Error handling offer:', error);
            }
          }
        });

        socket.on('answer', async ({ answer, from }) => {
          if (peerConnection) {
            try {
              await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
              setRemoteDescriptionSet(true);
              await processPendingCandidates();
              console.log('Set remote description for answer:', answer);
            } catch (error) {
              console.error('Error handling answer:', error);
            }
          }
        });

        socket.on('ice-candidate', ({ candidate, from }) => {
          if (candidate) {
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
      }, [socket, peerConnection, remoteDescriptionSet, pendingCandidates, localStream, userId, callerData, connectedUsers]);

      useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play().catch(() => {
            remoteVideoRef.current.muted = true;
            remoteVideoRef.current.play().catch(err => {
              console.error('Remote video playback failed:', err);
            });
          });
        } else if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
      }, [remoteStream]);

      const joinRoom = async () => {
        if (!roomId || !socket) {
          setCallStatus('Please enter a valid Room ID');
          return;
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
            audio: { echoCancellation: true, noiseSuppression: true },
          }).catch(err => {
            if (err.name === 'NotAllowedError') {
              setCallStatus('Please grant camera and microphone permissions.');
            } else if (err.name === 'NotFoundError') {
              setCallStatus('No camera or microphone detected.');
            } else {
              setCallStatus(`Media error: ${err.message}`);
            }
            throw err;
          });

          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play().catch(() => {
              localVideoRef.current.muted = true;
              localVideoRef.current.play();
            });
          }

          const pc = createPeerConnection();
          setPeerConnection(pc);
          stream.getTracks().forEach(track => {
            pc.addTrack(track, stream);
            console.log('Added local track to peer connection on join:', track);
          });
          socket.emit('join-room', { roomId, userId });
          setIsConnected(true);
          setCallStatus(`Joined room ${roomId}`);
        } catch (error) {
          console.error('Join room failed:', error);
        }
      };

      const makeCall = async (targetUserId) => {
        if (!peerConnection || !socket || !targetUserId) return;
        try {
          const offer = await peerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          await peerConnection.setLocalDescription(offer);
          socket.emit('call-user', {
            userToCall: targetUserId,
            signalData: offer,
            from: socket.id,
            name: userId,
          });
          setCallStatus('Calling...');
          console.log('Initiated call with offer:', offer);
        } catch (error) {
          setCallStatus('Call failed: ' + error.message);
          console.error('Error making call:', error);
        }
      };

      const answerCall = async () => {
        if (!callerData || !peerConnection) return;
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(callerData.signal));
          setRemoteDescriptionSet(true);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit('answer-call', {
            signal: answer,
            to: callerData.from,
          });
          setIsCallActive(true);
          setIsIncomingCall(false);
          setCallStatus('Call connected');
          await processPendingCandidates();
          console.log('Answered call with answer:', answer);
          // Ensure local tracks are added again in case they were missed
          if (localStream) {
            localStream.getTracks().forEach(track => {
              peerConnection.addTrack(track, localStream);
              console.log('Added local track after answering:', track);
            });
          }
        } catch (error) {
          console.error('Error answering call:', error);
          setCallStatus('Failed to answer call');
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
        setCallStatus('Call ended');
        setRemoteDescriptionSet(false);
        setPendingCandidates([]);
        setIsAudioMuted(false);
        setIsVideoMuted(false);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
      };

      const toggleAudio = () => {
        if (localStream) {
          const audioTrack = localStream.getAudioTracks()[0];
          if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsAudioMuted(!audioTrack.enabled);
            setCallStatus(`Audio ${audioTrack.enabled ? 'unmuted' : 'muted'}`);
          }
        }
      };

      const toggleVideo = () => {
        if (localStream) {
          const videoTrack = localStream.getVideoTracks()[0];
          if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoMuted(!videoTrack.enabled);
            setCallStatus(`Video ${videoTrack.enabled ? 'unmuted' : 'muted'}`);
          }
        }
      };

      const copyRoomId = () => {
        navigator.clipboard.writeText(roomId).then(() => {
          message.success('Room ID copied to clipboard!');
        }).catch(() => {
          message.error('Failed to copy Room ID');
        });
      };

      return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
          {!isCallActive && (
            <div className="p-6 max-w-4xl mx-auto">
              <Title level={2} className="text-center text-white">EMpolyee Video Calling</Title>

              <Link to="/health/appointments" className="flex justify-center mb-4">
                <Button
                  type="primary"
                  onClick={async () => {
                    const devices = await navigator.mediaDevices.enumerateDevices();
                    console.log('Available devices:', devices);
                  }}
                  className="bg-black border-black hover:bg-gray-800"
                >
                  Check Available Devices
                </Button>
              </Link>

              <Card className="mb-6 bg-gray-800 border-gray-700 text-white">
                <Paragraph><strong>Status:</strong> {callStatus}</Paragraph>
                <Paragraph><strong>Your ID:</strong> {userId}</Paragraph>
                {isConnected && (
                  <Paragraph>
                    <strong>Room:</strong> {roomId} {' '}
                    <Button
                      icon={<CopyOutlined />}
                      onClick={copyRoomId}
                      size="small"
                      className="ml-2 bg-gray-600 border-none"
                    >
                      Copy
                    </Button>
                  </Paragraph>
                )}
                {pendingCandidates.length > 0 && (
                  <Alert message={`Pending ICE Candidates: ${pendingCandidates.length}`} type="warning" showIcon />
                )}
                {peerConnection && (
                  <Paragraph><strong>Peer Connection:</strong> {peerConnection.connectionState}</Paragraph>
                )}
                {remoteStream && (
                  <Tag color="green">
                    Remote Stream Active (🎥 {remoteStream.getVideoTracks().length}, 🎤 {remoteStream.getAudioTracks().length})
                  </Tag>
                )}
              </Card>

              {!isConnected && (
                <Card className="mb-6 bg-gray-800 border-blue-500 shadow-lg">
                  <Title level={4} className="text-white">Join a Video Call Room</Title>
                  <div className="flex flex-wrap gap-4 items-center mb-2">
                    <Input
                      placeholder="Enter Room ID"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      className="w-64 bg-gray-700 text-white border-gray-600"
                    />
                    <Button type="primary" onClick={joinRoom} disabled={!roomId.trim()}>
                      Join Room
                    </Button>
                  </div>
                  <Text type="secondary" className="text-gray-400">
                    Tip: Both users must join the same room ID!
                  </Text>
                </Card>
              )}

              {isConnected && !isCallActive && !isIncomingCall && (
                connectedUsers.length > 0 ? (
                  <Card className="mb-6 bg-gray-800 border-green-500">
                    <Title level={4} className="text-white">Users in Room</Title>
                    {connectedUsers.map(user => (
                      <div key={user} className="flex justify-between items-center p-2 border-b border-gray-700">
                        <Text strong className="text-white">{user}</Text>
                        <Button type="primary" onClick={() => makeCall(user)}>📞 Call</Button>
                      </div>
                    ))}
                  </Card>
                ) : (
                  <Alert
                    message={`Waiting for other users to join room "${roomId}"...`}
                    description="Share this Room ID to start a video call."
                    type="info"
                    showIcon
                    className="mb-6 bg-gray-800 text-white border-gray-700"
                  />
                )
              )}

              {isIncomingCall && (
                <Card className="mb-6 bg-blue-900 border-blue-400 animate-pulse">
                  <Title level={4} className="text-white">📞 Incoming Call from {callerData?.name}</Title>
                  <div className="mt-2 flex gap-4">
                    <Button type="primary" onClick={answerCall}>✅ Answer</Button>
                    <Button danger onClick={rejectCall}>❌ Reject</Button>
                  </div>
                </Card>
              )}
            </div>
          )}

          {isCallActive && (
            <div className="relative min-h-screen flex flex-col bg-black">
              <div className="flex-grow flex items-center justify-center p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl w-full">
                  <div className="relative">
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-[calc(100vh-120px)] rounded-lg bg-black object-cover border-2 border-gray-700"
                      onLoadedMetadata={() => {
                        if (remoteVideoRef.current) {
                          remoteVideoRef.current.play().catch(e => {
                            console.log('Remote video play rejected:', e);
                            remoteVideoRef.current.muted = true;
                            remoteVideoRef.current.play();
                          });
                        }
                      }}
                    />
                    <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-70 px-3 py-1 rounded text-white text-sm">
                      {callerData?.name || 'Remote User'}
                      {remoteStream && remoteStream.getVideoTracks().length === 0 && ' (Video Off)'}
                    </div>
                    {remoteStream && remoteStream.getAudioTracks().length > 0 && (
                      <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-70 px-2 py-1 rounded">
                        {remoteStream.getAudioTracks()[0].enabled ? (
                          <AudioOutlined className="text-green-400" />
                        ) : (
                          <AudioMutedOutlined className="text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-[calc(100vh-120px)] rounded-lg bg-black object-cover border-2 border-gray-700"
                    />
                    <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-70 px-3 py-1 rounded text-white text-sm">
                      You {isVideoMuted && '(Video Off)'}
                    </div>
                    <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-70 px-2 py-1 rounded">
                      {isAudioMuted ? (
                        <AudioMutedOutlined className="text-red-400" />
                      ) : (
                        <AudioOutlined className="text-green-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="fixed bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 p-4 flex justify-center gap-6">
                <Button
                  icon={isAudioMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
                  onClick={toggleAudio}
                  className={`h-12 rounded-full flex items-center justify-center text-white ${isAudioMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                >
                  {isAudioMuted ? 'Unmute' : 'Mute'}
                </Button>
                <Button
                  icon={isVideoMuted ? <VideoCameraAddOutlined /> : <VideoCameraOutlined />}
                  onClick={toggleVideo}
                  className={`h-12 rounded-full flex items-center justify-center text-white ${isVideoMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                >
                  {isVideoMuted ? 'Start Video' : 'Stop Video'}
                </Button>
                <Button
                  icon={<PhoneOutlined />}
                  onClick={endCall}
                  className="h-12 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white"
                >
                  End Call
                </Button>
              </div>

              <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-70 px-3 py-1 rounded text-white text-sm">
                Room: {roomId} | Status: {callStatus}
              </div>
            </div>
          )}
        </div>
      );
    };

export default Call;