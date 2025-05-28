import React, { useRef, useState, useEffect } from "react";
import { Input, Button, Card } from "antd";
import {
  AudioMutedOutlined,
  PaperClipOutlined,
  PhoneOutlined,
  SendOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Mic1, Mic2 } from "./svg";

// Interface for chat message structure
interface ChatMessage {
  sender: "user" | "other";
  message: string;
  imageUrl?: string;
  timestamp: string;
}

const Callchat: React.FC = () => {
  // State for chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "other",
      message: "Yeah, It’s been a difficult weekend.",
      imageUrl: "/profile.jpeg",
      timestamp: "12:30 PM",
    },
    {
      sender: "other",
      message:
        "Since last week, I've been experiencing persistent migraines along with some digestive issues. The migraines have been particularly bothersome and have been affecting my daily activities. Additionally, I've noticed some discomfort and irregularities in my digestive system.",
      imageUrl: "/profile.jpeg",
      timestamp: "12:31 PM",
    },
    {
      sender: "user",
      message: "Hi, How was your weekend",
      timestamp: "12:32 PM",
    },
  ]);

  // State for input field
  const [inputValue, setInputValue] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Function to get current time as a formatted string
  const getCurrentTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return; // Prevent sending empty messages

    const newMessage: ChatMessage = {
      sender: "user",
      message: inputValue,
      timestamp: getCurrentTime(),
    };

    setMessages([...messages, newMessage]);
    setInputValue(""); // Clear input field
  };

  // Function to handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Function to trigger the click event of the file input element
  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log("Selected file:", files[0]);
    }
  };

  // Scroll to the bottom of the messages when a new message is added
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesEndRef.current.scrollIntoView({ block: "end" });
    }
  }, [messages]);

  return (
    <div className="flex mx-auto my-auto">
      <Card className="flex flex-col w-3/4 relative">
        <div className="relative flex justify-center gap-4 mt-10">
          <div className="relative w-[438px] h-[566px]">
            <img
              src="/profile.jpeg"
              alt="Samantha Willis Video"
              className="w-full h-full object-cover rounded-md"
            />
            <div className="absolute bottom-2 left-2 bg-white rounded-full">
              <div className="flex items-center">
                <Mic1 />
                <div className="text-lg font-semibold px-2">Samantha Willis</div>
              </div>
            </div>
          </div>

          <div className="w-[438px] h-[566px]">
            <img
              src="/profile.jpeg"
              alt="John Doe Video"
              className="top-0 left-0 w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="absolute bottom-2 left-[580px] bg-white rounded-full">
            <div className="flex items-center">
              <Mic2 />
              <div className="text-lg font-semibold px-3">John Doe</div>
            </div>
          </div>
        </div>

        <div className="bottom-4 left-4 justify-center flex mt-24 gap-3">
          <Button icon={<VideoCameraOutlined />} size="large" className="mr-2" />
          <Button
            icon={<PhoneOutlined />}
            size="large"
            className="mr-2 text-white"
            style={{ background: "#FF4D4F", color: "white" }}
          >
            End Call
          </Button>
          <Button icon={<AudioMutedOutlined />} size="large" />
        </div>
      </Card>

      <Card className="flex flex-col bg-gray-100 w-1/4 h-[700px]">
        <div
          ref={messagesContainerRef}
          className="flex-grow p-4 overflow-y-auto"
          style={{ maxHeight: "calc(100% - 80px)" }} // Adjust height to account for input box
        >
          <div className="flex flex-col min-h-full justify-end">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                } mb-4`}
              >
                <div className="flex">
                  {msg.sender === "other" && msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt={`${msg.sender} Avatar`}
                      className="rounded-full h-8 w-8 mr-2 border-2 mt-7 border-black"
                    />
                  )}
                  <div className="flex-col flex">
                    <div
                      className={`p-4 rounded-lg max-w-md ${
                        msg.sender === "user"
                          ? "bg-white text-gray-700"
                          : "bg-yellow-200 text-gray-800"
                      }`}
                    >
                      <p className="mb-1">{msg.message}</p>
                    </div>
                    <span className="text-xs">{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="p-4 border-t bg-gray-100 sticky  z-50">
          <div className="flex flex-row items-center">
            <Input
              className="flex-grow mr-2"
              placeholder="Type Message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              suffix={
                <Button
                  icon={
                    <div className="flex items-center -mt-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button
                        icon={
                          <PaperClipOutlined className="rounded-full border border-black text-black p-1" />
                        }
                        type="link"
                        onClick={handleFileButtonClick}
                        className="ml-2"
                      />
                    </div>
                  }
                  type="link"
                />
              }
            />
            <div>
              <Button
                type="primary"
                size="large"
                className="flex items-center justify-center"
                style={{ background: "black" }}
                icon={<SendOutlined />}
                onClick={handleSendMessage}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Callchat;