import DrMaria from "../../../../public/images/Maria.svg";
import DrAkhtar from "../../../../public/images/Akhtar.svg";
import DrAndrew from "../../../../public/images/Andrew.svg";
import FinishedIcon from "../../../../public/images/onboarding/finishedIcon.svg";
import { EllipsisOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, Menu, message } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";

const { Meta } = Card;
const BASE_URL = "https://empolyee-backedn.onrender.com/api";

function WalnessBox2() {
  const [loading, setLoading] = useState(false);
  const [challengeData, setChallengeData] = useState<any[]>([]);
  const [participatingChallenges, setParticipatingChallenges] = useState<string[]>([]);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/challenges`)
      .then((res) => {
        setChallengeData(res.data.challenges || []);
      })
      .catch((error) => {
        console.error("Error fetching challenges:", error);
        setChallengeData([]);
      })
      .finally(() => setLoading(false));
  };

  const handleParticipate = async (challengeId: string) => {
    try {
      const participantId =
        localStorage.getItem("userId") || `user_${Date.now()}_${Math.random()}`;

      if (!localStorage.getItem("userId")) {
        localStorage.setItem("userId", participantId);
      }

      const response = await axios.post(`${BASE_URL}/participate/${challengeId}`, {
        participantId,
      });

      if (response.status === 200) {
        message.success("Successfully participated in the challenge!");

        setParticipatingChallenges((prev) => [...prev, challengeId]);

        fetchChallenges();
      }
    } catch (error: any) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes("already participated")
      ) {
        message.warning("You have already participated in this challenge");
        setParticipatingChallenges((prev) => [...prev, challengeId]);
      } else {
        message.error("Failed to participate in challenge");
        console.error("Error participating in challenge:", error);
      }
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">Option 1</Menu.Item>
      <Menu.Item key="2">Option 2</Menu.Item>
      <Menu.Item key="3">Option 3</Menu.Item>
    </Menu>
  );

  return (
    <Card className="w-[619px] h-[575px] max-lg:w-auto border border-gray-300 overflow-auto">
      <Meta
        description={
          <div className="flex justify-between items-center p-5">
            <span className="text-2xl font-normal">Active Challenges</span>
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button
                type="text"
                icon={<EllipsisOutlined />}
                style={{
                  border: "2px solid #D9D9D9",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  borderRadius: "4px",
                }}
              />
            </Dropdown>
          </div>
        }
      />
      {loading ? (
        <div className="text-center text-gray-500 mt-10">Loading...</div>
      ) : Array.isArray(challengeData) && challengeData.length > 0 ? (
        challengeData.map((challenge) => (
          <div
            key={challenge.id || challenge._id}
            className="flex justify-between px-3 py-3 mt-4"
          >
            <div className="w-[94px] h-[94px] bg-[#FAFAFA] rounded-md flex justify-center items-center">
              <img
                src={
                  typeof challenge.imageSrc === "string"
                    ? challenge.imageSrc
                    : challenge.imageSrc?.src || ""
                }
                alt="Challenge"
                className="w-[98px] h-[98px]"
              />
            </div>
            <div className="flex flex-col gap-2 w-[330px] mr-5 justify-between">
              <h3 className="font-medium text-2xl text-black">{challenge.title}</h3>
              <p className="font-normal text-base text-gray-600">{challenge.description}</p>
              <p className="text-sm text-blue-600">
                {challenge.participantsCount || 0} participants
              </p>
            </div>
            <div className="flex flex-col justify-between">
              <Button
                type="default"
                className={`border shadow-md rounded-md px-4 py-1 ${
                  participatingChallenges.includes(challenge.id || challenge._id)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300"
                }`}
                onClick={() => handleParticipate(challenge.id || challenge._id)}
                disabled={participatingChallenges.includes(challenge.id || challenge._id)}
              >
                <span
                  className={`font-medium ${
                    participatingChallenges.includes(challenge.id || challenge._id)
                      ? "text-green-600"
                      : "text-black"
                  }`}
                >
                  {participatingChallenges.includes(challenge.id || challenge._id)
                    ? "Participated"
                    : "Participate"}
                </span>
              </Button>
              <div className="flex items-center gap-1">
                <img src={FinishedIcon} alt="Points Icon" className="w-8 h-8" />
                <span className="text-base text-red-600">
                  {challenge.rewardPoints ?? challenge.points ?? 0} Points
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 mt-10">No active challenges found.</div>
      )}
    </Card>
  );
}

export default WalnessBox2;
