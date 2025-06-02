import React from 'react';

const DoctorDashboard = ({ isIncomingCall, callerData, onAcceptCall, onRejectCall, isConnected, roomId }) => {
  return (
    <div className="mb-5 p-4 border-2 border-blue-500 rounded">
      <h3 className="text-lg font-semibold mb-3">Doctor Dashboard</h3>
      {isIncomingCall && (
        <div className="p-4 bg-blue-50 rounded">
          <h4 className="text-lg font-semibold">📞 Incoming Call from {callerData?.name}</h4>
          <div className="mt-3">
            <button 
              onClick={onAcceptCall} 
              className="px-5 py-2 mr-3 bg-green-500 text-white rounded text-base"
            >
              ✅ Accept
            </button>
            <button 
              onClick={onRejectCall} 
              className="px-5 py-2 bg-red-500 text-white rounded text-base"
            >
              ❌ Reject
            </button>
          </div>
        </div>
      )}
      {isConnected && !isIncomingCall && (
        <p className="text-gray-600">Waiting for incoming calls in room "{roomId}"...</p>
      )}
      {!isConnected && (
        <p className="text-gray-600">Join a room to receive calls.</p>
      )}
    </div>
  );
};

export default DoctorDashboard;