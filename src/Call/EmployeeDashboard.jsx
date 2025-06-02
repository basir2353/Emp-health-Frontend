import React from 'react';

const EmployeeDashboard = ({ connectedUsers, onStartCall, isConnected, roomId }) => {
  const doctors = connectedUsers.map(user => ({ id: user, name: `Doctor ${user.split('_')[1]}` }));

  return (
    <div className="mb-5 p-4 border-2 border-green-500 rounded">
      <h3 className="text-lg font-semibold mb-3">Available Doctors</h3>
      {isConnected && doctors.length > 0 ? (
        doctors.map(doctor => (
          <div key={doctor.id} className="mb-3 p-3 bg-gray-50 rounded flex justify-between items-center">
            <span className="font-bold">{doctor.name}</span>
            <button 
              onClick={() => onStartCall(doctor.id)}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              📞 Call
            </button>
          </div>
        ))
      ) : isConnected ? (
        <p className="text-yellow-500">Waiting for doctors to join room "{roomId}"...</p>
      ) : (
        <p className="text-gray-600">Join a room to see available doctors.</p>
      )}
    </div>
  );
};

export default EmployeeDashboard;