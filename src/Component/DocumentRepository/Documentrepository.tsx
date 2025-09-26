import React, { useState, useEffect } from "react";
import { Table, Button, Avatar, Dropdown, Menu, Upload, message, Modal } from "antd";
import { BreadCrumb } from "../../components/BreadCrumbs";
import {
  EyeOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  EllipsisOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import DrAlishaKane from "../../public/images/Alisha.svg"; // Ensure the image path is correct

const API_BASE_URL = "http://localhost:5000/api"; // Update with your API URL

interface User {
  name: string;
  avatar: string;
  userName: string;
}

interface DocumentItem {
  _id: string;
  fileName: string;
  uploadDate: string;
  uploadedBy: string;
  uploadedByName: string;
  mimeType: string;
  fileSize: number;
}

interface DataSourceItem {
  key: string;
  file: string;
  uploadDate: string;
  uploadedBy: User;
  documentId: string;
  mimeType: string;
}

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user") || "{}");
const currentUser = {
  id: user?.id || "",
  name: user?.name || "Anonymous",
  email: user?.email || "",
  role: user?.role || "employee"
};

const getFileIcon = (fileName: string): JSX.Element | null => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return <FilePdfOutlined className="text-3xl font-bold text-red-500" />;
    case "doc":
    case "docx":
      return <FileWordOutlined className="text-3xl font-bold text-blue-500" />;
    default:
      return <FileWordOutlined className="text-3xl font-bold text-gray-500" />;
  }
};

const FilesTable: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataSourceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch user-specific documents
  const fetchDocuments = async () => {
    if (!currentUser.id) {
      message.error("User not logged in");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/documents/user/${currentUser.id}`);
      
      if (response.data.success) {
        const documents: DocumentItem[] = response.data.documents;
        
        // Transform documents to table format
        const tableData: DataSourceItem[] = documents.map((doc) => ({
          key: doc._id,
          file: doc.fileName,
          uploadDate: new Date(doc.uploadDate).toLocaleDateString(),
          uploadedBy: {
            name: doc.uploadedByName,
            avatar: DrAlishaKane,
            userName: doc.uploadedByName,
          },
          documentId: doc._id,
          mimeType: doc.mimeType,
        }));
        
        setDataSource(tableData);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      message.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  // Load documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle file upload
  const handleUpload = async (file: File) => {
    if (!currentUser.id) {
      message.error("User not logged in");
      return false;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadedBy", currentUser.id);
    formData.append("uploadedByName", currentUser.name);

    try {
      const response = await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        message.success("File uploaded successfully");
        // Refresh the documents list
        await fetchDocuments();
        return true;
      } else {
        message.error(response.data.message || "Upload failed");
        return false;
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      message.error(error.response?.data?.message || "Upload failed");
      return false;
    } finally {
      setUploading(false);
    }
  };

  // Handle file view
  const handleView = (record: DataSourceItem) => {
    const fileUrl = `${API_BASE_URL}/documents/file/${record.documentId}`;
    
    // For PDFs, try to open in a new window with proper size
    if (record.mimeType === 'application/pdf') {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${record.file}</title>
              <style>
                body { margin: 0; padding: 0; }
                iframe { width: 100vw; height: 100vh; border: none; }
              </style>
            </head>
            <body>
              <iframe src="${fileUrl}" type="application/pdf"></iframe>
            </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        // Fallback: direct link
        window.location.href = fileUrl;
      }
    } else {
      // For other file types, direct download or open
      window.open(fileUrl, '_blank');
    }
  };

  // Handle file download
  const handleDownload = (record: DataSourceItem) => {
    const downloadUrl = `${API_BASE_URL}/documents/download/${record.documentId}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = record.file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle file delete
  // const handleDelete = async (record: DataSourceItem) => {
  //   Modal.confirm({
  //     title: 'Are you sure you want to delete this document?',
  //     content: `This will permanently delete "${record.file}"`,
  //     okText: 'Delete',
  //     okType: 'danger',
  //     onOk: async () => {
  //       try {
  //         const response = await axios.delete(`${API_BASE_URL}/documents/${record.documentId}`);
  //         if (response.data.success) {
  //           message.success("Document deleted successfully");
  //           await fetchDocuments(); // Refresh the list
  //         }
  //       } catch (error: any) {
  //         console.error("Delete error:", error);
  //         message.error(error.response?.data?.message || "Delete failed");
  //       }
  //     }
  //   });
  // };

  const ActionMenu = ({ record }: { record: DataSourceItem }) => (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => handleView(record)}>
        View
      </Menu.Item>
      <Menu.Item key="download" icon={<DownloadOutlined />} onClick={() => handleDownload(record)}>
        Download
      </Menu.Item>
      {/* <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} danger>
        Delete
      </Menu.Item> */}
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
          <span className="ml-2">{user.name}</span>
        </div>
      ),
      width: "25%",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (_: any, record: DataSourceItem) => (
        <Dropdown overlay={<ActionMenu record={record} />} trigger={['click']}>
          <Button icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
      width: "15%",
    },
  ];

  return (
    <div className="mx-10 mt-10 max-lg:mx-2">
      <div className="flex justify-between">
        <div>
          <div className="flex text-xl gap-5 font-bold mb-4">
            <h1>Document Repository</h1>
          </div>
          <BreadCrumb
            className="text-xl mb-4"
            items={[
              {
                title: "Wellness",
                path: "/wellness",
              },
              {
                title: "Document Repository",
              },
            ]}
          />
        </div>
        <div>
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              handleUpload(file);
              return false; // Prevent automatic upload
            }}
            accept=".pdf,.doc,.docx"
          >
            <Button
              style={{ background: "black", color: "white" }}
              icon={<UploadOutlined />}
              loading={uploading}
            >
              {uploading ? "Uploading..." : "Upload Documents"}
            </Button>
          </Upload>
        </div>
      </div>

      <div className="container mx-auto overflow-x-scroll mt-6">
        <Table
          columns={columns.map((col) => ({
            ...col,
            onHeaderCell: () => ({
              style: { backgroundColor: "black", color: "white" },
            }),
          }))}
          dataSource={dataSource}
          scroll={{ x: true }}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} documents`,
          }}
        />
      </div>
    </div>
  );
};

export default FilesTable;