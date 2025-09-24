import React from "react";
import { Card, Space, Typography } from "antd";
import MonthNavigation from "../Common/MonthNavigation";
import { useMonthNavigation } from "../../hooks/useMonthNavigation";

const { Title, Text } = Typography;

const MonthNavigationExample: React.FC = () => {
  const { currentMonth, handleMonthChange, goToCurrentMonth } = useMonthNavigation();

  const handleFilterClick = () => {
    console.log("Filter clicked for month:", currentMonth);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Month Navigation Examples</Title>
      
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card title="Basic Month Navigation">
          <MonthNavigation
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
            showFilter={true}
            onFilterClick={handleFilterClick}
          />
        </Card>

        <Card title="Month Navigation without Filter">
          <MonthNavigation
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
            showFilter={false}
          />
        </Card>

        <Card title="Custom Styled Month Navigation">
          <MonthNavigation
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
            showFilter={true}
            onFilterClick={handleFilterClick}
            className="custom-month-nav"
          />
        </Card>

        <Card title="Current Month Info">
          <Text>Current selected month: <strong>{currentMonth}</strong></Text>
          <br />
          <Text>You can use the navigation above to change months.</Text>
        </Card>
      </Space>
    </div>
  );
};

export default MonthNavigationExample;
