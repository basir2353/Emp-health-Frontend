// src/RoomWrapper.tsx
import { useParams } from "react-router-dom";
import { useContext } from "react";
import VideoRoom from "./VideoRoom";
import { AuthContext } from "../components/context/AuthContext";
import { v4 as uuidv4 } from "uuid";

function RoomWrapper() {
  const { id: roomID } = useParams();
  const { currentUser } = useContext(AuthContext);
  
// Use real user data from auth context
const user = {
  id: currentUser?.id || uuidv4(),   // Har user ke liye unique ID
  name: currentUser?.name || currentUser?.email || 'Anonymous User'
};


  return <VideoRoom roomID={roomID!} user={user} />;
}

export default RoomWrapper;
