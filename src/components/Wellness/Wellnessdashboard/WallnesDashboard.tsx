import React, { useState } from "react";
import {
  ArrowLeftOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button } from "antd";
import DashboardBoxes from "./dasboardboxses";
import Search from "antd/es/input/Search";
import WalnessMainbox from "./WalnessMainbox";
import WelnessFilter from "./WelnessFilterSidebar";
import { useNavigate } from "react-router-dom";

const Wallnessdashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="mx-4 my-2 bg-white">
      <div className="flex  justify-between items-center mb-4 x-">
        <div className="flex items-center">
          <div className="flex items-center justify-center rounded-full w-10 h-10 border-2 border-black">
            <ArrowLeftOutlined />
          </div>
          <h1 className="ml-2 text-lg font-semibold">Courses</h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: "black" }}
          className="mr-2 "
          onClick={() => navigate("/wellness/course/create")}
        >
          Create Course
        </Button>
      </div>

      <Breadcrumb separator="/" className="ml-4">
        <Breadcrumb.Item>Wellness</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="#">Courses</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <DashboardBoxes />
      <div className="flex justify-between">
        <div className="w-[552px] max-lg:w-auto mt-4">
          <Search />
        </div>
        <div className="mr-10 mt-4 max-lg:mr-0 flex items-center justify-center">
          <Button
            className="text-center align-middle justify-center flex"
            onClick={toggleSidebar}
          >
            <FilterOutlined className="" />
            <span className="">Filter</span>
          </Button>
        </div>
      </div>
      <div>
        <WalnessMainbox />
      </div>
      {/* Render the sidebar component */}
      <WelnessFilter isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </div>
  );
};

export default Wallnessdashboard;
