import React, { useRef, useState, useEffect } from "react";
import { Input, Button, Avatar, Empty } from "antd";
import { PaperClipOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { conversationalBotCall } from "../../utils/langchaincall";

const UserMessage: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files?.length) {
      setUploadedFile(files[0]);
      console.log("Selected file:", files[0]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      sender: "user",
      message: inputText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputText("");

    try {
      const aiReply = await conversationalBotCall(inputText);
      const botMessage = {
        sender: "bot",
        message: aiReply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Bot error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          message: "Sorry, something went wrong. Please try again.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Chat Section - 2/3 */}
      <div className="w-2/3 flex flex-col">
        <div className="flex-grow overflow-auto p-4 bg-gray-100">
          {chatMessages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <Empty description="Start a conversation" />
            </div>
          ) : (
            chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-4 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start max-w-2xl w-full ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <Avatar src="/profile.jpeg" className="mr-2" size="large" />
                  )}
                  <div
                    className={`rounded-xl px-4 py-3 shadow-sm text-sm whitespace-pre-line break-words flex flex-col w-fit max-w-[80%] ${
                      msg.sender === "user"
                        ? "bg-white text-gray-700 mr-0"
                        : "bg-yellow-50 text-gray-900 border border-yellow-300"
                    }`}
                  >
                    <span>{msg.message.replace("##SHOW_CALL_BUTTON##", "").trim()}</span>
                    <div className="text-[10px] text-gray-500 mt-1 text-right">
                      {msg.timestamp}
                    </div>
                    {msg.sender === "bot" &&
                      msg.message.includes("##SHOW_CALL_BUTTON##") && (
                        <Button
                          size="small"
                          type="primary"
                          style={{ backgroundColor: "black" }}
                          className="mt-2"
                          onClick={() => navigate("/inbox/call")}
                        >
                          Connect via Call
                        </Button>
                      )}
                  </div>
                  {msg.sender === "user" && (
                    <Avatar icon={<UserOutlined />} className="ml-2 bg-black" />
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messageEndRef} />
        </div>

        <div className="p-4 border-t bg-white sticky bottom-0">
          <div className="flex items-center gap-2">
            <Input
              className="flex-1"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPressEnter={handleSendMessage}
              suffix={
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                  />
                  <PaperClipOutlined
                    onClick={handleFileButtonClick}
                    className="cursor-pointer text-lg text-gray-500 hover:text-black"
                  />
                </>
              }
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              className="bg-black"
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* File Preview Section - 1/3 */}
      <div className="w-1/3 border-l border-gray-200 p-4 bg-white">
        <h3 className="text-lg font-semibold mb-4">Uploaded File</h3>
        {uploadedFile ? (
          <div className="flex flex-col items-center w-full">
            {uploadedFile.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(uploadedFile)}
                alt="Uploaded preview"
                className="w-full h-[600px] object-contain rounded shadow"
              />
            ) : uploadedFile.type === "application/pdf" ? (
              <iframe
                src={URL.createObjectURL(uploadedFile)}
                title="PDF Preview"
                className="w-full h-[650px] border border-gray-300 rounded shadow"
              />
            ) : (
              <div className="text-center p-4 border border-gray-300 rounded w-full">
                <p className="text-gray-700 font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500">Type: {uploadedFile.type}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <PaperClipOutlined style={{ fontSize: 48 }} />
            <p className="mt-2 text-sm">No file uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMessage;