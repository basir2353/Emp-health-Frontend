import { PaperClipOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Card, Input, Progress } from "antd";
import React, { useState, useRef } from "react";

const MessagingSection: React.FC = () => {
  // State to manage chat messages and message input
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "other",
      message: "Yeah, It’s been a difficult weekend.",
      imageUrl: "/profile.jpeg",
      timestamp: "12:30 PM",
    },
    {
      sender: "other",
      message:
        "Since last week, I've been experiencing persistent migraines along with some digestive issues. The migraines have been particularly bothersome and have been affecting my daily activities.",
      imageUrl: "/profile.jpeg",
      timestamp: "12:31 PM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to trigger file selection
  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file change (for simplicity, logs file)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log("Selected file:", files[0]);
    }
  };

  // Handle message send
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        sender: "user",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString(),
        imageUrl: "/profile.jpeg",  // Add this line to ensure the structure matches
      };
      setChatMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage(""); // Clear the input field after sending
    }
  };

  // Handle message input change
  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  return (
    <div className="flex">
      <div className="flex flex-col w-3/4 h-[910px] mt-48">
        <div className="flex-grow p-4 overflow-auto">
          <div className="mt-60">
            {chatMessages.map((msg, index) => (
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
                      alt="User Avatar"
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
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-row items-center">
            <Input
              className="flex-grow mr-2"
              placeholder="Type Message..."
              value={newMessage}
              onChange={handleMessageChange}
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
                onClick={handleSendMessage} // Send the message when clicked
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Card className="w-[437px] h-[910px] flex flex-col justify-center px-5">
        <div className="text-center">
          <div className="mb-10">
            <img
              src="/profile.jpeg"
              alt="User Avatar"
              className="rounded-full h-40 w-40 mx-auto mb-1"
            />
            <p className="text-xl font-bold">John Doe</p>
            <p className="text-base">Emp Id: 320932</p>
          </div>
          <div className="bg-[#76b8f6] bg-opacity-50 border rounded-lg p-4 mb-4">
            <div className="flex justify-between mt-3 mb-3">
              <p className="text-base">Date of Birth</p>
              <p className="text-base font-semibold">12 January, 1993</p>
            </div>
            <div className="flex justify-between mt-3 mb-3">
              <p className="text-base">Previous Appointment</p>
              <p className="text-base font-semibold">N/A</p>
            </div>
            <div className="flex justify-between mt-3 mb-3">
              <p className="text-base">Known Allergies</p>
              <p className="text-base font-semibold">Nut Allergy</p>
            </div>
          </div>
          <div className="top-0 left-0 w-full h-full rounded-full clip-auto mt-10 mb-10">
            <Progress
              type="circle"
              percent={50}
              width={140}
              format={() => "32:10"}
              strokeColor={{
                "0%": "#141414",
                "100%": "#141414",
              }}
            />
          </div>
          <Button style={{ color: "red", borderColor: "red" }} type="default">
            End Appointment
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MessagingSection;
