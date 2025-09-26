import React, { useState } from "react";
import { Button, Drawer, Input, message } from "antd";
import axios from "axios";

interface ReportSidebarProps {
  visible: boolean;
  onClose: () => void;
}

const Sidebarchallegex: React.FC<ReportSidebarProps> = ({ visible, onClose }) => {
  const [title, setTitle] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateChallenge = async () => {
    if (!title || !description || !rewardPoints) {
      message.warning("Please fill in all fields.");
      return;
    }

    const newChallenge = {
      id: Date.now(),
      title,
      description,
      points: Number(rewardPoints),
      participantsCount: 0,
      imageSrc: "/challange.png",
    };

    try {
      setLoading(true);
      // Save locally
      const existing = JSON.parse(localStorage.getItem("challenges") || "[]");
      existing.push(newChallenge);
      localStorage.setItem("challenges", JSON.stringify(existing));

      // Save to backend
      const response = await axios.post(
        "http://localhost:5000/api/createChallenge",
        {
          title,
          description,
          rewardPoints: Number(rewardPoints),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.status === 201) {
        message.success("Challenge created successfully!");
      } else {
        message.error("Unexpected response from server.");
      }
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Failed to create challenge"
      );
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Drawer
      open={visible}
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Create Challenge</span>
          <div>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              type="primary"
              loading={loading}
              style={{ background: "black" }}
              onClick={handleCreateChallenge}
            >
              Create
            </Button>
          </div>
        </div>
      }
      placement="right"
      width={520}
      onClose={onClose}
    >
      <div>
        <div className="mb-4 mt-4">
          <h2 className="text-xl mb-2">Challenge Details</h2>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="mb-2"
          />
        </div>

        <div className="mb-4 mt-4">
          <h2 className="text-xl mb-2">Description</h2>
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the challenge..."
            autoSize={{ minRows: 3, maxRows: 5 }}
            style={{ resize: "vertical" }}
          />
        </div>

        <div className="mb-4 mt-4">
          <h2 className="text-xl mb-2">Reward Points</h2>
          <Input
            value={rewardPoints}
            onChange={(e) => setRewardPoints(e.target.value)}
            placeholder="Reward Points"
            type="number"
            min={0}
            className="mb-2"
          />
        </div>
      </div>
    </Drawer>
  );
};

export default Sidebarchallegex;
