// Call.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Layout, Button, Modal, Typography } from 'antd';
import {
  LogoutOutlined,
  PhoneOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import EmployeeDashboard from './EmployeeDashboard';
import DoctorDashboard from './DoctorDashboard';
import AdminDashboard from './AdminDashBoard';
import VideoCall from './VideoCall';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const socket = io('https://e-health-backend-production.up.railway.app/', {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

function Call() {
  const [user, setUser] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      socket.emit('user-joined', parsedUser);
    }

    socket.on('incoming-call', (data) => {
      setCurrentCall({ ...data, type: 'incoming' });
    });

    socket.on('call-accepted', (data) => {
      setIsInCall(true);
      setCurrentCall((prev) => ({ ...prev, ...data, type: 'active' }));
    });

    socket.on('call-rejected', () => {
      setCurrentCall(null);
      Modal.warning({ title: 'Call Rejected', content: 'The call was rejected.' });
    });

    socket.on('call-ended', () => {
      setIsInCall(false);
      setCurrentCall(null);
      if (peerConnection) peerConnection.close();
    });

    socket.on('call-error', (data) => {
      Modal.error({ title: 'Call Error', content: data.message });
      setCurrentCall(null);
    });

    socket.on('offer', async (data) => {
      const pc = new RTCPeerConnection();
      setPeerConnection(pc);

      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = localStream;
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

      pc.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            candidate: event.candidate,
            to: data.from,
          });
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', {
        answer,
        to: data.from,
      });
    });

    socket.on('answer', async (data) => {
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    socket.on('ice-candidate', async (data) => {
      if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    return () => {
      socket.off('incoming-call');
      socket.off('call-accepted');
      socket.off('call-rejected');
      socket.off('call-ended');
      socket.off('call-error');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  }, [peerConnection]);

  const handleLogout = () => {
    setUser(null);
    setIsInCall(false);
    setCurrentCall(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    socket.disconnect();
    socket.connect();
  };

  const startCall = async (doctorId, doctorName) => {
    if (!user) return;

    const callData = {
      callerId: user.id,
      calleeId: doctorId,
      callerName: user.username,
    };

    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = localStream;

    const pc = new RTCPeerConnection();
    setPeerConnection(pc);

    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          to: doctorId,
        });
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit('initiate-call', {
      ...callData,
      offer,
    });

    setCurrentCall({
      type: 'outgoing',
      calleeId: doctorId,
      calleeName: doctorName,
    });
  };

  const acceptCall = () => {
    if (!currentCall?.callId) return;
    socket.emit('accept-call', { callId: currentCall.callId });
    setIsInCall(true);
    setCurrentCall((prev) => ({ ...prev, type: 'active' }));
  };

  const rejectCall = () => {
    if (!currentCall?.callId) return;
    socket.emit('reject-call', { callId: currentCall.callId });
    setCurrentCall(null);
  };

  const endCall = () => {
    if (currentCall?.callId) {
      socket.emit('end-call', { callId: currentCall.callId });
    }
    if (peerConnection) peerConnection.close();
    setIsInCall(false);
    setCurrentCall(null);
  };

  const cancelOutgoingCall = () => {
    if (currentCall?.callId) {
      endCall();
    } else {
      setCurrentCall(null);
    }
  };

  if (!user) return <div className="p-6 text-center text-lg">Loading user...</div>;

  if (isInCall && currentCall?.type === 'active') {
    return (
      <VideoCall socket={socket} currentCall={currentCall} user={user} onEndCall={endCall} />
    );
  }

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Header className="flex justify-between items-center bg-gray-600 px-6">
        <Title level={3} className="!text-white mb-0">Medical Video Call System</Title>
        <div className="flex items-center space-x-4">
          <video ref={localVideoRef} autoPlay muted className="w-16 h-12 rounded shadow" />
          <video ref={remoteVideoRef} autoPlay className="w-16 h-12 rounded shadow" />
          <Text className="text-white">{user.name} ({user.role})</Text>
          <Button icon={<LogoutOutlined />} onClick={handleLogout} danger>
            Logout
          </Button>
        </div>
      </Header>

      <Content className="p-4">
        <Modal
          open={currentCall?.type === 'incoming'}
          title="Incoming Call"
          onCancel={rejectCall}
          footer={[
            <Button key="reject" onClick={rejectCall} icon={<CloseCircleOutlined />} danger>
              Reject
            </Button>,
            <Button key="accept" type="default" className='text-white' onClick={acceptCall} icon={<PhoneOutlined />}>
              Accept
            </Button>,
          ]}
        >
          <p>Call from: {currentCall?.callerName}</p>
        </Modal>

        <Modal
          open={currentCall?.type === 'outgoing'}
          title="Calling..."
          onCancel={cancelOutgoingCall}
          footer={[
            <Button onClick={cancelOutgoingCall} icon={<CloseCircleOutlined />} danger>
              Cancel
            </Button>,
          ]}
        >
          <p>Calling: {currentCall?.calleeName}</p>
        </Modal>

        <div className="mt-6">
          {user.role === 'employee' && (
            <EmployeeDashboard socket={socket} user={user} onStartCall={startCall} />
          )}
          {user.role === 'doctor' && (
            <DoctorDashboard socket={socket} user={user} />
          )}
          {user.role === 'admin' && (
            <AdminDashboard socket={socket} user={user} />
          )}
        </div>
      </Content>
    </Layout>
  );
}

export default Call;