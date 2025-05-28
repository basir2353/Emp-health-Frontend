// import React from "react";
// import Search from "antd/es/input/Search";
// import { Progress } from "antd";
// import Progessbar from "./Progessbar";

// function PollsDetails() {
//   return (
//     <div className="flex flex-col justify-center ml-10 max-lg:ml-0">
//       <div className="w-[512px] max-lg:w-auto">
//         <Search />
//       </div>
//       <div className="flex items-center">
//         <div className="flex space-x-[850px] max-lg:space-x-4 mt-2 items-center border border-gray-300 rounded-lg p-4">
//           <div className="flex items-center gap-4">
//             <div className="flex">
//               <h2 className="text-base  mr-1">Poll No. 2341</h2>
//             </div>
//             <div className="w-[300px] max-lg:w-auto">
//               <h3 className="text-lg font-medium mb-2">
//                 Does working remotely allow a better work-life balance?
//               </h3>
//             </div>
//           </div>
//           <div className="flex flex-col justify-between items-end">
//             <Progessbar />
//           </div>
//         </div>
//       </div>
//       <div className="flex items-center">
//         <div className="flex space-x-[850px] max-lg:space-x-4 mt-2 items-center border border-gray-300 rounded-lg p-4">
//           <div className="flex items-center gap-4">
//             <div className="flex">
//             <h2 className="text-base  mr-1">Poll No. 2341</h2>

//             </div>
//             <div className="w-[300px]  max-lg:w-auto">
//               <h3 className="text-lg font-medium mb-2">
//                 Does working remotely allow a better work-life balance?
//               </h3>
//             </div>
//           </div>
//           <div className="flex flex-col justify-between items-end">
//             <Progessbar /> 
//                       </div>
//         </div>
//       </div>
//       <div className="flex items-center ">
//         <div className="flex space-x-[850px] max-lg:space-x-4 mt-2 items-center border border-gray-300 rounded-lg p-4">
//           <div className="flex items-center gap-4">
//             <div className="flex">
//             <h2 className="text-base  mr-1">Poll No. 2341</h2>

//             </div>
//             <div className="w-[300px]  max-lg:w-auto">
//               <h3 className="text-lg font-medium mb-2">
//                 Does working remotely allow a better work-life balance?
//               </h3>
//             </div>
//           </div>
//           <div className="flex flex-col justify-between items-end">
//             <Progessbar />
//           </div>
//         </div>
//       </div>
//       <div className="flex items-center">
//         <div className="flex space-x-[850px] max-lg:space-x-4 mt-2 items-center border border-gray-300 rounded-lg p-4">
//           <div className="flex items-center gap-4">
//             <div className="flex">
//             <h2 className="text-base  mr-1">Poll No. 2341</h2>

//             </div>
//             <div className="w-[300px]  max-lg:w-auto">
//               <h3 className="text-lg font-medium mb-2">
//                 Does working remotely allow a better work-life balance?
//               </h3>
//             </div>
//           </div>
//           <div className="flex flex-col justify-between items-end">
//             <Progessbar />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PollsDetails;




import React, { useEffect, useState } from "react";
import { Input } from "antd";
import Progessbar from "./Progessbar";
import axios from "axios";

interface Poll {
  id: number;
  question: string;
  choices: string[];
}


function PollsDetails() {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get("/api/polls");
        setPolls(response.data.polls);
        console.log(polls);
        
      } catch (error) {
        console.error("Failed to fetch polls:", error);
      }
    };
    fetchPolls();
  }, []);

  return (
    <div className="flex flex-col justify-center ml-10 max-lg:ml-0">
      <div className="w-[512px] max-lg:w-auto">
        <Input.Search placeholder="Search Polls..." />
      </div>

      {polls.map((poll, index) => (
        <div key={poll.id} className="flex items-center">
          <div className="flex space-x-[850px] max-lg:space-x-4 mt-2 items-center border border-gray-300 rounded-lg p-4">
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
      ))}
    </div>
  );
}

export default PollsDetails;
