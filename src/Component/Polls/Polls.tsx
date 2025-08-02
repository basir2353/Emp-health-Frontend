import {
  ArrowLeftOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import PollsDetails from "./PollsDetails";
import CreatePollSidebar from "./Sidebarpolls";

function Polls() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleCreatePollClick = () => {
    setSidebarVisible(true);
  };

  const handleCloseSidebar = () => {
    setSidebarVisible(false);
  };

  type Poll = {
    _id: string;
    answered: boolean;
    // add other poll fields as needed
  };

  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/polls");
        setPolls(res.data.polls);
      } catch (error) {
        // handle error as needed
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  const totalPolls = polls.length;
  const unansweredPolls = polls.filter((p) => !p.answered).length;
  const participationRate =
    totalPolls === 0
      ? 0
      : Math.round(((totalPolls - unansweredPolls) / totalPolls) * 100);
  const engagementThisMonth = participationRate; // Replace with actual logic if needed

  return (
    <div>
      <div className="mx-10 mt-10">
        <div className="flex justify-between">
          <div>
            <div className="flex text-xl gap-5 font-bold">
              <ArrowLeftOutlined />
              <h1>Polls</h1>
            </div>
            <Breadcrumb
              className="font-xl"
              items={[
                {
                  title: "Wellness",
                },
                {
                  title: <a href="">Polls</a>,
                },
              ]}
            />
          </div>
          <div>
            <Button
              style={{ background: "black", color: "white" }}
              icon={<PlusCircleOutlined />}
              onClick={handleCreatePollClick}
            >
              Create Poll
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
                <h2 className="text-base font-semibold text-black">Total Polls</h2>
                <p className="text-6xl font-bold text-black">{totalPolls}</p>
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
                <h2 className="text-base font-semibold text-black">Unanswered Polls</h2>
                <p className="text-6xl font-bold text-black">{unansweredPolls}</p>
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
                <p className="text-6xl font-bold text-black">{participationRate}</p>
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
                d="M41.9207 38.6039C41.1628 36.8086 40.0629 35.1779 38.6823 33.8026C37.3059 32.4233 35.6755 31.3236 33.881 30.5642C33.8649 30.5561 33.8488 30.5521 33.8328 30.5441C36.3359 28.7361 37.9631 25.791 37.9631 22.4682C37.9631 16.9637 33.5033 12.5039 27.9988 12.5039C22.4943 12.5039 18.0346 16.9637 18.0346 22.4682C18.0346 28.1469 22.7316 33.2347 28.4888 33.4173C29.1363 33.4471 29.7695 33.3339 30.3375 33.0837C30.687 32.9216 30.8423 32.4761 30.6751 32.1353C30.5063 31.7946 30.0586 31.637 29.709 31.7991C25.5996 33.7471 22.7399 29.8665 22.7399 25.7552C22.7399 21.5238 25.8686 18.1462 30.0651 18.1462C34.2617 18.1462 37.3904 21.5182 37.3904 25.7552C37.3904 27.5224 36.7959 29.1377 35.7689 30.3674C36.6939 31.4536 37.3943 32.7694 37.812 34.2162C38.1737 35.4644 38.2579 36.789 38.0537 38.0702C37.8496 39.3514 37.365 40.5471 36.6363 41.5672C35.8581 42.683 34.8453 43.5976 33.657 44.2435C32.5721 44.8133 31.3645 45.1222 30.1034 45.1506C28.9327 45.1722 27.7701 44.9179 26.7042 44.4048C25.6304 43.8863 24.693 43.1247 23.9629 42.1743"
                stroke="#52C41A"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between h-[111px] px-2 py-4 w-[344px] bg-white border border-gray-300 rounded-md mt-4">
            <div className="flex items-start gap-4">
              <div className="w-2 h-24 bg-yellow-700 rounded-full"></div>
              <div className="flex flex-col">
                <h2 className="text-base font-semibold text-black">Engagement This Month</h2>
                <p className="text-6xl font-bold text-black">{engagementThisMonth}</p>
              </div>
            </div>
            <svg
              width="56"
              height="57"
              viewBox="0 0 56 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect y="0.5" width="56" height="56" rx="8" fill="#FFF7E6" />
              <path
                d="M41.9003 21.8573C40.5632 21.8001 39.3237 22.3736 38.4832 23.4069C37.6426 24.4401 37.3171 25.8328 37.5873 27.1619C37.7564 28.014 37.8566 28.8683 37.8876 29.7221C38.0031 32.7011 35.6807 35.0867 32.7273 35.2018C29.7739 35.317 27.2303 32.9656 27.1155 30.0025C27.0605 28.583 27.6293 27.2016 28.6743 26.2631C29.7189 25.3243 31.142 24.942 32.5063 25.3116"
                stroke="#FA8C16"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>

      {sidebarVisible && (
        <CreatePollSidebar visible={sidebarVisible} onClose={handleCloseSidebar} />
      )}
      <PollsDetails />
    </div>
  );
}

export default Polls;
