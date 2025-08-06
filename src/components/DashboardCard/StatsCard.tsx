import { Card } from "antd";
import React from "react";

function StatsCard() {
  return (
    <Card bordered={false} className="w-full max-w-md mt-3 bg-white p-4">
      <div className="text-neutral-400 text-xl sm:text-2xl font-normal leading-loose">
        Basic Stats
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-black text-opacity-90 text-sm font-normal leading-snug">
              Current Enrollments
            </span>
            <span className="text-black text-opacity-90 text-xl sm:text-2xl font-normal leading-loose">
              0
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-black text-opacity-90 text-sm font-normal leading-snug">
              Acquired Points
            </span>
            <span className="text-black text-opacity-90 text-xl sm:text-2xl font-normal leading-loose">
              120
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-black text-opacity-90 text-sm font-normal leading-snug">
              Work Life Balance Score
            </span>
            <span className="text-black text-opacity-90 text-xl sm:text-2xl font-normal leading-loose">
              60
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-black text-opacity-90 text-sm font-normal leading-snug">
              Completed Courses
            </span>
            <span className="text-black text-opacity-90 text-xl sm:text-2xl font-normal leading-loose">
              2
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default StatsCard;