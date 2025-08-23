import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  Users,
} from "lucide-react";

import UserList from "./UserList";
import CallControls from "./CallControls";
import IncomingCallDialog from "./IncomingCallDialog";
import VideoStream from "./VideoStream";
import { useVideoCall } from "../hooks/useVideoCall";

interface User {
  id: string;
  name: string;
  email: string;
  role: "doctor" | "employee";
}

interface VideoCallProps {
  currentUser: User;
}

const VideoCall: React.FC<VideoCallProps> = ({ currentUser }) => {
  const [isConnecting, setIsConnecting] = useState(true);

  const {
    // Connection state
    isConnected,
    connectionStatus,

    // Media streams
    localStream,
    remoteStream,

    // Call state
    isCallActive,
    isIncomingCall,
    incomingCallData,

    // Media controls
    isAudioOn,
    isVideoOn,

    // Users
    onlineUsers,

    // Actions
    initializeConnection,
    makeCall,
    answerCall,
    rejectCall,
    endCall,
    toggleAudio,
    toggleVideo,
    refreshUsers,
  } = useVideoCall(currentUser);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    initializeConnection();
    setIsConnecting(false);
  }, []);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-pulse-glow w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center">
            <Video className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Connecting...
            </h2>
            <p className="text-muted-foreground">
              Setting up your video call experience
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">VideoCall Pro</h1>
              <p className="text-sm text-muted-foreground">
                {currentUser.name} ({currentUser.role})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                isConnected
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </span>

            <button
              onClick={refreshUsers}
              className="flex items-center px-3 py-1.5 border rounded-md text-sm text-foreground hover:bg-gray-100 transition"
            >
              <Users className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Status */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 border shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {connectionStatus}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isCallActive ? "Call in progress" : "Ready to connect"}
                  </p>
                </div>
                {isCallActive && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Live</span>
                  </div>
                )}
              </div>
            </div>

            {/* Video Streams */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VideoStream
                ref={localVideoRef}
                title="You"
                subtitle={isVideoOn ? "Camera On" : "Camera Off"}
                isLocal={true}
                isMuted={!isAudioOn}
                hasVideo={isVideoOn}
              />

              <VideoStream
                ref={remoteVideoRef}
                title={remoteStream ? "Remote User" : "Waiting..."}
                subtitle={remoteStream ? "Connected" : "No remote video"}
                isLocal={false}
                hasVideo={!!remoteStream}
              />
            </div>

            {/* Call Controls */}
            {localStream && (
              <CallControls
                isCallActive={isCallActive}
                isAudioOn={isAudioOn}
                isVideoOn={isVideoOn}
                onToggleAudio={toggleAudio}
                onToggleVideo={toggleVideo}
                onEndCall={endCall}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UserList
              currentUser={currentUser}
              onlineUsers={onlineUsers}
              onCallUser={makeCall}
              isCallActive={isCallActive}
              isConnected={isConnected}
            />
          </div>
        </div>
      </div>

      {/* Incoming Call Dialog */}
      <IncomingCallDialog
        isOpen={isIncomingCall}
        callerData={incomingCallData}
        onAccept={answerCall}
        onReject={rejectCall}
      />
    </div>
  );
};

export default VideoCall;
