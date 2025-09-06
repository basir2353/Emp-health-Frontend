import { Drawer, Button, Avatar, message } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import ProfileImage from "../../public/images/profile.svg";

interface PostSidebarProps {
  visible: boolean;
  onClose: () => void;
  post: {
    _id?: string;
    author: string;
    content: string;
    avatarUrl?: string;
    hashtags?: string[];
  } | null;
  isAdmin: boolean;
  onUnblock: (postId: string) => void;
}

const PostSidebar: React.FC<PostSidebarProps> = ({ visible, onClose, post, isAdmin, onUnblock }) => {
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
      headerStyle={{ background: "#f0f2f5", padding: "12px 16px", borderBottom: "1px solid #d9d9d9" }}
      bodyStyle={{ padding: "16px" }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Button type="text" icon={<CloseCircleOutlined />} onClick={onClose} />
          <h2 className="text-lg font-semibold ml-2">Blocked Post</h2>
        </div>
        <div className="flex gap-4">
          <Button onClick={onClose}>Cancel</Button>
          {isAdmin && (
            <Button
              type="primary"
              style={{ background: "green", borderColor: "green" }}
              onClick={() => {
                if (post._id) {
                  onUnblock(post._id);
                  onClose();
                } else {
                  message.error("Cannot unblock post: Invalid ID");
                }
              }}
            >
              Unblock Post
            </Button>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-2 items-center">
          <Avatar src={post.avatarUrl || ProfileImage} className="w-10 h-10 rounded-full" />
          <h2 className="text-xl font-semibold">{post.author}'s Post</h2>
        </div>
        <p className="mt-2">{post.content}</p>
        <div className="mt-4">
          {post.hashtags?.map((tag, idx) => (
            <span key={idx} className="inline-block bg-gray-200 px-2 py-1 mr-1 mb-1 rounded-lg">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 border-t border-gray-300 pt-4">
          <h3 className="text-xl font-bold mb-4">Reason</h3>
          <div className="flex gap-3">
            <p className="text-red-500 bg-red-200 font-semibold border w-auto px-2 border-red-500">
              Harmful Content
            </p>
            <p className="text-yellow-700 bg-yellow-200 font-semibold border w-auto px-2 border-yellow-500">
              Unethical
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default PostSidebar;