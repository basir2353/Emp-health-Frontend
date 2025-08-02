import React, { useEffect, useState } from "react";
import { Input } from "antd";
import Progessbar from "./Progessbar";
import axios from "axios";
interface Choice {
  text: string;
  votes: number;
}

interface Poll {
  id: number;
  question: string;
  choices: Choice[];
}


function PollsDetails() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get("https://empolyee-backedn.onrender.com//api/polls");
        setPolls(response.data.polls);
      } catch (error) {
        console.error("Failed to fetch polls:", error);
      }
    };
    fetchPolls();
  }, []);

  // Filter polls by search term if needed
  const filteredPolls = polls.filter(poll =>
    poll.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col justify-center ml-10 max-lg:ml-0">
      {/* Search Input */}
      <div className="w-[512px] max-lg:w-auto mb-4">
        <Input.Search
          placeholder="Search Polls..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
      </div>

      {/* Dynamic polls list */}
      {filteredPolls.length > 0 ? (
        filteredPolls.map((poll, index) => (
          <div key={poll.id} className="flex items-center">
            <div className="flex space-x-[850px] max-lg:space-x-4 mt-2 items-center border border-gray-300 rounded-lg p-4 w-full">
              <div className="flex items-center gap-4">
                <div className="flex">
                  <h2 className="text-base mr-1">Poll No. {index + 1}</h2>
                </div>
                <div className="w-[300px] max-lg:w-auto">
                  <h3 className="text-lg font-medium mb-2">{poll.question}</h3>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                <Progessbar />
              </div>
            </div>
          </div>
        ))
      ) : (
        // Show your original hardcoded polls as fallback when no data or no results
        <>
          {/* Your previous hardcoded poll blocks here (kept as fallback) */}

          <div className="flex items-center">
            <div className="flex space-x-[850px] max-lg:space-x-4 mt-2 items-center border border-gray-300 rounded-lg p-4 w-full">
              <div className="flex items-center gap-4">
                <div className="flex">
                  <h2 className="text-base mr-1">Poll No. 2341</h2>
                </div>
                <div className="w-[300px] max-lg:w-auto">
                  <h3 className="text-lg font-medium mb-2">
                    Does working remotely allow a better work-life balance?
                  </h3>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
{polls.map((poll, index) => (
  <div key={poll.id} className="flex items-center">
    ...
    <Progessbar choices={poll.choices} />
  </div>
))}


              </div>
            </div>
          </div>

          {/* Repeat these blocks as in your original code, or just once */}
        </>
      )}
    </div>
  );
}

export default PollsDetails;
