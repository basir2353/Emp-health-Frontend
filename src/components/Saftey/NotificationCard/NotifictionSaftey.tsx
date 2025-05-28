import { InfoCircleOutlined } from "@ant-design/icons";
import React, { useState } from "react";

const NotifictionSaftey: React.FC = () => {
  const [closed, setClosed] = useState(false);

  const handleClose = () => {
    setClosed(true);
    // You can add additional logic here if needed, such as sending a request to mark the notification as read
  };

  if (closed) {
    return null; // If the notification is closed, don't render anything
  }

  return (
    <div className="flex z-50 flex-row items-start p-4  w-[372px] h-[159px] absolute right-4 top-24 bg-white shadow-xl rounded-lg">
      <div className="flex-none flex text-yellow-300 mt-2">
      <InfoCircleOutlined />

      </div>
      <div className="flex flex-col">
        <div className="flex items-center px-2">
          <p className="text-lg text-yellow-300">
          Pending Incident
          </p>
        </div>
        <div className="">
          <p className="font-normal text-xs text-black ml-4">
          Incident <span> #0023</span> is pending to be investigated please review proceed forward.          </p>
        </div>
        <div className="flex flex-col justify-center items-end gap-2 mt-4">
          <button
            className="top-5 mr-3 flex items-center justify-center absolute right-2"
            onClick={handleClose}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.70916 4.52905C9.70916 4.4603 9.65291 4.40405 9.58416 4.40405L8.55291 4.40874L6.99978 6.2603L5.44822 4.4103L4.41541 4.40562C4.34666 4.40562 4.29041 4.4603 4.29041 4.53062C4.29041 4.5603 4.30134 4.58843 4.32009 4.61187L6.35291 7.03374L4.32009 9.45405C4.30121 9.47695 4.29074 9.50562 4.29041 9.5353C4.29041 9.60405 4.34666 9.6603 4.41541 9.6603L5.44822 9.65561L6.99978 7.80405L8.55134 9.65405L9.58259 9.65874C9.65134 9.65874 9.70759 9.60405 9.70759 9.53374C9.70759 9.50405 9.69666 9.47593 9.67791 9.45249L7.64822 7.03218L9.68103 4.6103C9.69978 4.58843 9.70916 4.55874 9.70916 4.52905Z"
                fill="black"
                fillOpacity="0.45"
              />
              <path
                d="M7 0C3.13437 0 0 3.13437 0 7C0 10.8656 3.13437 14 7 14C10.8656 14 14 10.8656 14 7C14 3.13437 10.8656 0 7 0ZM7 12.8125C3.79063 12.8125 1.1875 10.2094 1.1875 7C1.1875 3.79063 3.79063 1.1875 7 1.1875C10.2094 1.1875 12.8125 3.79063 12.8125 7C12.8125 10.2094 10.2094 12.8125 7 12.8125Z"
                fill="black"
                fillOpacity="0.45"
              />
            </svg>
          </button>
          <button className="flex items-center justify-center px-2 py-1 gap-2 h-10 bg-[#000000] text-white font-semibold rounded-md">
            View 
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotifictionSaftey;
