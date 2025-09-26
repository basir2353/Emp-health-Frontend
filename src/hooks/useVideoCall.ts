import { useState, useEffect, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { message } from 'antd';

interface User {
  id: string;
  name: string;
  email?: string;
  role: 'doctor' | 'employee';
  socketId?: string;
}

interface IncomingCallData {
  callerId: string;
  callerName: string;
  callerSocketId: string;
  callId: string;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

// ✅ Helper for showing messages
const showMessage = (text: string) => {
  const lower = text.toLowerCase();
  if (
    lower.includes("fail") ||
    lower.includes("error") ||
    lower.includes("disconnect") ||
    lower.includes("reject")
  ) {
    message.error(text);
  } else {
    message.success(text);
  }
};

export const useVideoCall = (currentUser: User) => {
  // Connection state
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  // Media streams
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // Call state
  const [isCallActive, setIsCallActive] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [incomingCallData, setIncomingCallData] = useState<IncomingCallData | null>(null);

  // Media controls
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // Users
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [isUserOnline, setIsUserOnline] = useState(false);

  // WebRTC
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidate[]>([]);
  const remoteDescriptionSetRef = useRef(false);

  // Initialize WebRTC peer connection
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          target: incomingCallData?.callerSocketId
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      setConnectionStatus(`WebRTC: ${pc.iceConnectionState}`);
      if (pc.iceConnectionState === 'connected') {
        setIsCallActive(true);
        showMessage("Call Connected");
      } else if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
        endCall();
        showMessage("Call Disconnected");
      }
    };

    return pc;
  }, [socket, incomingCallData]);

  // Initialize connection
  const initializeConnection = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: true }
      });

      setLocalStream(stream);
      setConnectionStatus('Media acquired');

      const newSocket = io('http://localhost:5000/', {
        transports: ['websocket', 'polling'],
        withCredentials: true,
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        setIsConnected(true);
        setConnectionStatus('Connected');
        setIsUserOnline(true);

        newSocket.emit('user-joined', {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          socketId: newSocket.id
        });

        showMessage("Connected to video call service");
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        setConnectionStatus('Disconnected');
        setIsUserOnline(false);
      });

      newSocket.on('available-users', (users: User[]) => {
        setOnlineUsers(users);
      });

      newSocket.on('incoming-call', (data: IncomingCallData) => {
        setIsIncomingCall(true);
        setIncomingCallData(data);
        setConnectionStatus('Incoming call...');
        showMessage(`${data.callerName} is calling you`);
      });

      newSocket.on('call-accepted', () => {
        setIsCallActive(true);
        setConnectionStatus('Call accepted');
      });

      newSocket.on('call-rejected', () => {
        endCall();
        showMessage("Call Rejected");
      });

      newSocket.on('call-ended', () => {
        endCall();
        showMessage("Call Ended");
      });

      newSocket.on('offer', async ({ offer, from }) => {
        const pc = createPeerConnection();
        peerConnectionRef.current = pc;

        if (stream) {
          stream.getTracks().forEach(track => {
            pc.addTrack(track, stream);
          });
        }

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        remoteDescriptionSetRef.current = true;

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        newSocket.emit('answer', { answer, target: from });

        pendingCandidatesRef.current.forEach(candidate => {
          pc.addIceCandidate(candidate);
        });
        pendingCandidatesRef.current = [];
      });

      newSocket.on('answer', async ({ answer }) => {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
          remoteDescriptionSetRef.current = true;

          pendingCandidatesRef.current.forEach(candidate => {
            peerConnectionRef.current?.addIceCandidate(candidate);
          });
          pendingCandidatesRef.current = [];
        }
      });

      newSocket.on('ice-candidate', ({ candidate }) => {
        if (peerConnectionRef.current && remoteDescriptionSetRef.current) {
          peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          pendingCandidatesRef.current.push(new RTCIceCandidate(candidate));
        }
      });

    } catch (error) {
      setConnectionStatus('Failed to connect');
      showMessage("Connection Failed");
    }
  }, [currentUser, createPeerConnection]);

  // Make a call
  const makeCall = useCallback(async (targetUserId: string) => {
    if (!socket || !localStream) {
      showMessage("Cannot Make Call");
      return;
    }

    const targetUser = onlineUsers.find(u => u.id === targetUserId);
    if (!targetUser) {
      showMessage("User Not Found");
      return;
    }

    try {
      setConnectionStatus('Initiating call...');
      const pc = createPeerConnection();
      peerConnectionRef.current = pc;

      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit('initiate-call', {
        callerId: currentUser.id,
        calleeId: targetUserId,
        callerName: currentUser.name
      });

      socket.emit('offer', {
        offer,
        target: targetUser.socketId
      });

      showMessage(`Calling ${targetUser.name}`);
    } catch (error) {
      showMessage("Call Failed");
    }
  }, [socket, localStream, onlineUsers, currentUser, createPeerConnection]);

  // Answer call
  const answerCall = useCallback(() => {
    if (!socket || !incomingCallData) return;
    socket.emit('accept-call', { callId: incomingCallData.callId });
    setIsIncomingCall(false);
    setIncomingCallData(null);
    setConnectionStatus('Call accepted');
    showMessage("Call Accepted");
  }, [socket, incomingCallData]);

  // Reject call
  const rejectCall = useCallback(() => {
    if (!socket || !incomingCallData) return;
    socket.emit('reject-call', { callId: incomingCallData.callId });
    setIsIncomingCall(false);
    setIncomingCallData(null);
    setConnectionStatus('Call rejected');
    showMessage("Call Rejected");
  }, [socket, incomingCallData]);

  // End call
  const endCall = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (socket && incomingCallData) {
      socket.emit('end-call', { callId: incomingCallData.callId });
    }

    setIsCallActive(false);
    setIsIncomingCall(false);
    setIncomingCallData(null);
    setRemoteStream(null);
    setConnectionStatus('Call ended');
    remoteDescriptionSetRef.current = false;
    pendingCandidatesRef.current = [];

    showMessage("Call Ended");
  }, [socket, incomingCallData]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
        showMessage(audioTrack.enabled ? "Microphone On" : "Microphone Off");
      }
    }
  }, [localStream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
        showMessage(videoTrack.enabled ? "Camera On" : "Camera Off");
      }
    }
  }, [localStream]);

  // Refresh users
  const refreshUsers = useCallback(() => {
    if (socket) {
      socket.emit('get-available-users');
    }
  }, [socket]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (socket) {
        socket.disconnect();
      }
    };
  }, [localStream, socket]);

  return {
    socket,
    isConnected,
    connectionStatus,
    localStream,
    remoteStream,
    isCallActive,
    isIncomingCall,
    incomingCallData,
    isAudioOn,
    isVideoOn,
    onlineUsers,
    isUserOnline,
    initializeConnection,
    makeCall,
    answerCall,
    rejectCall,
    endCall,
    toggleAudio,
    toggleVideo,
    refreshUsers
  };
};
