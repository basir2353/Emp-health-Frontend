import React from "react";
import { Drawer, Button, Avatar } from "antd";
import { BlockedPost } from "./Healthforum";
import { CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";

interface PostSidebarProps {
  visible: boolean;
  onClose: () => void;
  post: BlockedPost; // Assuming BlockedPost interface is accessible
}

const PostSidebar: React.FC<PostSidebarProps> = ({ visible, onClose, post }) => {
    if (!post) {
      return null; // Render nothing if post is null
    }
  return (
    <Drawer
    placement="right"
    closable={false}
    onClose={onClose}
    visible={visible}
    width={400}
    headerStyle={{ background: "#f0f2f5", padding: "12px 16px", borderBottom: "1px solid #d9d9d9" }} // Customize header style
    bodyStyle={{ padding: "16px" }} // Customize body style
  >
    <div className="flex justify-between items-center mb-4">
        
      <div className="flex justify-center items-center align-middle text-center">
      <Button type="text" icon={<CloseCircleOutlined  />} onClick={onClose} /> {/* Close button */}

        <h2 className="text-lg font-semibold">Blocked Post</h2>
      </div>
      <div className="flex gap-4">
      <Button onClick={onClose}>Cancel</Button>
      <Button type="primary" style={{background:'black',}}>Approve</Button>

      </div>
    </div>
      <div className="p-4">
        <div className="flex gap-2">
      <Avatar src={post.avatarUrl} className="w-10" />

        <h2 className="text-xl font-semibold">{post.author}'s Post</h2>
        </div>
        <p>{post.content}</p>
        <div className="mt-4">
        {post.hashtags && post.hashtags.map((tag: string, index: number) => (

            <span key={index} className="inline-block bg-gray-200 px-2 py-1 mr-1 mb-1 rounded-lg">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 border-t border-gray-300 pt-4 ">
          <h3 className="text-xl font-bold mb-4">Reason </h3>
          <div className="flex gap-3">
          <p className="text-red-500 bg-red-200 font-semibold border w-auto px-2 border-red-500">Harmful Content</p>
          <h3 className="text-yellow-700  bg-yellow-200 font-semibold border w-auto px-2 border-yellow-500"> Unethical</h3>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default PostSidebar;
