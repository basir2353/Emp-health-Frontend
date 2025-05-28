import React, { useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SafteyBox from "./SafteyBox";
import Safetycoulm from "./SafteyCoulm";
import ReportSidebar from "./ReportSidebar";
import NotifictionSaftey from "../NotificationCard/NotifictionSaftey";

const SafetyDashboard: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
 const user = JSON.parse(localStorage.getItem("user") || "{}");
        let   userRole =  user.role;

  return (
    <div>
      <div className="flex max-lg:flex-col items-center justify-between p-4 bg-gray-200">
        <h1 className="text-2xl font-bold">Safety</h1>
      {      userRole !== 'admin'  || userRole !==  'doctor' ?
       <Button
         type="primary"
         icon={<PlusOutlined />}
         size="middle"
         className="bg-black text-black"
         style={{ backgroundColor: "black", color: "white" }}
         onClick={toggleSidebar}
       >
         Create Reports
       </Button>
       : ''
          }
      
      </div>
      <SafteyBox />
      <Safetycoulm />
      <ReportSidebar visible={sidebarVisible} onClose={toggleSidebar} />
      <NotifictionSaftey />
    </div>
  );
};

export default SafetyDashboard;
