import { Flex, Space, Spin } from "antd";
import React from "react";

interface AlertProps {
  type: string;
  message: string;
  closable?: boolean;
  description?: string;
  showIcon?: boolean;
}

export const Alert: React.FC<AlertProps> = ({ type, message, description }) => {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Alert
        message={message}
        closable={true}
        description={description}
        type={type}
        showIcon
      />
    </Space>
  );
};
