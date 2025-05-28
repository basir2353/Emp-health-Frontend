import { Card } from "antd";
import React from "react";

function StatsCard() {
  return (
    <div>
      <Card bordered={false} className="w-[391px] h-[218px] max-lg:w-auto mt-3">
        <div className=" text-neutral-400 text-2xl font-normal  leading-loose pl-3 ">
          Basic Stats
        </div>

        <div className="w-96 h-40 py-2 rounded justify-between items-start inline-flex pl-3">
          <div className="flex-col justify-start items-start inline-flex">
            <div className="flex-col justify-start items-start flex">
              <div className="justify-start items-center inline-flex">
                <div className="text-black text-opacity-90 text-sm font-normal  leading-snug">
                  Current Enrollments
                </div>
              </div>
              <div className="justify-start items-center inline-flex">
                <div className="py-0.5 flex-col justify-center items-start inline-flex">
                  <div className="text-black text-opacity-90 text-2xl font-normal  leading-loose">
                    0
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-col justify-start items-start flex">
              <div className="justify-start items-center gap-1 inline-flex">
                <div className="text-black text-opacity-90 text-sm font-normal  leading-snug">
                  Acquired Points
                </div>
              </div>
              <div className="justify-start items-center inline-flex">
                <div className="py-0.5 flex-col justify-center items-start inline-flex">
                  <div className="text-black text-opacity-90 text-2xl font-normal  leading-loose">
                    120
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-col justify-start items-start inline-flex pl-5">
            <div className="flex-col justify-start items-start flex">
              <div className="justify-start items-center inline-flex">
                <div className="text-black text-opacity-90 text-sm font-normal  leading-snug">
                  Work Life Balance Score
                </div>
              </div>
              <div className="justify-start items-center inline-flex">
                <div className="py-0.5 flex-col justify-center items-start inline-flex">
                  <div className="text-black text-opacity-90 text-2xl font-normal  leading-loose">
                    60
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-col justify-start items-start flex">
              <div className="justify-start items-center inline-flex">
                <div className="text-black text-opacity-90 text-sm font-normal  leading-snug">
                  Completed Courses
                </div>
              </div>
              <div className="justify-start items-center inline-flex">
                <div className="py-0.5 flex-col justify-center items-start inline-flex">
                  <div className="text-black text-opacity-90 text-2xl font-normal  leading-loose">
                    2
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default StatsCard;
