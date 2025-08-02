import React, { useState } from "react";
import { Drawer, Input, Button, message } from "antd";

export interface CreatePollSidebarProps {
  visible: boolean;
  onClose: () => void;
  // other props if any
}

const CreatePollSidebar: React.FC<CreatePollSidebarProps> = ({ visible, onClose }) => {
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState<string[]>(["Yes", "No"]);
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleChoiceChange = (index: number, value: string) => {
    setChoices((prev) => prev.map((c, i) => (i === index ? value : c)));
  };

  const handleAddChoice = () => {
    setChoices((prev) => [...prev, ""]);
  };

  const handleRemoveChoice = (index: number) => {
    if (choices.length <= 2) {
      message.warning("Poll must have at least two choices");
      return;
    }
    setChoices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!question.trim()) {
      message.error("Poll question is required");
      return;
    }
    if (choices.some((c) => !c.trim())) {
      message.error("All choices must be filled out");
      return;
    }
    if (choices.length < 2) {
      message.error("At least two choices are required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://empolyee-backedn.onrender.com//api/add_poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          choices: choices.map((c) => c.trim()),
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to create poll");
      }

      message.success("Poll created successfully");
      setQuestion("");
      setChoices(["Yes", "No"]);
      onClose();
    } catch (error: any) {
      message.error(error.message || "Failed to create poll");
      console.error("Poll submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title="Create Poll"
      placement="right"
      closable
      onClose={onClose}
      open={visible}
      width={480}
      destroyOnClose
    >
      <div className="mb-6">
        <label className="block font-semibold mb-1">Poll Question:</label>
        <Input
          placeholder="Enter your poll question"
          value={question}
          onChange={handleQuestionChange}
          maxLength={200}
        />
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-2">Choices:</label>
        {choices.map((choice, index) => (
          <div key={index} className="flex items-center space-x-2 mb-3">
            <div className="w-6 text-center font-semibold">{index + 1}.</div>
            <Input
              value={choice}
              placeholder={`Choice ${index + 1}`}
              onChange={(e) => handleChoiceChange(index, e.target.value)}
              maxLength={100}
              className="flex-grow"
            />
            {choices.length > 2 && (
              <Button
                type="text"
                danger
                onClick={() => handleRemoveChoice(index)}
                aria-label={`Remove choice ${index + 1}`}
              >
                ×
              </Button>
            )}
          </div>
        ))}
        <Button type="dashed" onClick={handleAddChoice} block>
          + Add Choice
        </Button>
      </div>

      <div className="flex justify-end space-x-3">
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={
            loading ||
            !question.trim() ||
            choices.some((c) => !c.trim()) ||
            choices.length < 2
          }
        >
          Submit
        </Button>
      </div>
    </Drawer>
  );
};

export default CreatePollSidebar;
