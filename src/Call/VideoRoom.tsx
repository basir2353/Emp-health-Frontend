import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

interface Props {
  roomID: string;
  user: { id: string; name: string };
}

interface ZegoUser {
  userID: string;
  userName: string;
}

const VideoRoom: React.FC<Props> = ({ roomID, user }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const zpRef = useRef<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (!user?.id || !roomID || !containerRef.current) {
          console.error("Missing required data or container not ready");
          return;
        }

        const appID = 649435891; // Your App ID
        const serverSecret = "d724123f7b4555f6b53f7b83716de86f"; // Your Server Secret

        // Generate kit token for testing (NOT for production)
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          user.id,
          user.name
        );

        console.log("Generated kit token:", kitToken);

        // Create ZegoUIKitPrebuilt instance
        zpRef.current = ZegoUIKitPrebuilt.create(kitToken);
        
        // Join room with proper configuration
        await zpRef.current.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          showPreJoinView: false,
          showLeavingView: true,
          turnOnMicrophoneWhenJoining: false,
          turnOnCameraWhenJoining: true,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: true,
          showTextChat: true,
          showUserList: true,
          maxUsers: 10,
          layout: "Grid",
          sharedLinks: [
            {
              name: 'Copy room link',
              url: `${window.location.origin}/room/${roomID}`,
            },
          ],
          onJoinRoom: () => {
            console.log("Successfully joined room:", roomID);
          },
          onLeaveRoom: () => {
            console.log("Left room:", roomID);
          },
          onUserJoin: (users: ZegoUser[]) => {
            console.log("Users joined:", users);
          },
          onUserLeave: (users: ZegoUser[]) => {
            console.log("Users left:", users);
          },
        });

      } catch (error) {
        console.error("Failed to initialize video room:", error);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(init, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (zpRef.current) {
        try {
          zpRef.current.destroy();
        } catch (error) {
          console.error("Error destroying video room:", error);
        }
        zpRef.current = null;
      }
    };
  }, [roomID, user?.id, user?.name]);

  if (!roomID || !user?.id) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading room...</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: "100%", 
        height: "100vh",
        backgroundColor: "#f0f0f0"
      }} 
    />
  );
};

export default VideoRoom;