import React, { useRef, useEffect, useState } from 'react';
import { Button, Avatar, Typography } from 'antd';
import {
  AudioMutedOutlined,
  AudioOutlined,
  VideoCameraAddOutlined,
  VideoCameraOutlined,
  PhoneOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

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
    const timer = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    return () => {
      clearInterval(timer);
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('offer', handleIncomingOffer);
    socket.on('answer', handleIncomingAnswer);
    socket.on('ice-candidate', handleIncomingIceCandidate);
    return () => {
      socket.off('offer', handleIncomingOffer);
      socket.off('answer', handleIncomingAnswer);
      socket.off('ice-candidate', handleIncomingIceCandidate);
    };
  }, [socket]);

  const initializeCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      peerConnectionRef.current = peerConnection;

      stream.getTracks().forEach((track) =>
        peerConnection.addTrack(track, stream)
      );

      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setRemoteStreamReceived(true);
          setConnectionStatus('Connected');
        }
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          const targetSocketId =
            user.role === 'employee'
              ? currentCall.calleeSocketId || currentCall.callee?.socketId
              : currentCall.callerSocketId || currentCall.caller?.socketId;

          socket.emit('ice-candidate', {
            candidate: event.candidate,
            target: targetSocketId,
            callId: currentCall.callId,
          });
        }
      };

      if (user.role === 'employee') await createAndSendOffer();
    } catch (error) {
      setConnectionStatus(`Error: ${error.message}`);
    }
  };

  const createAndSendOffer = async () => {
    const pc = peerConnectionRef.current;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('offer', {
      offer,
      target: currentCall.calleeSocketId || currentCall.callee?.socketId,
      callId: currentCall.callId,
      caller: socket.id,
    });
  };

  const handleIncomingOffer = async ({ offer, caller }) => {
    const pc = peerConnectionRef.current;
    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    if (!localStreamRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    }

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('answer', {
      answer,
      target: caller,
      callId: currentCall.callId,
    });
  };

  const handleIncomingAnswer = async ({ answer }) => {
    const pc = peerConnectionRef.current;
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleIncomingIceCandidate = async ({ candidate }) => {
    const pc = peerConnectionRef.current;
    if (pc.remoteDescription) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const toggleAudio = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  const cleanup = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    peerConnectionRef.current?.close();
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  const handleEndCall = () => {
    cleanup();
    onEndCall();
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const getParticipantName = () => {
    return user.role === 'employee'
      ? currentCall.calleeName || currentCall.callee?.name || 'Doctor'
      : currentCall.callerName || currentCall.caller?.name || 'Employee';
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col text-white">
      <div className="p-4 border-b border-gray-800 bg-[#141414]">
        <Title level={4} className="!text-white m-0">
          Video Call with {getParticipantName()}
        </Title>
        <div className="text-sm text-white flex gap-4 mt-1">
          <Text className="text-white">Status: {connectionStatus}</Text>
          <Text className="text-white">Duration: {formatDuration(callDuration)}</Text>
        </div>
      </div>

      <div className="flex-1 relative bg-black">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          style={{ display: remoteStreamReceived ? 'block' : 'none' }}
        />
        {!remoteStreamReceived && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
            <Avatar size={96} style={{ backgroundColor: '#666' }}>
              {getParticipantName().charAt(0).toUpperCase()}
            </Avatar>
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
          className="absolute bottom-5 right-5 w-48 h-36 rounded-lg border border-white object-cover"
        />
      </div>

      <div className="p-4 border-t border-gray-800 bg-[#141414] flex justify-center gap-4">
        <Button
          shape="circle"
          className="bg-[#141414]"
          onClick={toggleAudio}
          aria-label="Toggle Audio"
        >
          <div className="rounded-full bg-white p-1 flex items-center justify-center">
            {isAudioMuted ? (
              <AudioMutedOutlined style={{ color: '#141414', fontSize: '18px' }} />
            ) : (
              <AudioOutlined style={{ color: '#141414', fontSize: '18px' }} />
            )}
          </div>
        </Button>

        <Button
          shape="circle"
          className="bg-[#141414]"
          onClick={toggleVideo}
          aria-label="Toggle Video"
        >
          <div className="rounded-full bg-white p-1 flex items-center justify-center">
            {isVideoOff ? (
              <VideoCameraAddOutlined style={{ color: '#141414', fontSize: '18px' }} />
            ) : (
              <VideoCameraOutlined style={{ color: '#141414', fontSize: '18px' }} />
            )}
          </div>
        </Button>

        <Button
          shape="circle"
          danger
          className="bg-[#141414]"
          onClick={handleEndCall}
          aria-label="End Call"
        >
          <div className="rounded-full bg-white p-1 flex items-center justify-center">
            <PhoneOutlined style={{ color: '#141414', fontSize: '18px' }} />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default VideoCall;
