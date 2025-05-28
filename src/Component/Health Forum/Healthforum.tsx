import React, { useState } from "react";
import { Input, Button, Card, Avatar, Breadcrumb, message } from "antd";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { Image } from 'antd';
import ProfileImage from '../../public/images/profile.svg';
import PostSidebar from "./SideBar";
import DrAlishaKane from "../../public/images/Alisha.svg";
import DrMaria from "../../public/images/Maria.svg";
import DrAkhtar from "../../public/images/Akhtar.svg";
import DrAndrew from "../../public/images/Andrew.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store"; // update path as needed
import { addPost } from "../../redux/appointments/appointmentSlice";

interface Post {
  username: string;
  content: string;
  likes: number;
  avatarUrl: string;
  hashtags?: string[];
}
export interface BlockedPost {
  id: number;
  author: string;
  content: string;
  avatarUrl?: string;
  hashtags?: string[];
}

const { TextArea } = Input;
const user = JSON.parse(localStorage.getItem("user") || "{}");
const trendingHashtags = [
  "#safety",
  "#mask",
  "#mentalhealth",
  "#worklifebalance",
];

const postsData: Post[] = [
  {
    username: "Devon Lane",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. #safety",
    likes: 5.2,
    avatarUrl: DrAlishaKane,
    hashtags: ["#mask", "#safety"],
  },
  {
    username: "Jane Doe",
    content:
      "Exploring new ways to support mental health initiatives can make a big difference. #mentalhealth",
    likes: 3.8,
    avatarUrl: DrMaria,
    hashtags: ["#mask", "#safety"],
  },
  {
    username: "Alex Jamison",
    content:
      "Work-life balance is crucial for long-term productivity and happiness. #worklifebalance",
    likes: 4.3,
    avatarUrl: DrAkhtar,
    hashtags: ["#mask", "#safety"],
  },
  {
    username: "Sammy Brooks",
    content: "Remember to wear your mask in crowded places! #mask",
    likes: 2.1,
    avatarUrl: DrAlishaKane,
    hashtags: ["#mask", "#safety"],
  },
];
const blockedPostsData: BlockedPost[] = [
  {
    id: 101,
    author: "Devon Lane",
    content:
      "Corem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    avatarUrl: DrMaria,
    hashtags: ["#mask", "#safety"],
  },
];

const HealthForum: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(postsData);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlockedPost | null>(null);
  const [postContent, setPostContent] = useState("");

  const openSidebar = (post: BlockedPost) => {
    setSelectedPost(post);
    setSidebarVisible(true);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  const renderTrendingHashtags = () => {
    return trendingHashtags.map((hashtag, index) => (
      <div key={index} className="text-blue-700  cursor-pointer mb-1">
        {hashtag}
      </div>
    ));
  };
  type OnboardingStep = {
  step: number;
  height?: string | number;
  unit?: string;
  avatar?: string;
  blood_group?: string;
};
  const onboardingData: OnboardingStep[] = JSON.parse(localStorage.getItem('onboardingSteps') || '[]');
  const avatar = onboardingData.find((item: OnboardingStep) => item.step === 8)?.avatar;

const handlePostSubmit = () => {
  if (!postContent.trim()) return;

  const username = user.name || "Anonymous";

  const newPost: Post = {
    username,
    content: postContent,
    likes: 0,
    avatarUrl: "https://joeschmoe.io/api/v1/random",
    hashtags: postContent.match(/#[a-zA-Z0-9_]+/g) || [],
  };

  dispatch(addPost(newPost));
  message.success("Post is created");
  setPostContent("");
};



  const dispatch = useDispatch();
const reduxPosts = useSelector((state: RootState) => state.appointments.posts);

const renderPosts = () => {
  return reduxPosts.map((post, index) => (
    <Card key={index} className="mb-4 rounded-lg bg-gray-50 p-2">
      <div className="flex items-center gap-5">
         <Image
                src={avatar ? avatar : ProfileImage}  // Fallback to default ProfileImage if avatar is not found
                alt="Profile"
                className="w-96 h-96 object-cover"
              />
        <div>
          <div className="font-semibold">{post.username}</div>
          <div>{post.content}</div>
          {post.hashtags?.map((tag, index) => (
            <span className="text-blue-800" key={index}>
              {tag}{" "}
            </span>
          ))}
          <div className="flex mt-2 text-pink-700">
            <HeartOutlined className="mr-2" />
            <span>{post.likes}k</span>
          </div>
        </div>
      </div>
    </Card>
  ));
};


  return (
    <div className="mt-4 h-5 justify-start items-center pl-3 max-lg:pl-0 bg-white ml-10 max-lg:ml-2">
      <div className="flex text-xl gap-5 font-bold">
        <ArrowLeftOutlined />
        <h1>Health Forum</h1>
      </div>
      <Breadcrumb
        className="font-xl"
        items={[
          {
            title: "Wellness",
          },

          {
            title: <a href="">Health Forum</a>,
          },
        ]}
      />
      <div className="   mx-auto p-5 max-lg:p-1">
        <div className="grid grid-cols-4 max-lg:grid-cols-1 gap-4">
          <div className="bg-white p-4 rounded-lg shadow h-[400px] w-auto">
            <div className="font-semibold text-lg mb-4">Trending Hashtags</div>
            {renderTrendingHashtags()}
          </div>
          <div className="col-span-2  bg-white p-4 rounded-lg shadow space-y-4">
            <div className="" style={{ position: "relative" }}>
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
  <Button type="primary" style={{ background: "black" }} onClick={handlePostSubmit}>
    Post
  </Button>
</div>

            </div>

            {renderPosts()}
          </div>

          <div className="bg-white  rounded-lg shadow h-[280px]">
            {blockedPostsData.map((post) => (
              <Card key={post.id} className="mb-4 p-4">
                <div>
                  <div className="flex flex-col">
                    <div className="text-xl font-bold mb-2 ">
                      Blocked Posts{" "}
                      <span className="font-normal text-sm">
                        (Only for admin)
                      </span>
                    </div>
                    <div className="flex items-start">
                      <Avatar src={post.avatarUrl} className="mr-4 w-40" />
                      <div className="flex flex-col">
                        <div className="font-semibold text-lg">
                          {post.author}
                        </div>
                        <div>
                          <div className="text-gray-700">{post.content}</div>
                          <div className="text-blue-600">
                            {post.hashtags?.map((tag, index) => (
                              <span key={index}>{tag} </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      type="default"
                      className="mt-4"
                      style={{
                        width: "107px",
                        marginLeft: "50px",
                      }}
                      onClick={() => openSidebar(post)}
                    >
                      View Post
                    </Button>
                  </div>
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
