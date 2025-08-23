import React from "react";
import { Phone, Users, RefreshCw, UserCheck } from "lucide-react";

interface User {
  id: string;
  name: string;
  email?: string;
  role: "doctor" | "employee";
  socketId?: string;
}

interface UserListProps {
  currentUser: User;
  onlineUsers: User[];
  onCallUser: (userId: string) => void;
  isCallActive: boolean;
  isConnected: boolean;
}

const UserList: React.FC<UserListProps> = ({
  currentUser,
  onlineUsers,
  onCallUser,
  isCallActive,
  isConnected,
}) => {
  const targetRole = currentUser.role === "doctor" ? "employee" : "doctor";
  const targetRoleDisplay = targetRole === "employee" ? "Employees" : "Doctors";

  return (
    <div className="p-4 bg-white/60 border rounded-lg shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-800">
              Online {targetRoleDisplay}
            </h3>
          </div>
          <span className="px-2 py-0.5 text-xs border rounded-md text-gray-600">
            {onlineUsers.length}
          </span>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="text-center py-4 space-y-2">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6 text-red-500 animate-spin" />
            </div>
            <p className="text-sm text-red-500">Connecting...</p>
          </div>
        )}

        {/* User List */}
        {isConnected && (
          <div className="space-y-3">
            {onlineUsers.length === 0 ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-800">
                    No {targetRoleDisplay} Online
                  </p>
                  <p className="text-xs text-gray-500">
                    Waiting for {targetRoleDisplay.toLowerCase()} to connect...
                  </p>
                </div>
              </div>
            ) : (
              onlineUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-100 hover:bg-gray-200 border transition"
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar fallback */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-medium">
                      {user.name
                        ? user.name.charAt(0).toUpperCase()
                        : user.role.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {user.name || `${user.role} ${user.id.slice(-4)}`}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-xs text-gray-500 capitalize">
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onCallUser(user.id)}
                    disabled={isCallActive || !isConnected}
                    className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Current User Info */}
        <div className="pt-4 border-t">
          <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
            {/* Avatar fallback */}
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
              {currentUser.name
                ? currentUser.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">You</p>
              <p className="text-xs text-gray-500 capitalize">
                {currentUser.role}
              </p>
            </div>
            <UserCheck className="w-4 h-4 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
