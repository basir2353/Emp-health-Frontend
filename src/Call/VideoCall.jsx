import React, { useRef, useEffect, useState } from 'react';
import { Button, Typography } from 'antd';
import {
  AudioMutedOutlined,
  AudioOutlined,
  VideoCameraAddOutlined,
  VideoCameraOutlined,
  PhoneOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

function VideoCall({ socket, currentCall, user, onEndCall }) {
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
    let callTimer;

    const initCall = async () => {
      try {
        // 1. Get user media
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = localStream;
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

        // 2. Create RTCPeerConnection
      const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },  // STUN
    {
      urls: 'relay1.expressturn.com:3480', // Free TURN example
      username: '000000002071258649',
      credential: 'y3B2VaE1XPQUgUATPuIxeHuDHqU='
    }
  ],
});

        peerConnectionRef.current = peerConnection;

        // Add local tracks to peer connection
        localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

peerConnection.ontrack = (event) => {
  if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
    remoteVideoRef.current.srcObject = event.streams[0];
    remoteVideoRef.current.play().catch(err => console.warn("Play error:", err));
  }
  setRemoteStreamReceived(true);
  setConnectionStatus('Connected');
};


if (remoteVideoRef.current) {
  remoteVideoRef.current.play().catch(err => {
    console.warn("Play interrupted:", err);
  });
}

        // Listen for ICE candidates and send to remote peer via socket
    // Listen for ICE candidates and send to remote peer via socket
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    console.log("🔍 New ICE candidate:", event.candidate);

    // Check candidate type (host, srflx, relay)
    const candidateType = event.candidate.type || event.candidate.candidate.split(" ")[7];
    if (candidateType === "host") {
      console.log("✅ Using HOST candidate (same network / LAN)");
    } else if (candidateType === "srflx") {
      console.log("🌍 Using STUN candidate (public IP direct connection)");
    } else if (candidateType === "relay") {
      console.log("🚀 Using TURN RELAY candidate (media going via relay server)");
    }

    socket.emit("ice-candidate", {
      candidate: event.candidate,
      callId: currentCall.callId,
      target:
        user.role === "employee"
          ? currentCall.calleeSocketId || currentCall.callee?.socketId
          : currentCall.callerSocketId || currentCall.caller?.socketId,
    });
  }
};


        // Connection state changes
        peerConnection.onconnectionstatechange = () => {
          const state = peerConnection.connectionState;
          setConnectionStatus(state.charAt(0).toUpperCase() + state.slice(1));
          if (state === 'disconnected' || state === 'failed' || state === 'closed') {
            // End call if connection lost
            onEndCall();
          }
        };

        // 3. Signaling logic: Offer/Answer depending on role

        if (user.role === 'employee') {
          // Employee starts the call by creating offer
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          socket.emit('offer', {
            callId: currentCall.callId,
            offer,
            target: currentCall.calleeSocketId || currentCall.callee?.socketId,
          });
        }

        // 4. Start call timer on connection
        callTimer = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
      } catch (err) {
        setConnectionStatus(Error: ${err.message});
      }
    };

    initCall();

    // Socket listeners for signaling:

    // When receiving offer (doctor side)
    socket.on('offer', async ({ offer, callId, caller }) => {
      if (callId !== currentCall.callId) return;

      if (user.role === 'doctor') {
        const pc = peerConnectionRef.current;
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        // Create answer
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit('answer', {
          callId,
          answer,
          target: caller,
        });
      }
    });

    // When receiving answer (employee side)
    socket.on('answer', async ({ answer, callId }) => {
      if (callId !== currentCall.callId) return;

      if (user.role === 'employee') {
        const pc = peerConnectionRef.current;
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    // When receiving ICE candidate from remote
    socket.on('ice-candidate', async ({ candidate, callId }) => {
      if (callId !== currentCall.callId) return;

      try {
        const pc = peerConnectionRef.current;
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error('Error adding received ICE candidate', err);
      }
    });

    return () => {
      clearInterval(callTimer);
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');

      // Cleanup peer connection and media
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      peerConnectionRef.current?.close();
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      setConnectionStatus('Disconnected');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle mic
  const toggleAudio = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioMuted(!audioTrack.enabled);
    }
  };

  // Toggle camera
  const toggleVideo = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  // End call handler
  const handleEndCall = () => {
    onEndCall();
  };

  // Format timer (mm:ss)
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')};
  };

  // Get other participant's name for display
  const getParticipantName = () => {
    return user.role === 'employee'
      ? currentCall.calleeName || currentCall.callee?.name || 'Doctor'
      : currentCall.callerName || currentCall.caller?.name || 'Employee';
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col text-white">
      <div className="p-4 border-b border-gray-800 bg-[#141414] flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <Title level={4} className="!text-white m-0">
          Video Call with {getParticipantName()}
        </Title>
        <div className="flex gap-4 text-sm text-white mt-2 sm:mt-0">
          <Text>Status: {connectionStatus}</Text>
          <Text>Duration: {formatDuration(callDuration)}</Text>
        </div>
      </div>

      <div className="flex-1 relative bg-black flex flex-col sm:flex-row gap-4 p-4">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="flex-grow rounded-lg border border-white object-cover min-h-[300px]"
          style={{ display: remoteStreamReceived ? 'block' : 'none' }}
        />
        {!remoteStreamReceived && (
          <div className="flex-grow flex flex-col items-center justify-center bg-gray-900 rounded-lg p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-4xl font-bold uppercase">
              {getParticipantName().charAt(0)}
            </div>
            <Title level={4} className="text-white mt-4">
              {getParticipantName()}
            </Title>
            <Text className="text-white">{connectionStatus}</Text>
          </div>
        )}

        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-8 right-8 w-48 h-36 rounded-lg border border-white object-cover sm:static sm:w-48 sm:h-36"
        />
      </div>

      <div className="p-4 border-t border-gray-800 bg-[#141414] flex justify-center gap-6">
        <Button
          shape="circle"
          onClick={toggleAudio}
          aria-label="Toggle Audio"
          className="bg-white"
        >
          {isAudioMuted ? (
            <AudioMutedOutlined style={{ color: '#141414', fontSize: 20 }} />
          ) : (
            <AudioOutlined style={{ color: '#141414', fontSize: 20 }} />
          )}
        </Button>

        <Button
          shape="circle"
          onClick={toggleVideo}
          aria-label="Toggle Video"
          className="bg-white"
        >
          {isVideoOff ? (
            <VideoCameraAddOutlined style={{ color: '#141414', fontSize: 20 }} />
          ) : (
            <VideoCameraOutlined style={{ color: '#141414', fontSize: 20 }} />
          )}
        </Button>

        <Button
          shape="circle"
          danger
          onClick={handleEndCall}
          aria-label="End Call"
          className="bg-white"
        >
          <PhoneOutlined style={{ color: '#141414', fontSize: 20 }} />
        </Button>
      </div>
    </div>
  );
}

export default VideoCall;