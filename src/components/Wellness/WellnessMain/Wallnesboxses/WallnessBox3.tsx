import React, { useState, useEffect } from "react";
import { Button, Card, Dropdown, Menu, Radio } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import type { RadioChangeEvent } from "antd";
import axios from "axios";

const WallnessBox3: React.FC = () => {
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [pollData, setPollData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/polls");
      setPollData(response.data.polls || []);
    } catch (error) {
      console.error("Error fetching polls:", error);
      setPollData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (pollId: number, e: RadioChangeEvent) => {
    setResponses((prev) => ({
      ...prev,
      [pollId]: e.target.value,
    }));
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">Option 1</Menu.Item>
      <Menu.Item key="1">Option 2</Menu.Item>
      <Menu.Item key="2">Option 3</Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Card
        className="w-[375px] max-lg:w-auto h-[575px] overflow-auto border border-gray-300"
        title={<h3 className="text-2xl font-normal text-left">Active Polls</h3>}
        extra={
          <Dropdown overlay={menu} trigger={["click"]}>
            <EllipsisOutlined
              style={{
                fontSize: 20,
                cursor: "pointer",
                padding: "5px",
                border: "2px solid #D9D9D9",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                borderRadius: "4px",
              }}
            />
          </Dropdown>
        }
      >
        {loading ? (
          <div className="text-center text-gray-500 mt-10">Loading polls...</div>
        ) : Array.isArray(pollData) && pollData.length > 0 ? (
          pollData.map((poll) => (
            <div
              key={poll.id || poll._id}
              className="box-border mt-3 flex flex-col justify-between ml-2 p-3 items-start w-[359px] h-[106px] bg-blue-100 border border-blue-400 rounded-md"
            >
              <div className="flex items-center w-full ml-1">
                <h5 className="font-normal text-base text-[#000000]">
                  {poll.question}
                </h5>
              </div>
              <div className="flex items-center">
                <Radio.Group
                  onChange={(e) => handleChange(poll.id || poll._id, e)}
                  value={responses[poll.id || poll._id]}
                >
                  {poll.choices?.map((choice: any, index: number) => (
                    <Radio key={index} value={typeof choice === 'string' ? choice : choice.text}>
                      {typeof choice === 'string' ? choice : choice.text}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-10">
            No active polls found.
          </div>
        )}
      </Card>
    </div>
  );
};

export default WallnessBox3;