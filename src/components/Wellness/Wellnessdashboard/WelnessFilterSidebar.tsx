import React from "react";
import { Drawer, Button, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelnessFilterSidebar: React.FC<FilterSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <CloseOutlined style={{ marginRight: 8 }} />
            Filter
          </div>
          <div>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" style={{ marginLeft: 8, background: 'black' }}>Done</Button>
          </div>
        </div>
      }
      placement="right"
      closable={false}
      onClose={onClose}
      visible={isOpen}
      width={500} // Adjust the width as needed
    >
      {/* Goal Name Input */}
      <div style={{ marginBottom: 16 }}>
        <Input placeholder="Enter Goal Name" />
      </div>

      {/* End Date Input */}
      <div style={{ marginBottom: 16 }}>
        <Input placeholder="End Date (Optional)" />
      </div>

      {/* Frequency Select */}
      <div style={{ marginBottom: 16 }}>
        <Select placeholder="Select Frequency">
          <Option value="daily">Daily</Option>
          <Option value="weekly">Weekly</Option>
          <Option value="monthly">Monthly</Option>
        </Select>
      </div>

      {/* Description Textarea */}
      <div style={{ marginBottom: 16 }}>
        <TextArea rows={2} placeholder="Write Description" />
      </div>

      {/* Delete Button */}
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" danger icon={<DeleteOutlined />}>Delete</Button>
      </div>
    </Drawer>
  );
};

export default WelnessFilterSidebar;
