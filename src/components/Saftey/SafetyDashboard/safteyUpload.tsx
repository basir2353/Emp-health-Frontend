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
import {
  UploadOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

interface Props {
  involvedParties: string[];
  setInvolvedParties: (names: string[]) => void;
}

const { Text } = Typography;

const TagInput: React.FC<{
  label?: string;
  placeholder?: string;
  value?: string[];
  onChange?: (tags: string[]) => void;
  maxTags?: number;
}> = ({ label, placeholder = "Add item and press Enter", value = [], onChange, maxTags }) => {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState<string[]>(value);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();

      if (!tags.includes(newTag) && (!maxTags || tags.length < maxTags)) {
        const newTags = [...tags, newTag];
        setTags(newTags);
        onChange?.(newTags);
        setInputValue('');
      }
    }
  };

  const handleRemove = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    onChange?.(newTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}

        <div className="border border-gray-300 rounded-md p-3 min-h-12 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <div className="flex flex-wrap gap-2 items-center">
            {tags.map((tag) => (
              <Tag
                key={tag}
                closable
                onClose={() => handleRemove(tag)}
                style={{
                  backgroundColor: '#f5f5f5',
                  borderColor: '#d9d9d9',
                  color: '#595959',
                  borderRadius: '16px',
                  margin: '2px'
                }}
              >
                {tag}
              </Tag>
            ))}

            <Input
              placeholder={tags.length === 0 ? placeholder : ""}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              bordered={false}
              className="flex-1 min-w-32"
              style={{
                boxShadow: 'none',
                padding: 0,
                minWidth: '120px'
              }}
            />
          </div>
        </div>

        {maxTags && (
          <div className="text-xs text-gray-500 mt-1">
            {tags.length}/{maxTags} items added
          </div>
        )}
      </div>
    </div>
  );
};

const SafetyUpload: React.FC<Props> = ({ involvedParties, setInvolvedParties }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [showIconsIndex, setShowIconsIndex] = useState<number | null>(null);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");

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
      setUploadProgress(info.fileList.map(() => 0));
    }
  };

  const handleCustomRequest = (options: any) => {
    let percent = 0;
    const interval = setInterval(() => {
      percent += 1;
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
    <div className="flex flex-col gap-4">
      <TagInput
        label="Involved Parties"
        value={involvedParties}
        onChange={setInvolvedParties}
        maxTags={10}
      />

      <Upload
        customRequest={handleCustomRequest}
        onChange={handleChange}
        showUploadList={false}
        multiple
      >
        <Button icon={<UploadOutlined />}>
          Upload any relevant docs or Images
        </Button>
      </Upload>

      {uploading && (
        <div className="flex mt-6 flex-col w-[114px] border-2 px-2 py-2 mr-4 mb-4 border-black relative hover:bg-gray-200">
          <Text>Uploading...</Text>
          {uploadProgress.map((percent, index) => (
            <Progress
              key={index}
              percent={percent}
              status="active"
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
            onMouseEnter={() => setShowIconsIndex(index)}
            onMouseLeave={() => setShowIconsIndex(null)}
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`Uploaded ${index}`}
              className="mb-2"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
              onClick={() => handlePreview(file)}
            />
            {showIconsIndex === index && (
              <div className="absolute justify-center mt-10 ml-7 flex gap-2">
                <DeleteOutlined
                  className="text-white cursor-pointer text-xl"
                  onClick={() => handleDelete(index)}
                />
                <EyeOutlined
                  className="text-white cursor-pointer text-xl"
                  onClick={() => handlePreview(file)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default SafetyUpload;
