import React, { useState, useEffect } from 'react';
import { 
  Phone, PhoneCall, PhoneOff, Video, Clock, Calendar, TrendingUp, User, 
  CheckCircle, XCircle, Activity, Bell, BarChart3, UserCheck 
} from 'lucide-react';

const DoctorDashboard = ({ socket, user }) => {
  const [incomingCalls, setIncomingCalls] = useState([
    // Mock initial incoming call for demo
    {
      callId: '1',
      callerName: 'John Smith',
      timestamp: new Date(),
      priority: 'urgent'
    }
  ]);

  const [callHistory, setCallHistory] = useState([
    // Mock initial call history for demo
    {
      _id: '1',
      caller: { username: 'Alice Johnson' },
      startTime: new Date(Date.now() - 3600000),
      duration: 450,
      status: 'completed'
    },
    {
      _id: '2',
      caller: { username: 'Bob Wilson' },
      startTime: new Date(Date.now() - 7200000),
      duration: 320,
      status: 'completed'
    },
    {
      _id: '3',
      caller: { username: 'Carol Davis' },
      startTime: new Date(Date.now() - 10800000),
      duration: 0,
      status: 'missed'
    }
  ]);

  const [stats, setStats] = useState({
    totalCalls: 47,
    todayCalls: 8,
    avgCallDuration: 385
  });

  const [cameraActive, setCameraActive] = useState(false);

  // Setup socket listeners
  useEffect(() => {
    if (!socket) return;

    const onIncomingCall = (data) => {
      setIncomingCalls(prev => [...prev, data]);
    };
    const onCallAccepted = (data) => {
      setIncomingCalls(prev => prev.filter(call => call.callId !== data.callId));
    };
    const onCallRejected = (data) => {
      setIncomingCalls(prev => prev.filter(call => call.callId !== data.callId));
    };

    socket.on('incoming-call', onIncomingCall);
    socket.on('call-accepted', onCallAccepted);
    socket.on('call-rejected', onCallRejected);

    return () => {
      socket.off('incoming-call', onIncomingCall);
      socket.off('call-accepted', onCallAccepted);
      socket.off('call-rejected', onCallRejected);
    };
  }, [socket]);

  // Start camera preview
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const videoElement = document.getElementById('doctor-camera-preview');
      if (videoElement) {
        videoElement.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  // Stop camera preview
  const stopCamera = () => {
    const videoElement = document.getElementById('doctor-camera-preview');
    if (videoElement && videoElement.srcObject) {
      videoElement.srcObject.getTracks().forEach(track => track.stop());
      videoElement.srcObject = null;
      setCameraActive(false);
    }
  };

  // Accept incoming call
  const acceptCall = (callId) => {
    if (socket) {
      socket.emit('accept-call', { callId });
    }
    setIncomingCalls(prev => prev.filter(call => call.callId !== callId));
    startCamera();
  };

  // Reject incoming call
  const rejectCall = (callId) => {
    if (socket) {
      socket.emit('reject-call', { callId });
    }
    setIncomingCalls(prev => prev.filter(call => call.callId !== callId));
  };

  // Format duration in seconds to "Xm Ys"
  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Format date string to locale string
  const formatTime = (date) => {
    return new Date(date).toLocaleString();
  };

  // Map call status to colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'missed': return 'text-red-600 bg-red-100';
      case 'ongoing': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Welcome, Dr. {user?.username || user?.name || 'Doctor'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Online</span>
              </div>
              {incomingCalls.length > 0 && (
                <div className="relative">
                  <Bell className="h-6 w-6 text-orange-500 animate-bounce" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {incomingCalls.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Calls</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCalls}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+12% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Calls</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.todayCalls}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Activity className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-600 font-medium">Active today</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatDuration(stats.avgCallDuration)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
              <span className="text-sm text-purple-600 font-medium">Improved by 5%</span>
            </div>
          </div>
        </div>

        {/* Incoming Calls */}
        {incomingCalls.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Incoming Calls</h2>
            <div className="space-y-4">
              {incomingCalls.map((call) => (
                <div
                  key={call.callId}
                  className={`flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow ${
                    call.priority === 'urgent' ? 'bg-red-50 border-red-400' : 'bg-white'
                  }`}
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{call.callerName}</p>
                    <p className="text-sm text-gray-600">{formatTime(call.timestamp)}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => acceptCall(call.callId)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-1"
                      title="Accept Call"
                    >
                      <PhoneCall className="h-5 w-5" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => rejectCall(call.callId)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center space-x-1"
                      title="Reject Call"
                    >
                      <PhoneOff className="h-5 w-5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Camera Preview */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Camera Preview</h2>
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <video
              id="doctor-camera-preview"
              className="w-full h-64 rounded-lg bg-black"
              autoPlay
              playsInline
              muted
            />
            <div className="mt-4 flex space-x-4">
              {!cameraActive ? (
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
                >
                  <Video className="h-5 w-5" />
                  <span>Start Camera</span>
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center space-x-2"
                >
                  <Video className="h-5 w-5" />
                  <span>Stop Camera</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Call History */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Call History</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Caller</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {callHistory.map((call) => (
                  <tr key={call._id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{call.caller.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatTime(call.startTime)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDuration(call.duration)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold rounded-full w-max ${getStatusColor(call.status)}`}>
                      {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                    </td>
                  </tr>
                ))}
                {callHistory.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">No call history available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;
