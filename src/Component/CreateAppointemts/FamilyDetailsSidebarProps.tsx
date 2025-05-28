import React from "react";
import { Drawer, Button, Table } from "antd";
import { ManOutlined, UserAddOutlined } from "@ant-design/icons"; // Import the ManOutlined icon

interface FamilySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const FamilySidebar: React.FC<FamilySidebarProps> = ({ isOpen, onClose }) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Relation",
      dataIndex: "relation",
      key: "relation",
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Covered by Insurance",
      dataIndex: "insurance",
      key: "insurance",
    },
  ];

  const data = [
    {
      key: "1",
      name: "Patricia Willis",
      relation: "Wife",
      dob: "12-05-1989",
      gender: "Female",
      insurance: "Covered",
    },
    {
      key: "2",
      name: "Rosy Willis",
      relation: "Daughter",
      dob: "05-12-2002",
      gender: "Female",
      insurance: "Covered",
    },
    {
      key: "3",
      name: "Benjamin Willis",
      relation: "Son",
      dob: "11-05-2006",
      gender: "Male",
      insurance: "Covered",
    },
  ];

  return (
    <Drawer
      title={
        <div className="flex justify-between items-center">
          <span>Family Details</span>
          <div>
            <Button type="default" onClick={onClose} style={{ marginRight: 8 }}>
              Close
            </Button>
            <Button type="primary" style={{ background: "black" }}>
              Done
            </Button>
          </div>
        </div>
      }
      width={1000}
      placement="right"
      onClose={onClose}
      open={isOpen}
      closable={false}
    >
      <Table
        columns={columns}
        dataSource={data}
        rowClassName="gap-10" // Add gap between items
        pagination={false} // Remove pagination
        className="mb-4 justify-between" // Add margin to the table
      />
      <div className="flex justify-center">
        <Button type="default" style={{ width: "100%" }}>
          <UserAddOutlined className="-ml-2 absolute m" /> Add Family Details{" "}
          {/* Include the ManOutlined icon */}
        </Button>
      </div>
    </Drawer>
  );
};

export default FamilySidebar;
