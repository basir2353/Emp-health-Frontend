import React, { useState, useEffect } from "react";
import { Input, Button, Card, Avatar, message, Image } from "antd";
import { BreadCrumb } from "../../components/BreadCrumbs";
import { ArrowLeftOutlined, HeartOutlined } from "@ant-design/icons";
import ProfileImage from "../../public/images/profile.svg";
import PostSidebar from "./SideBar";
import { useDispatch } from "react-redux";
import { addPost } from "../../redux/appointments/appointmentSlice";
import axios from "axios";

interface Post {
  _id?: string;
  username: string;
  content: string;
  likes: number;
  avatarUrl: string;
  hashtags?: string[];
}

interface BlockedPost {
  _id?: string;
  author: string;
  content: string;
  avatarUrl?: string;
  hashtags?: string[];
}

const { TextArea } = Input;

const HealthForum: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlockedPost | null>(null);
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [blockedPosts, setBlockedPosts] = useState<BlockedPost[]>([]);
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const isAdmin = user.role === "admin";

  const baseURL = "http://localhost:5000/api";

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${baseURL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedPosts = res.data.posts;
      const blockedPostIds = blockedPosts.map((post) => post._id);
      const filteredPosts = fetchedPosts.filter(
        (post: Post) => !blockedPostIds.includes(post._id)
      );
      setPosts(filteredPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      message.error("Failed to load posts");
    }
  };

  // Load blocked posts from localStorage
  const loadBlockedPosts = () => {
    if (!isAdmin) return;
    const storedBlockedPosts = localStorage.getItem("blockedPosts");
    if (storedBlockedPosts) {
      setBlockedPosts(JSON.parse(storedBlockedPosts));
    }
  };

  // Save blocked posts to localStorage
  const saveBlockedPosts = (updatedBlockedPosts: BlockedPost[]) => {
    localStorage.setItem("blockedPosts", JSON.stringify(updatedBlockedPosts));
    setBlockedPosts(updatedBlockedPosts);
  };

  // Create new post
  const handlePostSubmit = async () => {
    if (!postContent.trim()) return;

    try {
      const res = await axios.post(
        `${baseURL}/posts/create`,
        { content: postContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(addPost(res.data.post));
      setPosts((prev) => [res.data.post, ...prev]);
      message.success("Post created successfully");
      setPostContent("");
    } catch (err) {
      console.error("Error creating post:", err);
      message.error("Failed to create post");
    }
  };

  // Block a post
  const handleBlockPost = (postId: string) => {
    if (!isAdmin) return;

    const postToBlock = posts.find((post) => post._id === postId);
    if (postToBlock) {
      setPosts((prev) => prev.filter((post) => post._id !== postId));
      const newBlockedPost: BlockedPost = {
        _id: postToBlock._id,
        author: postToBlock.username,
        content: postToBlock.content,
        avatarUrl: postToBlock.avatarUrl,
        hashtags: postToBlock.hashtags,
      };
      const updatedBlockedPosts = [...blockedPosts, newBlockedPost];
      saveBlockedPosts(updatedBlockedPosts);
      message.success("Post blocked successfully");
    }
  };

  // Unblock a post
  const handleUnblockPost = (postId: string) => {
    const postToUnblock = blockedPosts.find((post) => post._id === postId);
    if (postToUnblock) {
      const updatedBlockedPosts = blockedPosts.filter((post) => post._id !== postId);
      saveBlockedPosts(updatedBlockedPosts);
      const restoredPost: Post = {
        _id: postToUnblock._id,
        username: postToUnblock.author,
        content: postToUnblock.content,
        avatarUrl: postToUnblock.avatarUrl || ProfileImage,
        likes: 0,
        hashtags: postToUnblock.hashtags,
      };
      setPosts((prev) => [restoredPost, ...prev]);
      message.success("Post unblocked successfully");
    }
  };

  // Like a post
  const handleLikePost = async (postId: string) => {
    try {
      await axios.post(
        `${baseURL}/posts/like/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
      message.success("Post liked!");
    } catch (err) {
      console.error("Error liking post:", err);
      message.error("Failed to like post");
    }
  };

  const openSidebar = (post: BlockedPost) => {
    setSelectedPost(post);
    setSidebarVisible(true);
  };

  const closeSidebar = () => {
    setSelectedPost(null); // Reset selectedPost
    setSidebarVisible(false);
  };

  const renderPosts = () => {
    return posts.map((post, index) => (
      <Card key={post._id || index} className="mb-4 rounded-lg bg-gray-50 p-2">
        <div className="flex items-center gap-5">
          <Image
            src={post.avatarUrl || ProfileImage}
            alt="Profile"
            className="w-12 h-12 object-cover rounded-full"
          />
          <div>
            <div className="font-semibold">{post.username}</div>
            <div>{post.content}</div>
            {post.hashtags?.map((tag, idx) => (
              <span className="text-blue-800" key={idx}>
                {tag}{" "}
              </span>
            ))}
            <div className="flex mt-2 text-pink-700 items-center">
              <HeartOutlined
                className="mr-2 cursor-pointer"
                onClick={() => post._id && handleLikePost(post._id)}
              />
              <span>{post.likes}</span>
            </div>
            {isAdmin && (
              <Button
                type="default"
                className="mt-2"
                style={{ color: "red", borderColor: "red" }}
                onClick={() => post._id && handleBlockPost(post._id)}
              >
                Block Post
              </Button>
            )}
          </div>
        </div>
      </Card>
    ));
  };

  useEffect(() => {
    fetchPosts();
    loadBlockedPosts();
  }, []);

  return (
    <div className="mt-4 h-5 justify-start items-center pl-3 max-lg:pl-0 bg-white ml-10 max-lg:ml-2">
      <div className="flex text-xl gap-5 font-bold mb-4">
        <h1>Health Forum!</h1>
      </div>
      <BreadCrumb
        className="font-xl mb-4"
        items={[
          { title: "Wellness", path: "/wellness" },
          { title: "Health Forum" },
        ]}
      />
      <div className="mx-auto p-5 max-lg:p-1">
        <div className="grid grid-cols-4 max-lg:grid-cols-1 gap-4">
          {/* Trending Hashtags */}
          <div className="bg-white p-4 rounded-lg shadow h-[400px] w-auto">
            <div className="font-semibold text-lg mb-4">Trending Hashtags</div>
            {["#safety", "#mask", "#mentalhealth", "#worklifebalance"].map(
              (tag, i) => (
                <div key={i} className="text-blue-700 cursor-pointer mb-1">
                  {tag}
                </div>
              )
            )}
          </div>

          {/* Posts */}
          <div className="col-span-2 bg-white p-4 rounded-lg shadow space-y-4">
            <div style={{ position: "relative" }}>
              <Avatar
                size={32}
                src="https://joeschmoe.io/api/v1/random"
                style={{ position: "absolute", top: 8, left: 6, zIndex: 50 }}
              />
              <TextArea
                rows={4}
                placeholder="Wanna share your thoughts..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                style={{ paddingLeft: 40 }}
              />
              <div className="flex justify-end bg-blue-200 py-2 px-1 border-b-2 rounded-b-lg">
                <Button
                  type="primary"
                  style={{ background: "black" }}
                  onClick={handlePostSubmit}
                >
                  Post
                </Button>
              </div>
            </div>
            {renderPosts()}
          </div>

          {/* Blocked Posts (Admin Only) */}
          {isAdmin && (
            <div className="bg-white rounded-lg shadow h-[280px] overflow-auto">
              <div className="text-xl font-bold mb-2 px-4 pt-4">
                Blocked Posts <span className="font-normal text-sm">(Admin only)</span>
              </div>
              {blockedPosts.map((post) => (
                <Card key={post._id} className="mb-4 p-4">
                  <div className="flex flex-col">
                    <div className="flex items-start">
                      <Avatar
                        src={post.avatarUrl || ProfileImage}
                        className="mr-4 w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-lg">{post.author}</div>
                        <div className="text-gray-700">{post.content}</div>
                        <div className="text-blue-600">
                          {post.hashtags?.map((tag, idx) => (
                            <span key={idx}>{tag} </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="default"
                      className="mt-4"
                      style={{ width: "107px", marginLeft: "50px" }}
                      onClick={() => openSidebar(post)}
                    >
                      View Post
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <PostSidebar
          visible={sidebarVisible}
          onClose={closeSidebar}
          post={selectedPost}
          isAdmin={isAdmin}
          onUnblock={handleUnblockPost}
        />
      </div>
    </div>
  );
};

export default HealthForum;