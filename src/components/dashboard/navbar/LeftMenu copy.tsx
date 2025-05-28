import {
  HeartOutlined,
  InfoCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu, MenuProps, Space } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LeftMenu = (props: any) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [current, setCurrent] = useState("mail");

  useEffect(() => {
    const roleStr = localStorage.getItem("user");
    let role = "";
    try {
      role = roleStr ? JSON.parse(roleStr)?.user?.role || "" : "";
    } catch {
      role = "";
    }
    setUserRole(role);
  }, []);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const healthMenuItems: MenuProps["items"] = [
    {
      key: "dashboard",
      label: (
            <div className=" h-auto mt-4" onClick={() => navigate("/health")}>
              <div className="font-medium text-sm leading-3">Dashboard</div>
              <div className="font-normal text-sm leading-5 mt-2 w-full h-full text-wrap text-[#64748B]">
                View all of your appointments basic stats and other stuff here.
              </div>
            </div>
          ),
    },
    {
      key: "appointments",
      label: (
            <div
              className=" h-auto mt-4"
              onClick={() => navigate("/health/admin-schedule-appointments")}
            >
              <div className="font-medium text-sm leading-3">Appointments</div>
              <div className="font-normal text-sm leading-5 mt-2  w-full h-full text-wrap text-[#64748B]">
                See upcoming appointments and book appointments here.
              </div>
            </div>
          ),
    },
    {
      key: "insurance",
     label: (
            <div
              className=" h-auto mt-4"
              onClick={() => navigate("/health/insurance")}
            >
              <div className="font-medium text-sm leading-3">Insurance</div>
              <div className="font-normal text-sm leading-5 mt-2  w-full h-full text-wrap text-[#64748B]">
                View your insurance details and request to upgrade our insurance
                details here.
              </div>
            </div>
          ),
    },
  ];

  if (userRole === "doctor" || userRole === "admin") {
    healthMenuItems.push({
      key: "my_schedule_appointments",
      label: (
          <div
            className="h-auto mt-4"
            onClick={() => navigate("/health/doctor-schedule-appointments")}
          >
            <div className="font-medium text-sm leading-3">
              My Schedule Appointments (Doctor)
            </div>
            <div className="font-normal text-sm leading-5 mt-2 text-[#64748B]">
              Upload schedule or view your schedule here.
            </div>
          </div>
        ),
    });
  }

  if (userRole === "admin") {
    healthMenuItems.push({
      key: "schedule_appointment",
      label: (
            <div
              className=" h-auto mt-4"
              onClick={() => navigate("/health/admin-schedule-appointments")}
            >
              <div className="font-medium text-sm leading-3">
                Schedule Appoinment (Only Admin)
              </div>
              <div className="font-normal text-sm leading-5 mt-2  w-full h-full text-wrap text-[#64748B]">
                Upload schedule or view your schedule here.
              </div>
            </div>
          ),
    });
  }

  const safetyMenuItems: MenuProps["items"] = [
  {
      key: "Saftey",
      label: (
            <div className=" h-auto mt-4" onClick={() => navigate("/safety")}>
              <div className="font-medium text-sm leading-3">Dashboard</div>
              <div className="font-normal text-sm leading-5 mt-2 w-full h-full text-wrap text-[#64748B]">
                View all of your safety basic stats and other stuff here.
              </div>
            </div>
          ),
    },
  ];

  const wellnessMenuItems: MenuProps["items"] = [
    {
      key: "wellness_dashboard",
     label: (
            <div className="h-auto mt-4" onClick={() => navigate("/wellness")}>
              <div className="font-medium text-sm leading-3">Dashboard</div>
              <div className="font-normal text-sm leading-5 mt-2 w-full h-full text-wrap text-[#64748B]">
                View all of your KPIs and many more here...
              </div>
            </div>
          ),
    },
    {
      key: "courses",
      label: (
            <div
              className="h-auto mt-4"
              onClick={() => navigate("/wellness/course")}
            >
              <div className="font-medium text-sm leading-3">Courses</div>
              <div className="font-normal text-sm leading-5 mt-2 w-full h-full text-wrap text-[#64748B]">
                View new courses and enrolled courses here.
              </div>
            </div>
          ),
    },
    {
      key: "health_forum",
      label: (
            <div
              className="h-auto mt-4"
              onClick={() => navigate("/wellness/forum")}
            >
              <div className="font-medium text-sm leading-3">Health Forum</div>
              <div className="font-normal text-sm leading-5 mt-2 w-full h-full text-wrap text-[#64748B]">
                Post your health related experiences and stories here.
              </div>
            </div>
          ),
    },
    {
      key: "document_repository",
    label: (
            <div
              className="h-auto mt-4"
              onClick={() => navigate("/wellness/document")}
            >
              <div className="font-medium text-sm leading-3">
                Document Repository
              </div>
              <div className="font-normal text-sm leading-5 mt-2 w-full h-full text-wrap text-[#64748B]">
                View all downloadable documents related to your health.
              </div>
            </div>
          ),
    },
    {
      key: "budget_planner",
         label: (
            <div
              className="h-auto mt-4"
              onClick={() => navigate("/wellness/expense")}
            >
              <div className="font-medium text-sm leading-3">
                Budget Planner
              </div>
              <div className="font-normal text-sm leading-5 mt-2 w-full h-full text-wrap text-[#64748B]">
                Plan your budget here with this budget planner.
              </div>
            </div>
          ),
    },  
    {
      key: "my_board",
      label: (
        <div className="h-auto mt-4" onClick={() => navigate("/wellness/board")}>
          <div className="font-medium text-sm leading-3">My Board</div>
          <div className="font-normal text-sm leading-5 mt-2 text-[#64748B]">
            View all of your created challenges and their engagement.
          </div>
        </div>
      ),
    },
  ];

  if (userRole === "admin") {
    wellnessMenuItems.push({
      key: "challenges_admin",
     label: (
            <div
              className="h-auto mt-4"
              onClick={() => navigate("/wellness/challenges")}
            >
              <div className="font-medium text-sm leading-3">
                Challenges (Admin)
              </div>
              <div className="font-normal text-sm leading-5 mt-2 w-full h-full text-wrap text-[#64748B]">
                View all of your created challenges and their engagement.
              </div>
            </div>
          ),
    });
    wellnessMenuItems.push({
      key: "polls_admin",
       label: (
            <div
              className="h-auto mt-4"
              onClick={() => navigate("/wellness/poll")}
            >
              <div className="font-medium text-sm leading-3">Polls (Admin)</div>
              <div className="font-normal text-sm leading-5 mt-2 w-full h-full text-wrap text-[#64748B]">
                View all the polls you have created and their engagement.
              </div>
            </div>
          ),
    });
  }

  const items: MenuProps["items"] = [
    {
      label: "Health",
      key: "health",
      popupClassName: "HealthMenu",
      icon: <SettingOutlined />,
      children: healthMenuItems,
    },
    {
      label: "Safety",
      key: "safety",
      popupClassName: "SafetyMenu",
      icon: <InfoCircleOutlined />,
      children: safetyMenuItems,
    },
    {
      label: "Wellness",
      key: "wellness",
      popupClassName: "WellnessMenu",
      icon: <HeartOutlined />,
      children: wellnessMenuItems,
    },
  ];

  return (
    <Space  size="large" direction="horizontal" align="baseline">
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode={props.mode || "horizontal"}
        items={items}
      />
    </Space>
  );
};

export default LeftMenu;
