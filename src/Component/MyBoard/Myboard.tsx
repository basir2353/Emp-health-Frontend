import React, { useState } from "react";
import { Row, Col, Button, Progress } from "antd";
import UserDetailsSidebar from "./UserDetailsSidebar";
import { ArrowLeftOutlined } from "@ant-design/icons";
import BoardTable from "./Tabelboard";
import axios from "axios";
import { useEffect } from "react";

const MyBoard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleRedeemClick = () => {
    setIsSidebarOpen(true);
  };
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPoints = () => {
    setLoading(true);
    axios
      .get("/api/challenges")
      .then((res) => {
        setPoints(res.data || 0);
        // Calculate total points for a dynamic user (replace with actual user id)
        const userId = "user_1748116060977_0.6404877050391012";
        const challenges = res.data.challenges || [];
        const userPoints = challenges.reduce((sum: number, challenge: any) => {
          if (challenge.participants.includes(userId)) {
            return sum + (challenge.rewardPoints || 0);
          }
          return sum;
        }, 0);
        setPoints(userPoints);
        console.log("User points:", userPoints);
            })
            .catch((error) => {
        console.error("Error fetching points:", error);
        setPoints(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPoints();
  }, []);
  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };
//point
  return (
    <div className="my-board p-4 justify-center align-middle">
    <div className="mx-10 mt-10">
      <div className="flex justify-between m-3">
        <div>
          <div className="flex text-xl gap-5 font-bold">
            <ArrowLeftOutlined />
            <h1>My Board</h1>
          </div>
          <div className="ml-7">All your points and redemptions are here.</div>
        </div>
      </div>
    </div>
    <div className="sm:flex justify-center">
      <div className="sm:w-full ml-10  md:w-[296px] lg:mr-5 max-lg:ml-0 max-lg:mr-0">
        <div className="w-full  bg-white border">
          <div className="flex justify-between p-2">
            <div>
              <div className="text-base">Total Points</div>
              <div className="text-5xl font-semibold">{points}</div>
            </div>
            <div className="p-2">
              <img src="/logo.png" alt="Logo" className="w-12 h-12" />
            </div>
          </div>
          <div className="text-right mr-4 text-base">500</div>
          <div className="w-full px-2">
            <Progress percent={50.5} showInfo={false} strokeColor="#a0d321" />
          </div>
          <div className="p-2">
            <Button className="w-full" style={{ background: 'black', color: 'white' }} onClick={handleRedeemClick}>Redeem</Button>
          </div>
        </div>
      </div>
      <div className="sm:w-full md:flex-1 overflow-x-auto">
  <div className="h-[195px] bg-gray-200 gap-10 space-y-6 justify-between rounded-r border border-gray-400" style={{ background: 'linear-gradient(90deg, #222831 0%, #3B4656 49%, #222831 100%)' }}>
    <div className="text-left text-white p-2 text-base">
      Badges
    </div>
    <div className="flex p-2">
      <div className="relative">
        <div className="flex flex-col items-start p-2 gap-2 -mt-10 w-32 h-9 bg-opacity-75 bg-black rounded-md ml-20 absolute">
          <div className="w-full text-white">Eager Learner</div>
        </div>
        <img src="/badge1.png" alt="Badge 1" className="h-[104px] w-[104px]" />
      </div>
      <img src="/badge2.png" alt="Badge 2" className="h-[104px] w-[104px]" />
      <img src="/badge3.png" alt="Badge 3" className="h-[104px] w-[104px]" />
      <img src="/badge4.png" alt="Badge 4" className="h-[104px] w-[104px]" />
    </div>
</div>
</div>
</div>
    <BoardTable />
    <UserDetailsSidebar
      user={{ name: "John Doe", avatar: "/user-avatar.png" }}
      visible={isSidebarOpen}
      onClose={handleSidebarClose}
    />
  </div>
  
  );
};

export default MyBoard;
