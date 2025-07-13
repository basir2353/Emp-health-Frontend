"use client";

import {
  ArrowLeftOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
// import Banner from "."; // Updated import name for consistency
import Sidebarchallegex from "./Sidebarchallegex";
import Banner from "./Challangedetails";

const BASE_URL = "http://localhost:5000";

const Challenges = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState({
    totalChallenges: 0,
    zeroParticipants: 0,
    participationRate: "0%",
    engagementThisMonth: "0%",
  });

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/challenges`);
      const challengesData = response.data.challenges || [];
      setChallenges(challengesData);

      // Calculate statistics
      const totalChallenges = challengesData.length;
      const zeroParticipants = challengesData.filter(
        (challenge: any) => (challenge.participantsCount || 0) === 0
      ).length;
      const totalParticipants = challengesData.reduce(
        (sum: number, challenge: any) => sum + (challenge.participantsCount || 0),
        0
      );
      // Assuming max possible participants is known or estimated (e.g., 100 users for simplicity)
      const maxParticipants = 100; // Replace with actual user count from API if available
      const participationRate = totalChallenges
        ? ((totalParticipants / (totalChallenges * maxParticipants)) * 100).toFixed(0) + "%"
        : "0%";
      // Engagement this month (simplified: based on challenges with activity in the last 30 days)
      const recentChallenges = challengesData.filter((challenge: any) => {
        const challengeDate = new Date(challenge.createdAt || Date.now());
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        return challengeDate >= thirtyDaysAgo;
      });
      const engagementThisMonth = totalChallenges
        ? ((recentChallenges.length / totalChallenges) * 100).toFixed(0) + "%"
        : "0%";

      setStats({
        totalChallenges,
        zeroParticipants,
        participationRate,
        engagementThisMonth,
      });
    } catch (error) {
      console.error("Failed to fetch challenges", error);
    }
  };

  const handleCreatePollClick = () => {
    setSidebarVisible(true);
  };

  const handleCloseSidebar = () => {
    setSidebarVisible(false);
  };

  return (
    <div>
      <div className="mx-10 mt-10">
        <div className="flex justify-between">
          <div>
            <div className="flex text-xl gap-5 font-bold">
              <ArrowLeftOutlined />
              <h1>Challenges</h1>
            </div>
            <Breadcrumb
              className="font-xl"
              items={[
                { title: "Wellness" },
                { title: <a href="/challenges">Challenges</a> },
              ]}
            />
          </div>
          <div>
            <Button
              style={{ background: "black", color: "white" }}
              icon={<PlusCircleOutlined />}
              onClick={handleCreatePollClick}
            >
              Create Challenges
            </Button>
          </div>
        </div>
      </div>
      <div>
        <div className="flex max-lg:flex-col gap-6 justify-center pb-10">
          <div className="flex items-center h-[111px] justify-between px-2 py-4 w-[344px] bg-white border border-gray-300 rounded-md mt-4">
            <div className="flex items-start gap-4">
              <div className="w-2 h-24 bg-gray-700 rounded-full"></div>
              <div className="flex flex-col">
                <h2 className="text-base font-semibold text-black">Total Challenges</h2>
                <p className="text-6xl font-bold text-black">{stats.totalChallenges}</p>
              </div>
            </div>
            <svg
              width="56"
              height="57"
              viewBox="0 0 56 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect y="0.5" width="56" height="56" rx="8" fill="#F5F5F5" />
              <path
                d="M40.9375 21.2227H31.9375V17.25C31.9375 16.6277 31.4348 16.125 30.8125 16.125H16.4688V14.7188C16.4688 14.5641 16.3422 14.4375 16.1875 14.4375H14.2188C14.0641 14.4375 13.9375 14.5641 13.9375 14.7188V42.2812C13.9375 42.4359 14.0641 42.5625 14.2188 42.5625H16.1875C16.3422 42.5625 16.4688 42.4359 16.4688 42.2812V33H25.1875V36.9727C25.1875 37.5949 25.6902 38.0977 26.3125 38.0977H40.9375C41.5598 38.0977 42.0625 37.5949 42.0625 36.9727V22.3477C42.0625 21.7254 41.5598 21.2227 40.9375 21.2227Z"
                fill="#434343"
              />
            </svg>
          </div>
          <div className="flex items-center h-[111px] justify-between px-2 py-4 w-[344px] bg-white border border-gray-300 rounded-md mt-4">
            <div className="flex items-start gap-4">
              <div className="w-2 h-24 bg-green-700 rounded-full"></div>
              <div className="flex flex-col">
                <h2 className="text-base font-semibold text-black">Challenges with 0 participants</h2>
                <p className="text-6xl font-bold text-black">{stats.zeroParticipants}</p>
              </div>
            </div>
            <svg
              width="56"
              height="57"
              viewBox="0 0 56 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect y="0.5" width="56" height="56" rx="8" fill="#FFFBE6" />
              <path
                d="M42.0621 26.627H38.8076C38.6228 26.627 38.446 26.7074 38.3215 26.848L29.5264 36.985V14.3605C29.5264 14.1837 29.3817 14.0391 29.2049 14.0391H26.7942C26.6174 14.0391 26.4728 14.1837 26.4728 14.3605V36.985L17.6777 26.848C17.5572 26.7074 17.3804 26.627 17.1915 26.627H13.9371C13.6639 26.627 13.5152 26.9525 13.696 27.1574L27.0313 42.5257C27.1518 42.6647 27.3008 42.7763 27.4683 42.8527C27.6357 42.9291 27.8176 42.9687 28.0016 42.9687C28.1856 42.9687 28.3675 42.9291 28.5349 42.8527C28.7023 42.7763 28.8514 42.6647 28.9719 42.5257L42.3032 27.1574C42.484 26.9484 42.3353 26.627 42.0621 26.627Z"
                fill="#FAAD14"
              />
            </svg>
          </div>
          <div className="flex items-center justify-between h-[111px] px-2 py-4 w-[344px] bg-white border border-gray-300 rounded-md mt-4">
            <div className="flex items-start gap-4">
              <div className="w-2 h-24 bg-red-700 rounded-full"></div>
              <div className="flex flex-col">
                <h2 className="text-base font-semibold text-black">Participation Rate</h2>
                <p className="text-6xl font-bold text-black">{stats.participationRate}</p>
              </div>
            </div>
            <svg
              width="56"
              height="57"
              viewBox="0 0 56 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect y="0.5" width="56" height="56" rx="8" fill="#F6FFED" />
              <path
                d="M41.9207 38.6039C41.1628 36.8086 40.0629 35.1779 38.6823 33.8026C37.3059 32.4233 35.6755 31.3236 33.881 30.5642C33.8649 30.5561 33.8488 30.5521 33.8328 30.5441C36.3359 28.7361 37.9631 25.791 37.9631 22.4682C37.9631 16.9637 33.5033 12.5039 27.9988 12.5039C22.4944 12.5039 18.0346 16.9637 18.0346 22.4682C18.0346 25.791 19.6618 28.7361 22.1649 30.5481C22.1488 30.5561 22.1328 30.5602 22.1167 30.5682C20.3167 31.3276 18.7015 32.4164 17.3154 33.8066C15.9361 35.183 14.8364 36.8134 14.077 38.6079C13.3309 40.3647 12.9286 42.2483 12.8917 44.1566C12.8906 44.1995  Ascendancy 12.8982 44.4861H15.6238C15.8006 44.4861 15.9413 44.3454 15.9453 44.1727C16.0256 41.0709 17.2712 38.166 19.473 35.9642C21.7511 33.6861 24.7765 32.4325 27.9988 32.4325C31.2212 32.4325 34.2466 33.6861 36.5247 35.9642C38.7265 38.166 39.9721 41.0709 40.0524 44.1727C40.0564 44.3494 40.1971 44.4861 40.3738 44.4861H42.7846C42.8275 44.4861 42.8699 44.4775 42.9095 44.4608C42.949 44.4442 42.9848 44.4198 43.0147 44.3891C43.0447 44.3584 43.0682 44.322 43.0839 44.2821C43.0995 44.2421 43.1071 44.1995 43.106 44.1566C43.0658 42.2361 42.668 40.3678 41.9207 38.6039ZM27.9988 29.3789C26.1546 29.3789 24.4189 28.6597 23.1131 27.3539C21.8073 26.0481 21.0881 24.3124 21.0881 22.4682C21.0881 20.624 21.8073 18.8883 23.1131 17.5825C24.4189 16.2767 26.1546 15.5575 27.9988 15.5575C29.843 15.5575 31.5788 16.2767 32.8846 17.5825C34.1904 18.8883 34.9096 20.624 34.9096 22.4682C34.9096 24.3124 34.1904 26.0481 32.8846 27.3539C31.5788 28.6597 29.843 29.3789 27.9988 29.3789Z"
                fill="#52C41A"
              />
            </svg>
          </div>
          <div className="flex items-center justify-between h-[111px] px-2 py-4 w-[344px] bg-white border border-gray-300 rounded-md mt-4">
            <div className="flex items-start gap-4">
              <div className="w-2 h-24 bg-blue-700 rounded-full"></div>
              <div className="flex flex-col">
                <h2 className="text-base font-semibold text-black">Engagement this month</h2>
                <p className="text-6xl font-bold text-black">{stats.engagementThisMonth}</p>
              </div>
            </div>
            <svg
              width="56"
              height="57"
              viewBox="0 0 56 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect y="0.5" width="56" height="56" rx="8" fill="#E6F7FF" />
              <path
                d="M43.1065 39.7522H15.4637V14.6808C15.4637 14.504 15.319 14.3594 15.1422 14.3594H12.8922C12.7154 14.3594 12.5708 14.504 12.5708 14.6808V42.3237C12.5708 42.5004 12.7154 42.6451 12.8922 42.6451H43.1065C43.2833 42.6451 43.4279 42.5004 43.4279 42.3237V40.0737C43.4279 39.8969 43.2833 39.7522 43.1065 39.7522ZM19.7146 33.5527C19.8391 33.6772 20.04 33.6772 20.1686 33.5527L25.7253 28.0241L30.8521 33.183C30.9766 33.3076 31.1815 33.3076 31.3061 33.183L42.3713 22.1219C42.4958 21.9973 42.4958 21.7924 42.3713 21.6679L40.7802 20.0768C40.7198 20.017 40.6382 19.9834 40.5532 19.9834C40.4682 19.9834 40.3866 20.017 40.3262 20.0768L31.0851 29.3138L25.9663 24.1629C25.9059 24.1031 25.8243 24.0696 25.7393 24.0696C25.6543 24.0696 25.5727 24.1031 25.5123 24.1629L18.1275 31.5036C18.0677 31.564 18.0341 31.6456 18.0341 31.7306C18.0341 31.8156 18.0677 31.8972 18.1275 31.9576L19.7146 33.5527Z"
                fill="#096DD9"
              />
            </svg>
          </div>
        </div>
        <Sidebarchallegex visible={sidebarVisible} onClose={handleCloseSidebar} />
        <Banner />
      </div>
    </div>
  );
};

export default Challenges;