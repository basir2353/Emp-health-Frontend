import { Card } from "antd";
import React from "react";

function StatsCard() {
  return (
    <Card 
      bordered={false} 
      className="w-full bg-white rounded-lg shadow-lg"
      bodyStyle={{ padding: '24px' }}
    >
      <h3 className="text-gray-500 text-xl font-normal mb-6">
        Basic Stats
      </h3>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="text-gray-600 text-sm font-normal mb-1">
              Current Enrollments
            </div>
            <div className="text-black text-2xl font-normal">
              0
            </div>
          </div>
          <div>
            <div className="text-gray-600 text-sm font-normal mb-1">
              Acquired Points
            </div>
            <div className="text-black text-2xl font-normal">
              120
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="text-gray-600 text-sm font-normal mb-1">
              Work Life Balance Score
            </div>
            <div className="text-black text-2xl font-normal">
              60
            </div>
          </div>
          <div>
            <div className="text-gray-600 text-sm font-normal mb-1">
              Completed Courses
            </div>
            <div className="text-black text-2xl font-normal">
              2
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default StatsCard;