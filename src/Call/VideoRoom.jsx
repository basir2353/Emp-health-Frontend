import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ZIM } from "zego-zim-web";
import { v4 as uuidv4 } from "uuid";

export default function VideoRoom({ roomID, user }) {
  const containerRef = useRef(null);

  useEffect(() => {
    (async () => {
      const appID = 1757000422;
      const userID = user.id || uuidv4(); // Ensure unique userID
      const userName = user.name || `user_${userID}`;

      // Fetch token with both userID and roomID
      const resp = await fetch(
        `http://empolyee-backedn.onrender.com/api/zego/token?userID=${userID}&roomID=${roomID}`
      );
      const { token } = await resp.json();

      // Generate kitToken for production
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        appID,
        token,
        roomID,
        userID,
        userName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.addPlugins({ ZIM });

      zp.joinRoom({
        container: containerRef.current,
        sharedLinks: [
          {
            name: "Copy link",
            url: `${window.location.origin}/room/${roomID}`,
          },
        ],
        scenario: { mode: ZegoUIKitPrebuilt.GroupCall },
        maxUsers: 100, // Allow multiple users
        showScreenSharingButton: true,
        onRoomUserUpdate: (roomID, updateType, userList) => {
          console.log("Room user update:", { roomID, updateType, userList });
          if (updateType === "DELETE") {
            console.log("User left or was removed:", userList);
          }
        },
        onRoomStateChanged: (state, errorCode, extendedData) => {
          console.log("Room state changed:", { state, errorCode, extendedData });
          if (errorCode !== 0) {
            console.error("Room join error:", { errorCode, extendedData });
            if (errorCode === 1002038) {
              console.log("User was kicked out, attempting to reconnect...");
              zp.joinRoom({
                container: containerRef.current,
                sharedLinks: [
                  {
                    name: "Copy link",
                    url: `${window.location.origin}/room/${roomID}`,
                  },
                ],
                scenario: { mode: ZegoUIKitPrebuilt.GroupCall },
                maxUsers: 100,
                showScreenSharingButton: true,
              });
            } else {
              alert(`Failed to join room: Error code ${errorCode}`);
            }
          }
        },
      });
    })();
  }, [roomID, user]);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}