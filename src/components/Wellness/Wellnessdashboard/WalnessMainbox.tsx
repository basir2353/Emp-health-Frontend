import React from "react";
import { Avatar, Badge, Button, Progress } from "antd";
import { CrownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

// Sample array of wellness items
const wellnessData = [
  {
    id: 1,
    title: "How yoga can improve your physical and mental health",
    description: "Lorem Ipsume........",
    progress: 50,
    users: [
      { name: "K", color: "#FF7A45" },
      { name: "Jane", color: "#FFD8BF" },
      { name: "K", color: "#FF7A45" },
      { name: "Jane", color: "#FFD8BF" },
      { name: "K", color: "#FF7A45" },
      { name: "Jane", color: "#FFD8BF" },
    ],
    points: 453,
    badge: "1st Position badge",
    image: "/wellness.jpeg",
    userAvatar: "/main.jpeg",
    userName: "Jane Doe", // Including Jane Doe in the data
  },
  {
    id: 2,
    title: "How yoga can improve your physical and mental health",
    description: "Lorem Ipsume........",
    progress: 50,
    users: [
      { name: "K", color: "#FF7A45" },
      { name: "Jane", color: "#FFD8BF" },
      { name: "K", color: "#FF7A45" },
      { name: "Jane", color: "#FFD8BF" },
      { name: "K", color: "#FF7A45" },
      { name: "Jane", color: "#FFD8BF" },
    ],
    points: 453,
    badge: "1st Position badge",
    image: "/wellness.jpeg",
    userAvatar: "/main.jpeg",
    userName: "Jane Doe", // Including Jane Doe in the data
  },
  {
    id: 3,
    title: "How yoga can improve your physical and mental health",
    description: "Lorem Ipsume........",
    progress: 50,
    users: [
      { name: "K", color: "#FF7A45" },
      { name: "Jane", color: "#FFD8BF" },
      { name: "K", color: "#FF7A45" },
      { name: "Jane", color: "#FFD8BF" },
      { name: "K", color: "#FF7A45" },
      { name: "Jane", color: "#FFD8BF" },
    ],
    points: 453,
    badge: "1st Position badge",
    image: "/wellness.jpeg",
    userAvatar: "/main.jpeg",
    userName: "Jane Doe", // Including Jane Doe in the data
  },
  {
    id: 4,
    title: "How yoga can improve your physical and mental health",
    description: "Lorem Ipsume........",
    progress: 50,
    users: [
      { name: "K", color: "#FF7A45" },
      { name: "Jane", color: "#FFD8BF" },
      { name: "K", color: "#FF7A45" },
      { name: "Jane", color: "#FFD8BF" },
      { name: "K", color: "#FF7A45" },
      { name: "Jane", color: "#FFD8BF" },
    ],
    points: 453,
    badge: "1st Position badge",
    image: "/wellness.jpeg",
    userAvatar: "/main.jpeg",
    userName: "Jane Doe", // Including Jane Doe in the data
  },
];

const WalnessMainbox: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-4 max-lg:grid-cols-1 gap-4">
      {wellnessData.map((item) => (
        <div
          key={item.id}
          onClick={() => navigate("/wellness/course/view")}
          className="cursor-pointer relative box-border flex flex-col items-start p-2 gap-1 mt-10 w-[310px] h-[385px] max-lg:w-auto bg-white border border-gray-300 rounded-lg"
        >
          <div className="flex-none order-0 flex-grow-0">
            <div className="h-[182px] bg-gray-200 rounded-md relative">
              <img src={item.image} alt="wellness" />
            </div>
          </div>
          <div className="flex-none order-1 flex-grow-0">
            <div className="flex flex-col items-start gap-3">
              <h4 className="font-medium text-lg text-black">{item.title}</h4>
              <p className="font-normal text-base text-black">
                {item.description}
              </p>
            </div>
          </div>

          <div className="flex-none order-3 flex-grow-0">
            <div className="w-[177px] my-3">
              <Progress
                className=""
                showInfo={false}
                strokeColor="black"
                percent={item.progress}
              />
            </div>
            <div className="flex items-center justify-between gap-28 ">
              <div className="flex items-center">
                <div className="flex items-center">
                  <Avatar.Group maxCount={2}>
                    {item.users.map((user, index) => (
                      <Avatar
                        key={index}
                        className="mr-2"
                        style={{ background: user.color }}
                      >
                        {user.name}
                      </Avatar>
                    ))}
                  </Avatar.Group>
                </div>
              </div>
              <Button type="primary" style={{ background: "black" }}>
                Resume
              </Button>
            </div>
          </div>
          <div className="absolute bottom-52 max-lg:bottom-[128px] max-lg:left-72 left-48 bg-blue-300 border border-white rounded-full p-2 flex space-x-2">
  <span className="text-sm leading-3">{item.userName}</span>
  <Avatar className="w-[24px] h-[24px] rounded-full" src={item.userAvatar} alt="wellness" />
</div>

          <div className="absolute top-3 left-16 bg-gray-800 border border-white rounded-full p-2">
            <span className="font-normal text-xs leading-20 text-white">
              {item.points} Points
            </span>
          </div>
          <div className="absolute top-3 left-[150px] bg-blue-100 border border-white rounded-full p-2 flex items-center gap-2">
            <span className="font-normal text-xs leading-20 text-black">
              {item.badge}
            </span>
            <img src="/reward.png" alt="reward" className="w-[24px] h-[24px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default WalnessMainbox;
