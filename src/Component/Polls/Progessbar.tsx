import { Progress } from "antd";
import React, { useEffect, useState } from "react";

interface Choice {
  text: string;
  votes: number;
  percent?: number;
}

interface Poll {
  id: number;
  question: string;
  choices: Choice[];
}

interface ProgessbarProps {
  choices?: Choice[]; // Optional: pass choices as props to avoid fetching inside
}

function Progessbar({ choices }: ProgessbarProps) {
  const [localChoices, setLocalChoices] = useState<Choice[]>([]);

  useEffect(() => {
    if (choices && choices.length) {
      // Calculate percentage based on choices passed from parent
      const totalVotes = choices.reduce((sum, c) => sum + c.votes, 0) || 1;
      const choicesWithPercent = choices.map((choice) => ({
        ...choice,
        percent: Math.round((choice.votes / totalVotes) * 100),
      }));
      setLocalChoices(choicesWithPercent);
    } else {
      // Fallback: fetch polls (optional if you want self-fetching)
      fetchPolls();
    }
  }, [choices]);

  const fetchPolls = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/polls`);
      const data = await response.json();
      if (data.polls && data.polls.length > 0) {
        const poll = data.polls[0]; // example: take the first poll
        const totalVotes = poll.choices.reduce((sum: number, c: Choice) => sum + c.votes, 0) || 1;
        const choicesWithPercent = poll.choices.map((choice: Choice) => ({
          ...choice,
          percent: Math.round((choice.votes / totalVotes) * 100),
        }));
        setLocalChoices(choicesWithPercent);
      }
    } catch (error) {
      console.error("Failed to fetch polls:", error);
    }
  };

  return (
    <div className="space-y-2 w-[200px]">
      {localChoices.map((choice, index) => (
        <Progress
          key={index}
          percent={choice.percent}
          status="active"
          strokeColor={index % 2 === 0 ? "#52c41a" : "#f5222d"}
          format={() => `${choice.text}: ${choice.percent}%`}
        />
      ))}

      {/* Show message if no choices */}
      {localChoices.length === 0 && <p>No choices data available</p>}
    </div>
  );
}

export default Progessbar;
