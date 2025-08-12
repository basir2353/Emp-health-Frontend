import React, { useState, useEffect } from "react";
import { Input, Button, Card, Avatar, Breadcrumb, message, Image } from "antd";
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

export interface BlockedPost {
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

  const baseURL = "http://localhost:5000/api";

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      message.error("Failed to load posts");
    }
  };

  // Fetch blocked posts (admin only)
  const fetchBlockedPosts = async () => {
    if (user.role !== "admin") return;
    try {
      const res = await axios.get(`${baseURL}/posts/blocked`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlockedPosts(res.data.posts);
    } catch (err) {
      console.error("Error fetching blocked posts:", err);
      message.error("Failed to load blocked posts");
    }
  };

  // Create new post
  const handlePostSubmit = async () => {
    if (!postContent.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/create`,
        { content: postContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(addPost(res.data.post)); // optional, if you want Redux to have it
      setPosts((prev) => [res.data.post, ...prev]); // update local list instantly
      message.success("Post created successfully");
      setPostContent("");
    } catch (err) {
      console.error("Error creating post:", err);
      message.error("Failed to create post");
    }
  };

  const openSidebar = (post: BlockedPost) => {
    setSelectedPost(post);
    setSidebarVisible(true);
  };

  const closeSidebar = () => setSidebarVisible(false);

  const renderPosts = () => {
    return posts.map((post, index) => (
      <Card key={post._id || index} className="mb-4 rounded-lg bg-gray-50 p-2">
        <div className="flex items-center gap-5">
          <Image
            src={post.avatarUrl || ProfileImage}
            alt="Profile"
            className="w-96 h-96 object-cover"
          />
          <div>
            <div className="font-semibold">{post.username}</div>
            <div>{post.content}</div>
            {post.hashtags?.map((tag, idx) => (
              <span className="text-blue-800" key={idx}>
                {tag}{" "}
              </span>
            ))}
            <div className="flex mt-2 text-pink-700">
              <HeartOutlined className="mr-2" />
              <span>{post.likes}</span>
            </div>
          </div>
        </div>
      </Card>
    ));
  };

  useEffect(() => {
    fetchPosts();
    fetchBlockedPosts();
  }, []);

  return (
    <div className="mt-4 h-5 justify-start items-center pl-3 max-lg:pl-0 bg-white ml-10 max-lg:ml-2">
      <div className="flex text-xl gap-5 font-bold">
        <ArrowLeftOutlined />
        <h1>Health Forum!</h1>
      </div>
      <Breadcrumb
        className="font-xl"
        items={[
          { title: "Wellness" },
          { title: <a href="">Health Forum</a> },
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

          {/* Blocked posts */}
          <div className="bg-white rounded-lg shadow h-[280px] overflow-auto">
            {blockedPosts.map((post) => (
              <Card key={post._id} className="mb-4 p-4">
                <div className="flex flex-col">
                  <div className="text-xl font-bold mb-2">
                    Blocked Posts{" "}
                    <span className="font-normal text-sm">(Admin only)</span>
                  </div>
                  <div className="flex items-start">
                    <Avatar src={post.avatarUrl} className="mr-4 w-40" />
                    <div>
                      <div className="font-semibold text-lg">
                        {post.author}
                      </div>
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
        </div>
        <PostSidebar
          visible={sidebarVisible}
          onClose={closeSidebar}
          post={selectedPost!}
        />
      </div>
    </div>
  );
};

export default HealthForum;
