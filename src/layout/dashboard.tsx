import { CloseOutlined } from "@ant-design/icons";
import { Button, Modal, Popover } from "antd";
import axios from "axios";
import React, { ReactNode, useState } from "react";
import Navbar from "../components/dashboard/navbar";
import SendArrow from "../sendArrow.png";
import ChatBotAvatar from "../public/images/onboarding/animoji.svg";
import { conversationalBot } from "../utils/langchain";
interface LayoutProps {
  children: ReactNode;
}
interface MessageProps {
  text: string;
  avatarSrc: string;
  avatarAlt: string;
  time: string;
  isUser?: boolean;
}

const Message: React.FC<MessageProps> = ({
  text,
  avatarSrc,
  avatarAlt,
  time,
  isUser = false,
}) => {
  return (
    <>
      <div
        className={`flex gap-3 text-xs tracking-normal leading-5 ${
          isUser ? "self-end" : "self-start"
        }`}
      >
        {!isUser && (
          <div className="flex justify-center items-center w-10 h-10 text-xl text-white bg-sky-300 rounded-full">
            OP
          </div>
        )}
        <div
          className={`grow justify-center px-4 py-3.5 rounded w-fit ${
            isUser
              ? "bg-black text-white"
              : "text-black bg-neutral-50 border border-solid border-zinc-300"
          }`}
        >
          {text}
        </div>
        {isUser && (
          <img
            loading="lazy"
            src={avatarSrc}
            alt={avatarAlt}
            className="my-auto w-11"
          />
        )}
      </div>
      <div
        className={`mt-2.5 text-xs text-zinc-800 ${
          isUser
            ? "self-end mr-14 max-md:mr-2.5"
            : "self-start ml-14 max-md:ml-2.5"
        }`}
      >
        {time}
      </div>
    </>
  );
};

export const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [visible, setVisible] = useState(true);
  const [closed, setClosed] = useState(false);

  const [messages, setMessages] = React.useState<MessageProps[]>([]);

  const [inputMsg, setInputMsg] = React.useState("");

  const showModal = () => {
    setIsModalVisible(true);
    setVisible(false);
    setClosed(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleVisibleChange = (isVisible: any) => {
    console.log("here", isVisible);

    // Prevent closing the popover on hover
    if (isVisible && !closed) {
      setVisible(true);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setClosed(true);
  };

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert hours to 12-hour format
    const formattedTime = `${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes} ${ampm}`;
    return formattedTime;
  };

  const popoverContent = (
    <div className=" bg-[#69C0FF] text-white ">
      <div className="flex justify-between items-center w-96  h-full ">
        <h3 className="text-lg ">How's your day going?</h3>
        <Button
          type="text"
          className="border-2 border-white flex justify-center items-center rounded-full w-4"
          onClick={handleClose}
        >
          <CloseOutlined className="text-white" />
        </Button>
      </div>
      <div className="flex mt-8 mb-4">
        <p className="mr-2 border-2 border-white rounded-full p-2">
          Very Bad 😭
        </p>
        <p className="mr-2 border-2 border-white rounded-full p-2">Good 😊</p>
        <p className="mr-2 border-2 border-white rounded-full p-2">Bad 🙁</p>
        <p className="mr-2 border-2 border-white rounded-full p-2">
          Fantastic 🤗
        </p>
      </div>
    </div>
  );
  const sendMessage = async (e: any) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: inputMsg,
        avatarSrc: ChatBotAvatar,
        avatarAlt: "User avatar",
        time: getCurrentTime(),
        isUser: true,
      },
    ]);

    // Clear the input message
    setInputMsg("");

      const response = await conversationalBot(inputMsg);
      console.log("response", response);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: response,
            avatarSrc: "",
            avatarAlt: "",
            time: getCurrentTime(),
            isUser: false,
            
          }
         
        ]);
      }
    
      
     


  const messageInput = (e: any) => {
    setInputMsg(e.target.value);
  };
  return (
    <div style={{ position: "relative" }}>
      <Navbar />
      {children}
      <div className=" z-9999 fixed bottom-0 w-full flex justify-end px-12  max-lg:justify-start">
        <Popover
          placement="topRight"
          content={popoverContent}
          visible={visible}
          onVisibleChange={handleVisibleChange}
          trigger="hover"
        >
          <img
            src={ChatBotAvatar}
            className="w-16 h-16 rounded-full"
            onClick={showModal}
          ></img>
        </Popover>
        <Modal
          title="Varun (Your Companion)"
          visible={isModalVisible}
          footer={null}
          onOk={handleOk}
          onCancel={handleCancel}
          className="absolute right-[25rem]"
          wrapClassName="custom-modal-width"
        >
          <div className="max-h-[550px] min-h-[550px]  w-[100%] overflow-y-auto flex flex-col-reverse ">
            <div className="w-full flex justify-end mt-4 flex-col">
              {messages.map((message, index) => (
                <Message
                  key={index}
                  text={message.text}
                  avatarSrc={message.avatarSrc}
                  avatarAlt={message.avatarAlt}
                  time={message.time}
                  isUser={message.isUser}
                />
              ))}
            </div>
          </div>
          <div className=" h-12 flex mt-4">
          <input
  type="text"
  value={inputMsg}
  onChange={(e) => messageInput(e)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      sendMessage(e);
    }
  }}
  placeholder="Type a message"
  className="w-[95%] h-full p-4 mr-2 border-2 outline-black"
/>


            <button
              onClick={(e) => sendMessage(e)}
              className="h-full bg-black text-white  w-[6%] flex justify-center items-center rounded"
            >
              <img src={SendArrow} alt="" className="h-6" />
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};
