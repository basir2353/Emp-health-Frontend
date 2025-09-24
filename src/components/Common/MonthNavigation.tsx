import React from "react";
import { Button } from "antd";
import { LeftOutlined, RightOutlined, FilterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface MonthNavigationProps {
  currentMonth: string;
  onMonthChange: (direction: "prev" | "next") => void;
  showFilter?: boolean;
  onFilterClick?: () => void;
  className?: string;
}

const MonthNavigation: React.FC<MonthNavigationProps> = ({
  currentMonth,
  onMonthChange,
  showFilter = true,
  onFilterClick,
  className = ""
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Button
        className="bg-white shadow-md px-2 py-1 justify-center mr-2 border-2 border-gray-200 rounded-lg"
        onClick={() => onMonthChange("prev")}
      >
        <LeftOutlined />
      </Button>
      <div className="text-lg font-medium">{currentMonth}</div>
      <Button
        className="bg-white shadow-md px-2 py-1 justify-center ml-2 border-2 border-gray-200 rounded-lg"
        onClick={() => onMonthChange("next")}
      >
        <RightOutlined />
      </Button>
      {showFilter && (
        <Button 
          className="ml-2" 
          type="default" 
          icon={<FilterOutlined />}
          onClick={onFilterClick}
        >
          Filter
        </Button>
      )}
    </div>
  );
};

export default MonthNavigation;
