import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NotificationCard: React.FC = () => {
  const [closed, setClosed] = useState(false);
  const navigate = useNavigate();
  const handleClose = () => {
    setClosed(true);
    // You can add additional logic here if needed, such as sending a request to mark the notification as read
  };

  if (closed) {
    return null; // If the notification is closed, don't render anything
  }

  return (
    <div className="flex z-50 flex-row items-start p-4  w-[372px] h-[172px] absolute right-4 top-24 bg-white shadow-xl rounded-lg">
      <div className="flex-none flex ">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_1222_3369)">
            <path
              d="M10.715 17.5714C10.715 17.9124 10.8504 18.2394 11.0915 18.4806C11.3327 18.7217 11.6597 18.8571 12.0007 18.8571C12.3417 18.8571 12.6687 18.7217 12.9098 18.4806C13.1509 18.2394 13.2864 17.9124 13.2864 17.5714C13.2864 17.2304 13.1509 16.9034 12.9098 16.6623C12.6687 16.4212 12.3417 16.2857 12.0007 16.2857C11.6597 16.2857 11.3327 16.4212 11.0915 16.6623C10.8504 16.9034 10.715 17.2304 10.715 17.5714ZM11.1435 9.42857V14.3571C11.1435 14.475 11.24 14.5714 11.3578 14.5714H12.6435C12.7614 14.5714 12.8578 14.475 12.8578 14.3571V9.42857C12.8578 9.31071 12.7614 9.21429 12.6435 9.21429H11.3578C11.24 9.21429 11.1435 9.31071 11.1435 9.42857ZM23.8855 21.2143L12.7426 1.92857C12.5766 1.64196 12.29 1.5 12.0007 1.5C11.7114 1.5 11.4221 1.64196 11.2587 1.92857L0.115857 21.2143C-0.213607 21.7875 0.198893 22.5 0.857822 22.5H23.1435C23.8025 22.5 24.215 21.7875 23.8855 21.2143ZM2.89889 20.467L12.0007 4.71161L21.1025 20.467H2.89889Z"
              fill="#FADB14"
            />
          </g>
          <defs>
            <clipPath id="clip0_1222_3369">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center px-2">
          <h5 className="font-semibold text-lg text-black">
            Scheduled Appointment
          </h5>
        </div>
        <div className="">
          <p className="font-normal text-base text-black ml-4">
            You have a secluded appointment with Dr. Maria Summers at 5:00 PM
          </p>
        </div>
        <div className="flex flex-col justify-center items-end gap-2 mt-2">
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
          <button
            className="flex items-center justify-center px-2 py-1 gap-2 h-10 bg-[#000000] text-white font-semibold rounded-md"
            onClick={() => navigate("/appointments")}
          >
            View Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
