import { ReactNode } from "react";
import ChatBoxNavbar from "../Component/ChatBox/Navbar";

interface LayoutProps {
  children: ReactNode;
}

export const ChatBoxLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <ChatBoxNavbar />
      {children}
    </div>
  );
};
