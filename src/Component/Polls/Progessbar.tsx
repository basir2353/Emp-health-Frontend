import { Progress } from 'antd';
import React, { useEffect, useState } from 'react';

function Progessbar() {
  const [polls,setPolls] = useState([]);
  const customFormat = (percent?: number) => {
    if (percent !== undefined) {
      // Customize the text based on the percentage
      if (percent <= 30) return 'Yes';
      else if (percent <= 50) return 'No';
      else return 'Ni';
    }
    return null; // Return null for undefined percent
  };
  
    const fetchPolls = async () => {
      try {
        const response = await fetch(`/api/polls`);
        const data = await response.json();
        console.log("Fetched:", data.polls);
        // Calculate percent for each poll based on choices
        data.polls = (data.polls || []).map((poll: any) => {
          const totalVotes = poll.choices.reduce((sum: number, c: any) => sum + c.votes, 0) || 1;
          // Calculate percent for each choice
          const choicesWithPercent = poll.choices.map((choice: any) => ({
            ...choice,
            percent: Math.round((choice.votes / totalVotes) * 100)
          }));
          return {
            ...poll,
            choices: choicesWithPercent
          };
        });
        setPolls((data.polls || []).map((poll: any) => ({
          ...poll,
          percent: Number(poll.percent),
        })));
      } catch (error) {
        console.error('Failed to fetch polls:', error);
      }
    };
    useEffect(()=>{
  fetchPolls()
    },[])
  return (
    <div>
      <Progress percent={30} status="normal" strokeColor="#52c41a" format={customFormat} />
      <Progress percent={50} status="active" strokeColor="#f5222d" format={customFormat} />
      <Progress percent={70} status="active" strokeColor="black" format={customFormat} />
    </div>
  );
}

export default Progessbar;
