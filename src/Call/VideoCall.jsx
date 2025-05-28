import React, { useRef, useEffect, useState } from 'react';

const VideoCall = ({ socket, currentCall, user, onEndCall }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [callDuration, setCallDuration] = useState(0);
  const [remoteStreamReceived, setRemoteStreamReceived] = useState(false);

  useEffect(() => {
    initializeCall();
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleOffer = async (data) => {
      console.log('📞 Received offer from caller');
      await handleIncomingOffer(data);
    };

    const handleAnswer = async (data) => {
      console.log('✅ Received answer from callee');
      await handleIncomingAnswer(data);
    };

    const handleIceCandidate = async (data) => {
      console.log('🧊 Received ICE candidate');
      await handleIncomingIceCandidate(data);
    };

    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);

    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
    };
  }, [socket]);

  const initializeCall = async () => {
    try {
      console.log('🚀 Initializing video call...');
      
      // Get user media first
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      console.log('📹 Local stream obtained:', stream.getTracks().length, 'tracks');
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ],
        iceCandidatePoolSize: 10
      });

      peerConnectionRef.current = peerConnection;

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        console.log('➕ Adding local track:', track.kind);
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        console.log('📺 Remote track received:', event.track.kind);
        
        if (event.streams && event.streams[0]) {
          const remoteStream = event.streams[0];
          console.log('🎬 Setting remote stream with', remoteStream.getTracks().length, 'tracks');
          
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            setRemoteStreamReceived(true);
            setConnectionStatus('Connected');
          }
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('🧊 Sending ICE candidate');
          
          const targetSocketId = user.role === 'employee' 
            ? currentCall.calleeSocketId || currentCall.callee?.socketId
            : currentCall.callerSocketId || currentCall.caller?.socketId;
          
          if (targetSocketId) {
            socket.emit('ice-candidate', {
              candidate: event.candidate,
              target: targetSocketId,
              callId: currentCall.callId
            });
          }
        }
      };

      // Connection state monitoring
      peerConnection.onconnectionstatechange = () => {
        console.log('🔗 Connection state:', peerConnection.connectionState);
        setConnectionStatus(peerConnection.connectionState);
      };

      peerConnection.oniceconnectionstatechange = () => {
        console.log('🧊 ICE connection state:', peerConnection.iceConnectionState);
      };

      // If this is the caller (employee), create offer
      if (user.role === 'employee') {
        console.log('📞 Creating offer as caller...');
        await createAndSendOffer();
      } else {
        console.log('📱 Waiting for offer as callee...');
      }

    } catch (error) {
      console.error('❌ Error initializing call:', error);
      setConnectionStatus(`Error: ${error.message}`);
    }
  };

  const createAndSendOffer = async () => {
    try {
      const peerConnection = peerConnectionRef.current;
      if (!peerConnection) return;

      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await peerConnection.setLocalDescription(offer);
      console.log('📤 Offer created and set as local description');
      
      const targetSocketId = currentCall.calleeSocketId || currentCall.callee?.socketId;
      
      socket.emit('offer', {
        offer: offer,
        target: targetSocketId,
        callId: currentCall.callId,
        caller: socket.id
      });
      
      console.log('📨 Offer sent to:', targetSocketId);
    } catch (error) {
      console.error('❌ Error creating offer:', error);
    }
  };

  const handleIncomingOffer = async (data) => {
    try {
      const peerConnection = peerConnectionRef.current;
      if (!peerConnection) {
        console.error('❌ No peer connection when handling offer');
        return;
      }

      console.log('📥 Setting remote description from offer');
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

      // Make sure we have our local stream
      if (!localStreamRef.current) {
        console.log('📹 Getting local stream for answer...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true
          }
        });
        
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Add tracks to peer connection
        stream.getTracks().forEach(track => {
          console.log('➕ Adding local track for answer:', track.kind);
          peerConnection.addTrack(track, stream);
        });
      }
      
      // Create answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      console.log('📤 Answer created and set as local description');
      
      socket.emit('answer', {
        answer: answer,
        target: data.caller,
        callId: currentCall.callId
      });
      
      console.log('📨 Answer sent to caller');
      
    } catch (error) {
      console.error('❌ Error handling offer:', error);
    }
  };

  const handleIncomingAnswer = async (data) => {
    try {
      const peerConnection = peerConnectionRef.current;
      if (!peerConnection) return;
      
      console.log('📥 Setting remote description from answer');
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      console.log('✅ Answer processed successfully');
    } catch (error) {
      console.error('❌ Error handling answer:', error);
    }
  };

  const handleIncomingIceCandidate = async (data) => {
    try {
      const peerConnection = peerConnectionRef.current;
      if (!peerConnection) return;
      
      if (peerConnection.remoteDescription) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        console.log('✅ ICE candidate added');
      } else {
        console.log('⏳ Queuing ICE candidate - no remote description yet');
      }
    } catch (error) {
      console.error('❌ Error adding ICE candidate:', error);
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const cleanup = () => {
    console.log('🧹 Cleaning up video call');
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const handleEndCall = () => {
    cleanup();
    onEndCall();
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getParticipantName = () => {
    if (user.role === 'employee') {
      return currentCall.calleeName || currentCall.callee?.name || 'Doctor';
    } else {
      return currentCall.callerName || currentCall.caller?.name || 'Employee';
    }
  };

  const getUserInitial = () => {
    return (user.username || user.name || user.email || 'U')[0].toUpperCase();
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#1a1a1a',
      color: 'white'
    }}>
      {/* Call Header */}
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#2d2d2d', 
        borderBottom: '1px solid #444'
      }}>
        <h3 style={{ margin: 0 }}>Video Call with {getParticipantName()}</h3>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#ccc' }}>
          <span>Status: {connectionStatus}</span>
          <span>Duration: {formatDuration(callDuration)}</span>
          <span>Remote: {remoteStreamReceived ? '✅' : '❌'}</span>
        </div>
      </div>

      {/* Video Container */}
      <div style={{ 
        flex: 1, 
        position: 'relative', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Remote Video (Main) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            backgroundColor: '#000',
            display: remoteStreamReceived ? 'block' : 'none'
          }}
        />
        
        {/* Remote Video Placeholder */}
        {!remoteStreamReceived && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#333',
            width: '100%',
            height: '100%'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: '#555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              marginBottom: '1rem'
            }}>
              {getParticipantName().charAt(0).toUpperCase()}
            </div>
            <h3>{getParticipantName()}</h3>
            <p style={{ color: '#ccc' }}>{connectionStatus}</p>
          </div>
        )}

        {/* Local Video (Picture in Picture) */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '200px',
          height: '150px',
          border: '2px solid #fff',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#000'
        }}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: isVideoOff ? 'none' : 'block'
            }}
          />
          {isVideoOff && (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#333',
              fontSize: '24px'
            }}>
              {getUserInitial()}
            </div>
          )}
          <div style={{
            position: 'absolute',
            bottom: '5px',
            left: '5px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            You
          </div>
        </div>
      </div>

      {/* Call Controls */}
      <div style={{ 
        padding: '1rem', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem',
        backgroundColor: '#2d2d2d'
      }}>
        <button
          onClick={toggleAudio}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            backgroundColor: isAudioMuted ? '#dc3545' : '#28a745'
          }}
          title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isAudioMuted ? '🔇' : '🎤'}
        </button>

        <button
          onClick={toggleVideo}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            backgroundColor: isVideoOff ? '#dc3545' : '#28a745'
          }}
          title={isVideoOff ? 'Turn On Video' : 'Turn Off Video'}
        >
          {isVideoOff ? '📹' : '📷'}
        </button>

        <button
          onClick={handleEndCall}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            backgroundColor: '#dc3545'
          }}
          title="End Call"
        >
          📞
        </button>
      </div>
    </div>
  );
};

export default VideoCall;