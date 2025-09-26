import React, { useState, useEffect } from "react";
import { Row, Col, Button, Progress } from "antd";
import UserDetailsSidebar from "./UserDetailsSidebar";
import { ArrowLeftOutlined } from "@ant-design/icons";
import BoardTable from "./Tabelboard";
import axios from "axios";

const MyBoard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [points, setPoints] = useState<number>(0);
  const [userName, setUserName] = useState<string>("John Doe");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Replace with dynamic user ID (e.g., from auth context or local storage)
  const userId = "user_1753971294565_0.9248960102505993"; // Updated to match API response participant

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch challenges to calculate points
      const challengesResponse = await axios.get(
        "http://localhost:5000/api/challenges"
      );
      const challenges = challengesResponse.data.challenges || [];
      const userPoints = challenges.reduce((sum: number, challenge: any) => {
        if (challenge.participants.includes(userId)) {
          return sum + (challenge.rewardPoints || 0);
        }
        return sum;
      }, 0);
      setPoints(userPoints);

      // Attempt to fetch user details (optional, based on API availability)
      try {
        const userResponse = await axios.get(
          `http://localhost:5000/api/users/${userId}`
        );
        setUserName(userResponse.data.name || "Unknown User");
      } catch (userError) {
        console.error("Error fetching user details:", userError);
        setUserName("Unknown User"); // Fallback if user endpoint fails
      }
    } catch (error) {
      console.error("Error fetching challenges:", error);
      setError("Failed to fetch challenges. Please try again.");
      setPoints(0);
      setUserName("Unknown User");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleRedeemClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

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
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="sm:flex justify-center">
        <div className="sm:w-full ml-10 md:w-[296px] lg:mr-5 max-lg:ml-0 max-lg:mr-0">
          <div className="w-full bg-white border">
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
              <Progress
                percent={(points / 500) * 100}
                showInfo={false}
                strokeColor="#a0d321"
              />
            </div>
            <div className="p-2">
              <Button
                className="w-full"
                style={{ background: "black", color: "white" }}
                onClick={handleRedeemClick}
                disabled={loading}
              >
                Redeem
              </Button>
            </div>
          </div>
        </div>
        <div className="sm:w-full md:flex-1 overflow-x-auto">
          <div
            className="h-[195px] bg-gray-200 gap-10 space-y-6 justify-between rounded-r border border-gray-400"
            style={{
              background:
                "linear-gradient(90deg, #222831 0%, #3B4656 49%, #222831 100%)",
            }}
          >
            <div className="text-left text-white p-2 text-base">Badges</div>
            <div className="flex p-2">
              <div className="relative">
                <div className="flex flex-col items-start p-2 gap-2 -mt-10 w-32 h-9 bg-opacity-75 bg-black rounded-md ml-20 absolute">
                  <div className="w-full text-white">Eager Learner</div>
                </div>
                <img
                  src="/badge1.png"
                  alt="Badge 1"
                  className="h-[104px] w-[104px]"
                />
              </div>
              <img
                src="/badge2.png"
                alt="Badge 2"
                className="h-[104px] w-[104px]"
              />
              <img
                src="/badge3.png"
                alt="Badge 3"
                className="h-[104px] w-[104px]"
              />
              <img
                src="/badge4.png"
                alt="Badge 4"
                className="h-[104px] w-[104px]"
              />
            </div>
          </div>
        </div>
      </div>
      <BoardTable />
      <UserDetailsSidebar
        user={{ name: userName, avatar: "/user-avatar.png" }}
        visible={isSidebarOpen}
        onClose={handleSidebarClose}
      />
    </div>
  );
};

export default MyBoard;