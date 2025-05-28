import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Video, 
  Clock, 
  Calendar, 
  TrendingUp, 
  User, 
  CheckCircle, 
  XCircle, 
  Activity,
  Bell,
  BarChart3,
  UserCheck
} from 'lucide-react';

const DoctorDashboard = ({ socket, user }) => {
  const [incomingCalls, setIncomingCalls] = useState([
    // Mock data for demonstration
    {
      callId: '1',
      callerName: 'John Smith',
      timestamp: new Date(),
      priority: 'urgent'
    }
  ]);
  
  const [callHistory, setCallHistory] = useState([
    // Mock data for demonstration
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

  useEffect(() => {
    if (socket) {
      socket.on('incoming-call', (data) => {
        setIncomingCalls(prev => [...prev, data]);
      });

      socket.on('call-accepted', (data) => {
        setIncomingCalls(prev => prev.filter(call => call.callId !== data.callId));
      });

      socket.on('call-rejected', (data) => {
        setIncomingCalls(prev => prev.filter(call => call.callId !== data.callId));
      });

      return () => {
        socket.off('incoming-call');
        socket.off('call-accepted');
        socket.off('call-rejected');
      };
    }
  }, [socket]);

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

  const stopCamera = () => {
    const videoElement = document.getElementById('doctor-camera-preview');
    if (videoElement && videoElement.srcObject) {
      const tracks = videoElement.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoElement.srcObject = null;
      setCameraActive(false);
    }
  };

  const acceptCall = (callId) => {
    if (socket) {
      socket.emit('accept-call', { callId });
    }
    setIncomingCalls(prev => prev.filter(call => call.callId !== callId));
    startCamera();
  };

  const rejectCall = (callId) => {
    if (socket) {
      socket.emit('reject-call', { callId });
    }
    setIncomingCalls(prev => prev.filter(call => call.callId !== callId));
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

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
              <BarChart3 className="h-4 w-4 text-purple-500 mr-1" />
              <span className="text-sm text-purple-600 font-medium">Optimal range</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Video className="h-5 w-5 mr-2 text-blue-600" />
                  Camera Preview
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={startCamera}
                    disabled={cameraActive}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Start
                  </button>
                  <button
                    onClick={stopCamera}
                    disabled={!cameraActive}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Stop
                  </button>
                </div>
              </div>
              <div className="relative">
                <video
                  id="doctor-camera-preview"
                  autoPlay
                  muted
                  className="w-full h-48 bg-gray-900 rounded-xl object-cover"
                />
                {!cameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-xl">
                    <div className="text-center">
                      <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Camera not active</p>
                    </div>
                  </div>
                )}
                {cameraActive && (
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>LIVE</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Incoming Calls */}
            {incomingCalls.length > 0 && (
              <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <PhoneCall className="h-5 w-5 mr-2 text-orange-600" />
                  Incoming Calls
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {incomingCalls.length}
                  </span>
                </h3>
                <div className="space-y-4">
                  {incomingCalls.map((call) => (
                    <div key={call.callId} className="border border-orange-200 rounded-xl p-4 bg-orange-50 animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-100 rounded-full">
                            <User className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{call.callerName}</h4>
                            <p className="text-sm text-gray-600">Employee consultation request</p>
                            {call.priority === 'urgent' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                                Urgent
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={() => acceptCall(call.callId)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => rejectCall(call.callId)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Call History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gray-600" />
                Recent Call History
              </h3>
              
              {callHistory.length === 0 ? (
                <div className="text-center py-12">
                  <PhoneOff className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No call history available</p>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {callHistory.map((call, index) => (
                        <tr key={call._id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 rounded-full">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-900">
                                {call.caller?.username || call.caller?.name || call.caller?.email}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {formatTime(call.startTime)}
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {formatDuration(call.duration)}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                              {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Instructions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-100 rounded-full mt-1">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Stay Online</p>
                    <p className="text-sm text-gray-600">Remain available to receive employee consultation requests</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-green-100 rounded-full mt-1">
                    <Video className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Video Calls</p>
                    <p className="text-sm text-gray-600">Provide medical consultation through video calls</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-purple-100 rounded-full mt-1">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Track Progress</p>
                    <p className="text-sm text-gray-600">Monitor your call statistics and history automatically</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-orange-100 rounded-full mt-1">
                    <Bell className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Notifications</p>
                    <p className="text-sm text-gray-600">Receive instant alerts for incoming calls</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;