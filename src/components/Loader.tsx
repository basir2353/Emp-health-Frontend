import { Flex, Spin } from "antd";
import React from "react";

export const Loader: React.FC = () => {
  return (
    <Flex gap="small" vertical>
      <Flex gap="small">
        <Spin tip="Loading" fullscreen={true} size="large">
          <div className="content" />
        </Spin>
      </Flex>
    </Flex>
  );
};
