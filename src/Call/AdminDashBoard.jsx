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
    // Socket listeners for real-time updates
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
      fetchCallHistory(); // Refresh history when call ends
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

    // Initial data fetch
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
      // Fetch call history
      const callsResponse = await fetch('http://localhost:5000/api/calls', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (callsResponse.ok) {
        const calls = await callsResponse.json();
        setCallHistory(calls.slice(0, 20)); // Last 20 calls
        
        // Calculate today's calls
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
      const response = await fetch('http://localhost:5000/api/calls', {
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
      case 'initiated': return '#ffa500';
      case 'accepted': return '#4caf50';
      case 'rejected': return '#f44336';
      case 'ended': return '#9e9e9e';
      default: return '#2196f3';
    }
  };

  return (
    <div className="dashboard admin-dashboard">
      <div className="dashboard-content">
        <h2>Admin Dashboard</h2>
        <p>System overview and call monitoring for {user.username}</p>
        
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{onlineUsers.length}</h3>
            <p>Online Users</p>
            <div className="stat-breakdown">
              <small>
                Employees: {onlineUsers.filter(u => u.role === 'employee').length} | 
                Doctors: {onlineUsers.filter(u => u.role === 'doctor').length}
              </small>
            </div>
          </div>
          <div className="stat-card">
            <h3>{activeCalls.length}</h3>
            <p>Active Calls</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalCallsToday}</h3>
            <p>Today's Total Calls</p>
          </div>
          <div className="stat-card">
            <h3>{callHistory.length}</h3>
            <p>Total Call Records</p>
          </div>
        </div>

        {/* Active Calls Monitor */}
        <div className="active-calls-section">
          <h3>🟢 Live Call Monitor</h3>
          {activeCalls.length === 0 ? (
            <div className="no-active-calls">
              <p>No active calls at the moment</p>
            </div>
          ) : (
            <div className="active-calls-grid">
              {activeCalls.map((call) => (
                <div key={call.callId} className="active-call-card">
                  <div className="call-header">
                    <h4>📞 Live Call</h4>
                    <span 
                      className={`call-status ${call.status}`}
                      style={{ color: getStatusColor(call.status) }}
                    >
                      {call.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="call-participants">
                    <div className="participant">
                      <strong>Employee:</strong> {call.caller.name}
                    </div>
                    <div className="participant">
                      <strong>Doctor:</strong> {call.callee.name}
                    </div>
                  </div>
                  <div className="call-details">
                    <p><strong>Started:</strong> {formatTime(call.startTime)}</p>
                    <p><strong>Duration:</strong> {getCallDuration(call.startTime)}</p>
                    <p><strong>Call ID:</strong> {call.callId.substring(0, 8)}...</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Online Users */}
        <div className="online-users-section">
          <h3>👥 Online Users</h3>
          {onlineUsers.length === 0 ? (
            <p>No users currently online</p>
          ) : (
            <div className="users-grid">
              {onlineUsers.map((user) => (
                <div key={user.userId} className="user-card">
                  <div className="user-info">
                    <h4>{user.username}</h4>
                    <span className={`role-badge ${user.role}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                  <div className="online-indicator">
                    <span className="green-dot">●</span> Online
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call History */}
        <div className="call-history-section">
          <h3>📋 Recent Call History</h3>
          {callHistory.length === 0 ? (
            <p>No call history available</p>
          ) : (
            <div className="call-history-table">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Doctor</th>
                    <th>Start Time</th>
                    <th>Duration</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {callHistory.map((call) => (
                    <tr key={call._id}>
                      <td>{call.caller.username}</td>
                      <td>{call.callee.username}</td>
                      <td>{formatTime(call.startTime)}</td>
                      <td>{formatDuration(call.duration)}</td>
                      <td>
                        <span 
                          className={`status-badge ${call.status}`}
                          style={{ 
                            backgroundColor: getStatusColor(call.status),
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}
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
        </div>

        <div className="admin-actions">
          <button onClick={fetchCallHistory} className="refresh-btn">
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;