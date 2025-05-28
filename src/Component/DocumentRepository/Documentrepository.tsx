import React, { useState } from "react";
import { Table, Button, Avatar, Dropdown, Menu, Breadcrumb, Upload, message } from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  EllipsisOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import DrAlishaKane from "../../public/images/Alisha.svg"; // Ensure the image path is correct

interface User {
  name: string;
  avatar: string;
  userName: string;
}

interface DataSourceItem {
  key: string;
  file: string;
  uploadDate: string;
  uploadedBy: User;
}

const initialDataSource: DataSourceItem[] = [
  {
    key: "1",
    file: "Insurance.pdf",
    uploadDate: "7 Mar 2022",
    uploadedBy: {
      name: "John Doe",
      avatar: DrAlishaKane,
      userName: "johndoe",  // Add the missing userName field
    },
  },
];

const user = JSON.parse(localStorage.getItem("user") || "{}");
const userName = user?.user?.name || "Anonymous";

const getFileIcon = (fileName: string): JSX.Element | null => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return <FilePdfOutlined className="text-3xl font-bold text-red-500" />;
    case "doc":
    case "docx":
      return <FileWordOutlined className="text-3xl font-bold text-blue-500" />;
    default:
      return null;
  }
};

const ActionMenu = ({ record }: { record: DataSourceItem }) => (
  <Menu>
    <Menu.Item key="0" icon={<EyeOutlined />}>
      View
    </Menu.Item>
    <Menu.Item key="1" icon={<DownloadOutlined />}>
      Download
    </Menu.Item>
  </Menu>
);

const columns = [
  {
    title: "Files",
    dataIndex: "file",
    key: "file",
    render: (text: string) => (
      <div className="flex items-center">
        {getFileIcon(text)}
        <span className="ml-2">{text}</span>
      </div>
    ),
    width: "30%",
  },
  {
    title: "Upload Date",
    dataIndex: "uploadDate",
    key: "uploadDate",
    width: "20%",
  },
  {
    title: "Uploaded By",
    dataIndex: "uploadedBy",
    key: "uploadedBy",
    render: (user: User) => (
      <div className="flex items-center">
        <Avatar src={user.avatar} />
        <span className="ml-2">{userName || "Anonymous"}</span>
      </div>
    ),
    width: "25%",
  },
  {
    title: "Action",
    dataIndex: "",
    key: "action",
    render: (_: any, record: DataSourceItem) => (
      <Dropdown overlay={<ActionMenu record={record} />}>
        <Button.Group size="small">
          <Button icon={<EllipsisOutlined />} />
        </Button.Group>
      </Dropdown>
    ),
    width: "15%",
  },
];

const FilesTable: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataSourceItem[]>(initialDataSource);

  const handleUploadChange = (info: any) => {
    if (info.file.status === "done") {
      const newFile: DataSourceItem = {
        key: String(dataSource.length + 1),
        file: info.file.name,
        uploadDate: new Date().toLocaleDateString(),
        uploadedBy: {
          name: userName,
          avatar: DrAlishaKane,
          userName: userName, // Fix missing userName field
        },
      };
      setDataSource((prevData) => [...prevData, newFile]);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div className="mx-10 mt-10 max-lg:mx-2">
      <div className="flex justify-between">
        <div>
          <div className="flex text-xl gap-5 font-bold">
            <ArrowLeftOutlined />
            <h1>Document Repository</h1>
          </div>
          <Breadcrumb
            className="text-xl" // Correct class name here
            items={[
              {
                title: "Wellness",
              },
              {
                title: <a href="">Document Repository</a>,
              },
            ]}
          />
        </div>
        <div>
          <Upload
            showUploadList={false}
            customRequest={({ file, onSuccess }: any) => {
              setTimeout(() => {
                if (onSuccess) onSuccess(null, file); // Pass `null` as response
                message.success("Upload completed successfully");
              }, 1000);
            }}
            onChange={handleUploadChange}
          >
            <Button
              style={{ background: "black", color: "white" }}
              icon={<UploadOutlined />}
            >
              Upload Documents
            </Button>
          </Upload>
        </div>
      </div>
      <div className="container mx-auto overflow-x-scroll">
        <Table
          columns={columns.map((col) => ({
            ...col,
            onHeaderCell: () => ({
              style: { backgroundColor: "black", color: "white" },
            }),
          }))}
          dataSource={dataSource}
          scroll={{ x: true }}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default FilesTable;
