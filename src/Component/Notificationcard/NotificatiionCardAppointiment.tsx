import React, { useState } from "react";

const NotificatiionCardAppointiment: React.FC = () => {
  const [closed, setClosed] = useState(false);

  const handleClose = () => {
    setClosed(true);
    // You can add additional logic here if needed, such as sending a request to mark the notification as read
  };

  if (closed) {
    return null; // If the notification is closed, don't render anything
  }

  return (
    <div className="flex z-50 flex-row items-start px-2 py-4  w-[372px] h-[159px] absolute right-4 top-24 bg-white shadow-xl rounded-lg">
      <div className="flex-none flex ">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.0096 5.87714C22.6505 5.04581 22.1328 4.29247 21.4854 3.65928C20.8376 3.02421 20.0737 2.51953 19.2354 2.17268C18.3662 1.81159 17.4339 1.62676 16.4926 1.62893C15.1721 1.62893 13.8837 1.99053 12.764 2.67357C12.4962 2.83696 12.2417 3.01643 12.0006 3.21196C11.7596 3.01643 11.5051 2.83696 11.2372 2.67357C10.1176 1.99053 8.8292 1.62893 7.50866 1.62893C6.55777 1.62893 5.63634 1.81107 4.76581 2.17268C3.92473 2.52089 3.1667 3.02178 2.51581 3.65928C1.86758 4.29175 1.34977 5.04527 0.991699 5.87714C0.619378 6.74232 0.429199 7.66107 0.429199 8.6066C0.429199 9.49857 0.611342 10.428 0.972949 11.3736C1.27563 12.1637 1.70956 12.9834 2.26402 13.8111C3.14259 15.1209 4.35063 16.487 5.85063 17.8718C8.33634 20.1673 10.7979 21.753 10.9024 21.8173L11.5372 22.2245C11.8185 22.4039 12.1801 22.4039 12.4613 22.2245L13.0962 21.8173C13.2006 21.7504 15.6596 20.1673 18.1479 17.8718C19.6479 16.487 20.856 15.1209 21.7346 13.8111C22.289 12.9834 22.7256 12.1637 23.0256 11.3736C23.3872 10.428 23.5694 9.49857 23.5694 8.6066C23.5721 7.66107 23.3819 6.74232 23.0096 5.87714ZM12.0006 20.1057C12.0006 20.1057 2.46491 13.9959 2.46491 8.6066C2.46491 5.87714 4.72295 3.66464 7.50866 3.66464C9.4667 3.66464 11.1649 4.7575 12.0006 6.35392C12.8363 4.7575 14.5346 3.66464 16.4926 3.66464C19.2783 3.66464 21.5363 5.87714 21.5363 8.6066C21.5363 13.9959 12.0006 20.1057 12.0006 20.1057Z"
            fill="black"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center px-2">
          <h5 className="font-semibold text-lg text-black">
            Insurance plan change request
          </h5>
        </div>
        <div className="">
          <p className="font-normal text-sm text-black ml-2">
            Alex has requested to change the insurance plan and the request is
            waiting for your approval.{" "}
          </p>
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
            View Request{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificatiionCardAppointiment;
