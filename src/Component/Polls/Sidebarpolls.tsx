import React, { useState } from "react";
import { Drawer,  } from "antd";

import { Form, Input, Button, List } from 'antd';
import axios from "axios";
interface CreatePollSidebarProps {
  visible: boolean;
  onClose: () => void;
}

const CreatePollSidebar: React.FC<CreatePollSidebarProps> = ({ visible, onClose }) => {
  const [question, setQuestion] = useState("");

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };
  const [choices, setChoices] = useState<string[]>(['Yes', 'No']);

  // Axios import

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/add_poll", {
        question,
        choices,
      });
      // Optionally handle response
      setQuestion('');
      setChoices(['Yes', 'No']);
      onClose();
    } catch (error) {
      // Optionally handle error
      console.error("Failed to create poll:", error);
    }
  };

  const handleAddChoice = () => {
    setChoices([...choices, '']);
  };

  const handleChoiceChange = (index: number, value: string) => {
    setChoices([
      ...choices.slice(0, index),
      value,
      ...choices.slice(index + 1),
    ]);
  };

  return (
    <Drawer
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>Create Poll</div>
          <div>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button

  type="primary"
  style={{ background: 'black' }}
  onClick={handleSubmit}
>

              Submit
            </Button>
          </div>
        </div>
      }
      placement="right"
      closable={true}
      onClose={onClose}
      visible={visible}
      width={500}
      headerStyle={{ backgroundColor: "#f0f2f5" }} // Adjust background color if needed
    >
      <div>
        <h3>Poll Question:</h3>
        <Input value={question} onChange={handleQuestionChange} />
      </div>
      {/* Add more inputs or content for the poll options, etc. */}
      <div>
  <h2>Choices</h2>
  {choices.map((choice, index) => (
    <div key={index} style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
      <div className="rounded-sm border bg-gray-200 shadow-md px-4 py-1 ">{index+1}</div>
      <Input value={choice} onChange={(e) => handleChoiceChange(index, e.target.value)} style={{ width: 'calc(100% - 30px)' }} />
    </div>
  ))}
  <Button onClick={handleAddChoice}>+ Add Choice</Button>
</div>

    </Drawer>
  );
};

export default CreatePollSidebar;
