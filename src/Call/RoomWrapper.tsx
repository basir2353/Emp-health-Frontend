// src/RoomWrapper.tsx
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import VideoRoom from "./VideoRoom";

function RoomWrapper() {
  const { id: roomID } = useParams();
  const currentUser = { id: uuidv4(), name: "Hashir" }; // ✅ unique per client

  return <VideoRoom roomID={roomID!} user={currentUser} />;
}

export default RoomWrapper;
