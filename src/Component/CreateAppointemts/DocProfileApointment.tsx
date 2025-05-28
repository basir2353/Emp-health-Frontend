import { Image } from "antd";
import React from "react";

function DocProfileApointment() {
  return (
    <div>
      <div className="flex flex-col items-start shadow-md py-3 rounded-md border-2 ">
        <div className="flex flex-col items-start  ">
          <div className="flex items-center p-5">
            <div className="w-[60px] h-[60px] rounded-full overflow-hidden mr-3 border-2">
              <Image
                src="https://s3-alpha-sig.figma.com/img/6d2b/e0db/1099797bd7ed269571ce487ec7f90acf?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AUDWxhQ-QBM4GRKOCwS6Ko-4MONh1OHjWdv~NWYYioXHbE~QE9FJRevnF-JmU~cRVOh-miOUc86khTstgREt3KiXlDUmjvLhIVRMH0iZSgtMJqVncWcKygexDmeCol~9OfioVYu~Qt9rPeY~8SwSufCPP5nlP1KBV3NgJuvEPxOLtpI9nfGG0yW0ebKLKEF6XX0xScpO9ISEJTYC5P5g7uKHN168rk47ZFLa~nXyh~IlzGLMqWgSUV0fwKW4iWNJWZYV8UQawKyQJ~0aUsgLH8MBHWgyFiCVJBRCTPSDzIytFm1LSgRwiEOeGoQrzjZTCe-jWvlqe0DR5crmdhJuZQ__"
                alt="Profile"
                className="w-96 h-96 object-cover"
              />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="text-lg font-bold text-black">
                Dr. Maria Summers
                <span className=" font-normal text-base">(Neurologist)</span>
              </h3>
              <p className="font-normal text-base leading-9 text-gray-500">
                M.B.B.S., F.C.P.S. (Neurology)
              </p>
            </div>
          </div>
          <button className="flex items-center justify-center ml-5 gap-10 w-[105px] h-[24px] bg-white border border-gray-300 rounded shadow">
            View Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocProfileApointment;
