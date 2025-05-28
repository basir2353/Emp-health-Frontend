import React, { useState } from "react";
import {
  Upload,
  Button,
  message,
  Progress,
  Typography,
  Input,
  Modal,
  Tag,
} from "antd";
import { UploadOutlined, EyeOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";

const { Text } = Typography;

const UploadChallages: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [showIcons, setShowIcons] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState('');
  const [tags, setTags] = useState([]);

  const handleChange = (info: any) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      setFiles([...files, info.file.originFileObj]);
      setUploading(false);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
      setUploading(false);
    } else {
      setUploading(true);
      setUploadProgress(info.fileList.map(() => 0)); // Initialize progress for each file
    }
  };

  const handleCustomRequest = (options: any) => {
    // Simulate file upload
    let percent = 0;
    const interval = setInterval(() => {
      percent = percent + 1;
      setUploadProgress((prevProgress) => prevProgress.map(() => percent));
      if (percent >= 100) {
        clearInterval(interval);
        options.onSuccess("ok");
      }
    }, 100);
  };

  const handlePreview = (file: File) => {
    setPreviewImage(URL.createObjectURL(file));
    setPreviewVisible(true);
  };

  const handleDelete = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  return (
    <div className="flex flex-col ">
    


      <Upload
        customRequest={handleCustomRequest}
        onChange={handleChange}
        showUploadList={false}
        multiple
      >
        <Button icon={<UploadOutlined />}>
        Click to Upload
        </Button>
      </Upload>
      {uploading && (
        <div className="flex mt-6 flex-col w-[114px]  border-2 px-2 py-2 mr-4 mb-4 border-black relative hover:bg-gray-200">
          <Text>Uploading...</Text>
          {uploadProgress.map((percent, index) => (
            <Progress
              key={index}
              percent={percent}
              status="active"
              strokeColor='black'
              className="mb-2"
              showInfo={false}
            />
          ))}
        </div>
      )}
      <div className="flex flex-wrap mt-5">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex flex-col w-[114px] h-[114px] border-2 px-2 py-2 mr-4 mb-4 border-black relative hover:bg-gray-200"
            onMouseEnter={() => setShowIcons(true)}
            onMouseLeave={() => setShowIcons(false)}
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`Uploaded ${index}`}
              className="mb-2"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
              onClick={() => handlePreview(file)}
            />
            {showIcons && (
              <div className="absolute justify-center mt-10 ml-7 flex">
                <DeleteOutlined
                  className="text-white cursor-pointer text-xl"
                  onClick={() => handleDelete(index)}
                />
                <EyeOutlined
                  className="text-white cursor-pointer mr-2 text-xl"
                  onClick={() => handlePreview(file)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <Modal
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
      >
        {files.map((file, index) => (
          <img
            key={index}
            alt={`Uploaded ${index}`}
            style={{ width: "100%" }}
            src={URL.createObjectURL(file)}
          />
        ))}
      </Modal>
    </div>
  );
};

export default UploadChallages;
