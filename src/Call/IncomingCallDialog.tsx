import React from "react";
import { Phone, PhoneOff, User } from "lucide-react";

interface IncomingCallData {
  callerId: string;
  callerName: string;
  callerSocketId: string;
}

interface IncomingCallDialogProps {
  isOpen: boolean;
  callerData: IncomingCallData | null;
  onAccept: () => void;
  onReject: () => void;
}

const IncomingCallDialog: React.FC<IncomingCallDialogProps> = ({
  isOpen,
  callerData,
  onAccept,
  onReject,
}) => {
  if (!isOpen || !callerData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Modal container */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 animate-fade-in">
        {/* Title */}
        <h2 className="text-center text-xl font-semibold text-gray-800">
          Incoming Call
        </h2>

        {/* Caller Avatar */}
        <div className="flex flex-col items-center space-y-6 py-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-blue-200 animate-pulse">
              {callerData.callerName?.charAt(0).toUpperCase() || (
                <User className="w-12 h-12" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
              <Phone className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Caller Info */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {callerData.callerName || "Unknown Caller"}
            </h3>
            <p className="text-sm text-gray-500">Incoming video call...</p>
          </div>

          {/* Call Animation */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-10 pt-4">
            {/* Reject */}
            <button
              onClick={onReject}
              className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition transform hover:scale-110 active:scale-95"
            >
              <PhoneOff className="w-8 h-8" />
            </button>

            {/* Accept */}
            <button
              onClick={onAccept}
              className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition transform hover:scale-110 active:scale-95 animate-pulse"
            >
              <Phone className="w-8 h-8" />
            </button>
          </div>

          {/* Helper text */}
          <p className="text-xs text-gray-500 text-center max-w-xs">
            Accept the call to start video chat, or decline to dismiss this
            notification.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallDialog;
