import React, { useState } from "react";
import { Button, Drawer, Input } from "antd";
import UploadChallages from "./Uploadchallanges";
import axios from "axios";

interface ReportSidebarProps {
  visible: boolean;
  onClose: () => void;
}

const Sidebarchallegex: React.FC<ReportSidebarProps> = ({ visible, onClose }) => {
  const [title, setTitle] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateChallenge = () => {
    const newChallenge = {
      id: Date.now(),
      title,
      description,
      points: Number(rewardPoints),
      participantsCount: 0,
      imageSrc: "/challange.png",
    };

    const existing = JSON.parse(localStorage.getItem("challenges") || "[]");
    existing.push(newChallenge);
    localStorage.setItem("challenges", JSON.stringify(existing));

    axios.post("/api/createChallenge", {
      title,
      description,
      rewardPoints: Number(rewardPoints),
    }).then((response) => {
      if (response.data && response.data.success) {
      // Optionally handle success, e.g., show notification
      console.log("Challenge created successfully");
      }
    }).catch((error) => {
      // Optionally handle error, e.g., show notification
      console.error("Failed to create challenge:", error);
    });

    onClose();
    // window.location.reload();
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
            <Button type="primary" style={{ background: "black" }} onClick={handleCreateChallenge}>
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
            placeholder="Heading"
            className="mb-2"
          />
        </div>

        <div className="mb-4 mt-4">
          <h2 className="text-xl mb-2">Description</h2>
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Autosize height based on content lines"
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
            className="mb-2"
            type="number"
            min={0}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default Sidebarchallegex;
