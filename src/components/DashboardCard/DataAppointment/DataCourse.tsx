import { Button, Card, Empty, Progress } from "antd";
import React from "react";
import RunStep from "../../../public/images/Group 17.svg";
import HeartHealth from "../../../public/images/Group 18.svg";
function DataCourse() {
  return (
    <div>
      <Card
        bordered={false}
        className="w-[610px]  h-[418px] max-lg:w-auto max-lg:mb-10"
      >
        <div className="flex items-center justify-between">
          <div className="text-neutral-400 text-2xl font-normal leading-loose ml-2 ">
            Enrolled Courses
          </div>
          <div className="mt-2 mr-2 max-lg:ml-16">
            <Button
              type="default"
              style={{ color: "white", backgroundColor: "black" }}
              className="pl-3 "
            >
              Enroll Now
            </Button>
          </div>
        </div>

        <Card
          bordered={false}
          className="w-[594px]  h-[72px] max-lg:w-auto ml-2 top-4"
        >
          <div className="flex items-center justify-between p-3 bg-gray-100 border border-gray-200 rounded">
            <div className="w-[39px] h-[39px] flex items-center justify-center rounded-full">
              <img className="w-[28px] h-[28px]" src={RunStep} alt="" />
            </div>
            <span className="flex flex-col flex-grow ml-4 m-0">
              <span className="text-black text-base font-medium">
                Run to improve{" "}
              </span>
              <span className="text-gray-600 text-base">
                your health <span className="text-xs">(by Arjun)</span>
              </span>
            </span>
            <div className="hidden sm:flex flex-grow ml-4 w-[177px] mr-6">
              <Progress
                percent={20}
                strokeColor="black"
                trailColor="white"
                showInfo={false}
              />
            </div>
            <div className="flex items-center justify-center pb-1 w-[65px] h-[24px]cursor-pointer mt-2 bg-white   h-[24px] border border-solid border-neutral-5 shadow-button-secondary rounded-md">
              <div className="text-sm font-normal text-neutral-800 ">
                Resume
              </div>
            </div>
          </div>
        </Card>
        <Card
          bordered={false}
          className="w-[594px] h-[72px] max-lg:w-auto ml-2 top-6"
        >
          <div className="flex items-center justify-between p-3  rounded">
            <div className="w-[39px] h-[39px] flex items-center justify-center bg-white  rounded-full">
              <img className="w-[28px] h-[28px]" src={HeartHealth} alt="" />
            </div>
            <span className="flex flex-col flex-grow ml-4 m-0">
              <span className="text-black text-base font-medium">
                Eat healthy to be
              </span>
              <span className="text-gray-600 text-base">
                healthy <span className="text-xs">(by Ayesha) </span>
              </span>
            </span>
            <div className="hidden sm:flex flex-grow ml-4 w-[172px] mr-6">
              <Progress
                percent={50}
                strokeColor="black"
                trailColor="white"
                showInfo={false}
              />
            </div>
            <div className="flex items-center justify-center pb-1 w-[65px] h-[24px]cursor-pointer mt-2 bg-white   h-[24px] border border-solid border-neutral-5 shadow-button-secondary rounded-md">
              <div className="text-sm font-normal text-neutral-800 ">
                Resume
              </div>
            </div>
          </div>
        </Card>
        <div className="absolute w-[610px]  max-lg:w-full h-[46px] pt-3 text-center bottom-0 bg-[#E6F7FF] rounded-b-lg">
          See All
        </div>
      </Card>
    </div>
  );
}

export default DataCourse;
