import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Layout, Button, Modal, Typography, Card } from 'antd';
import {
  LogoutOutlined,
  PhoneOutlined,
  PhoneFilled,
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
    });

    socket.on('call-error', (data) => {
      Modal.error({ title: 'Call Error', content: data.message });
      setCurrentCall(null);
    });

    return () => {
      socket.off('incoming-call');
      socket.off('call-accepted');
      socket.off('call-rejected');
      socket.off('call-ended');
      socket.off('call-error');
    };
  }, []);

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
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    setPeerConnection(pc);
    socket.emit('initiate-call', callData);

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
        {/* Incoming Call Modal */}
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

        {/* Outgoing Call Modal */}
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

        {/* Dashboard */}
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
