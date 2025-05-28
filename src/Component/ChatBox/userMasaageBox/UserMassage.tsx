import React, { useRef } from "react";
import { Input, Button } from "antd";
import { PaperClipOutlined, SendOutlined } from "@ant-design/icons";

const UserMessage: React.FC = () => {
  // Example data for chat messages from two persons
  const chatMessages = [
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
  ];
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // Handle file upload
      console.log("Selected file:", files[0]);
    }
  };
  return (
    <div className="flex flex-col h-screen ">
      <div className="flex-grow p-4 overflow-auto ">
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
                      icon={<PaperClipOutlined className="rounded-full border border-black text-black p-1" />}
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
            >
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
