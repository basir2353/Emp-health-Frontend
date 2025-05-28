import React, { useState, useEffect,useRef } from 'react';
import io from 'socket.io-client';
import EmployeeDashboard from './EmployeeDashboard';
import DoctorDashboard from './DoctorDashboard';
import AdminDashboard from './AdminDashBoard';
import VideoCall from './VideoCall';

const socket = io('https://e-health-backend-production.up.railway.app/', {
  transports: ['websocket', 'polling'],
  withCredentials: true
});

function Call() {
  const [user, setUser] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);
const localVideoRef = useRef(null);
const remoteVideoRef = useRef(null);
const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      socket.emit('user-joined', parsedUser);
    }

    // Socket event listeners
    socket.on('incoming-call', (data) => {
      setCurrentCall({ ...data, type: 'incoming' });
      console.log('📲 Incoming call:', data);
    });

    socket.on('call-accepted', (data) => {
      setIsInCall(true);
      setCurrentCall((prev) => ({ ...prev, ...data, type: 'active' }));
    });

    socket.on('call-rejected', () => {
      setCurrentCall(null);
      alert('Call was rejected');
    });

    socket.on('call-ended', () => {
      setIsInCall(false);
      setCurrentCall(null);
    });

    socket.on('call-error', (data) => {
      alert(data.message);
      setCurrentCall(null);
    });

    return () => {
      socket.off('incoming-call');
      socket.off('call-accepted');
      socket.off('call-rejected');
      socket.off('call-ended');
      socket.off('call-error');
    };
  }, []); // <-- Only run once on mount

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    socket.emit('user-joined', userData);
  };

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
      callerName: user.username
    };
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = localStream;

  const pc = new RTCPeerConnection();
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    pc.ontrack = (event) => {
    remoteVideoRef.current.srcObject = event.streams[0];
  };
  setPeerConnection(pc);
    socket.emit('initiate-call', callData);
    setCurrentCall({ 
      type: 'outgoing', 
      calleeId: doctorId, 
      calleeName: doctorName 
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
    // If callId exists, notify backend; otherwise just clear UI
    if (currentCall?.callId) {
      endCall();
    } else {
      setCurrentCall(null);
    }
  };

  if (!user) {
    return <div>Loading user...</div>;
  }

  if (isInCall && currentCall?.type === 'active') {
    return (
      <VideoCall
        socket={socket}
        currentCall={currentCall}
        user={user}
        onEndCall={endCall}
      />
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Medical Video Call System</h1>
        <div className="user-info">
          <video ref={localVideoRef} autoPlay muted />
<video ref={remoteVideoRef} autoPlay />
          <span>Welcome, {user.name} ({user.role})</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Incoming Call Modal */}
      {currentCall?.type === 'incoming' && (
        <div className="call-modal">
          <div className="call-modal-content">
            <h3>Incoming Call</h3>
            <p>Call from: {currentCall.callerName}</p>
            <div className="call-actions">
              <button onClick={acceptCall} className="accept-btn">Accept</button>
              <button onClick={rejectCall} className="reject-btn">Reject</button>
            </div>
          </div>
        </div>
      )}

      {/* Outgoing Call Modal */}
      {currentCall?.type === 'outgoing' && (
        <div className="call-modal">
          <div className="call-modal-content">
            <h3>Calling...</h3>
            <p>Calling: {currentCall.calleeName}</p>
            <button onClick={cancelOutgoingCall} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Dashboard based on user role */}
      {user && (
        <>
          {user.role === 'employee' && (
            <EmployeeDashboard socket={socket} user={user} onStartCall={startCall} />
          )}
          {user.role === 'doctor' && (
            <DoctorDashboard socket={socket} user={user} />
          )}
          {user.role === 'admin' && (
            <AdminDashboard socket={socket} user={user} />
          )}
        </>
      )}
    </div>
  );
}

export default Call;