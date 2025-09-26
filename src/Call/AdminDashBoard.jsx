import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ socket, user }) => {
  const [activeCalls, setActiveCalls] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    onlineUsers: 0,
    activeCalls: 0,
    totalCallsToday: 0
  });

  useEffect(() => {
    socket.on('active-calls', (calls) => {
      setActiveCalls(calls);
    });

    socket.on('new-call', (callData) => {
      setActiveCalls(prev => [...prev, callData]);
    });

    socket.on('call-status-update', (callData) => {
      setActiveCalls(prev =>
        prev.map(call =>
          call.callId === callData.callId ? callData : call
        )
      );
    });

    socket.on('call-ended', (data) => {
      setActiveCalls(prev =>
        prev.filter(call => call.callId !== data.callId)
      );
      fetchCallHistory();
    });

    socket.on('user-status-update', (userData) => {
      setOnlineUsers(prev => {
        const filtered = prev.filter(u => u.userId !== userData.userId);
        if (userData.isOnline) {
          return [...filtered, userData];
        }
        return filtered;
      });
    });

    fetchInitialData();
    socket.emit('get-active-calls');

    return () => {
      socket.off('active-calls');
      socket.off('new-call');
      socket.off('call-status-update');
      socket.off('call-ended');
      socket.off('user-status-update');
    };
  }, [socket]);

  const fetchInitialData = async () => {
    try {
      const callsResponse = await fetch('http://empolyee-backedn.onrender.com/api/calls', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (callsResponse.ok) {
        const calls = await callsResponse.json();
        setCallHistory(calls.slice(0, 20));
        const today = new Date().toDateString();
        const todayCalls = calls.filter(call =>
          new Date(call.startTime).toDateString() === today
        ).length;

        setStats(prev => ({
          ...prev,
          totalCallsToday: todayCalls
        }));
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchCallHistory = async () => {
    try {
      const response = await fetch('http://empolyee-backedn.onrender.com/api/calls', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const calls = await response.json();
        setCallHistory(calls.slice(0, 20));
      }
    } catch (error) {
      console.error('Error fetching call history:', error);
    }
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

  const getCallDuration = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const duration = Math.floor((now - start) / 1000);
    return formatDuration(duration);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'initiated': return 'text-yellow-500';
      case 'accepted': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      case 'ended': return 'text-gray-500';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
          <p className="text-gray-600">System overview and call monitoring for <span className="font-semibold">{user.username}</span></p>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <h3 className="text-4xl font-extrabold text-indigo-600">{onlineUsers.length}</h3>
            <p className="text-gray-700 mt-1">Online Users</p>
            <small className="mt-2 text-gray-500">
              Employees: <span className="font-medium">{onlineUsers.filter(u => u.role === 'employee').length}</span> | Doctors: <span className="font-medium">{onlineUsers.filter(u => u.role === 'doctor').length}</span>
            </small>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <h3 className="text-4xl font-extrabold text-green-600">{activeCalls.length}</h3>
            <p className="text-gray-700 mt-1">Active Calls</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <h3 className="text-4xl font-extrabold text-purple-600">{stats.totalCallsToday}</h3>
            <p className="text-gray-700 mt-1">Today's Total Calls</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <h3 className="text-4xl font-extrabold text-pink-600">{callHistory.length}</h3>
            <p className="text-gray-700 mt-1">Total Call Records</p>
          </div>
        </section>

        {/* Active Calls Monitor */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">🟢 Live Call Monitor</h2>
          {activeCalls.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No active calls at the moment
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCalls.map((call) => (
                <div key={call.callId} className="bg-white rounded-lg shadow p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-lg">📞 Live Call</h3>
                    <span className={`${getStatusColor(call.status)} font-semibold uppercase text-sm`}>
                      {call.status}
                    </span>
                  </div>
                  <div className="mb-3 space-y-1">
                    <p><strong>Employee:</strong> {call.caller.name}</p>
                    <p><strong>Doctor:</strong> {call.callee.name}</p>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Started:</strong> {formatTime(call.startTime)}</p>
                    <p><strong>Duration:</strong> {getCallDuration(call.startTime)}</p>
                    <p><strong>Call ID:</strong> {call.callId.substring(0, 8)}...</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Online Users */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">👥 Online Users</h2>
          {onlineUsers.length === 0 ? (
            <p className="text-gray-500">No users currently online</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {onlineUsers.map((user) => (
                <div key={user.userId} className="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center">
                  <h4 className="font-semibold text-lg">{user.username}</h4>
                  <span className={`mt-1 px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    user.role === 'employee' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'doctor' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                  <div className="mt-2 flex items-center gap-1 text-green-600 font-semibold">
                    <span className="text-lg">●</span> Online
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Call History */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">📋 Recent Call History</h2>
          {callHistory.length === 0 ? (
            <p className="text-gray-500">No call history available</p>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Employee</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Doctor</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Start Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Duration</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {callHistory.map((call) => (
                    <tr key={call._id} className="hover:bg-indigo-50 transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap">{call.caller.username}</td>
                      <td className="px-6 py-3 whitespace-nowrap">{call.callee.username}</td>
                      <td className="px-6 py-3 whitespace-nowrap">{formatTime(call.startTime)}</td>
                      <td className="px-6 py-3 whitespace-nowrap">{formatDuration(call.duration)}</td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                            call.status === 'initiated' ? 'bg-yellow-200 text-yellow-800' :
                            call.status === 'accepted' ? 'bg-green-200 text-green-800' :
                            call.status === 'rejected' ? 'bg-red-200 text-red-800' :
                            call.status === 'ended' ? 'bg-gray-300 text-gray-700' : 'bg-blue-200 text-blue-800'
                          }`}
                        >
                          {call.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="text-center">
          <button
            onClick={fetchCallHistory}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-md transition"
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
