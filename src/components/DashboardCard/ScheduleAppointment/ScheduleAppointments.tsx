import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Space,
  Row,
  Col,
  Breadcrumb,
  Button,
  Flex,
  Typography,
  Menu,
  Dropdown,
} from "antd";
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  LeftOutlined,
  RightOutlined,
  EllipsisOutlined,
  SendOutlined,
} from "@ant-design/icons";
import ProfileCardschedule from "./ProfileCardschedule";

const { Text } = Typography;

const ScheduleAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/appointments");
        // ✅ FIX: Ensure appointments is always an array
        setAppointments(response?.data?.appointments || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleEdit = () => {
    const toggle = !isSidebarOpen;
    setIsSidebarOpen(toggle);
    setIsEditable(toggle);
  };

  const handleMenuClick = (e: any) => {
    switch (e.key) {
      case "reschedule":
        // Logic for rescheduling
        break;
      case "edit":
        handleEdit();
        break;
      case "cancel":
        // Logic for cancellation
        break;
      default:
        break;
    }
    setShowDropdown(false);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="reschedule" icon={<SendOutlined />}>
        Request Reschedule
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        Edit
      </Menu.Item>
      <Menu.Item
        key="cancel"
        icon={<CloseCircleOutlined />}
        style={{ color: "#EF4444" }}
      >
        Cancel
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="mt-4 h-5 justify-start items-center pl-3 bg-white ml-10 max-lg:ml-0">
      <Breadcrumb
        items={[
          { title: "Home" },
          { title: <a href="/health">Health</a> },
          { title: <a href="/health/scheduled-appointments">Scheduled Appointments</a> },
        ]}
      />

      <Row>
        <Col className="gutter-row flex justify-between right-0 mb-6">
          <div className="text-black text-3xl ml-1 font-medium">
            Scheduled Appointments
          </div>
        </Col>

        <Col className="gutter-row right-8 flex max-lg:ml-0" style={{ marginLeft: "auto" }}>
          <Flex gap="small" wrap="wrap" className="flex">
            <Button
              type="default"
              block
              onClick={() => navigate("/health/schedule")}
              style={{ width: "170px" }}
            >
              Upload Schedule
            </Button>
          </Flex>
        </Col>
      </Row>

      <Row>
        <Col>
          <Space direction="vertical">
            <ProfileCardschedule />
          </Space>
        </Col>

        <Col className="ml-10 max-lg:ml-0">
          <Row justify="space-between" align="middle">
            <div className="text-2xl">Scheduled Appointments</div>
            <div className="flex items-center">
              <div className="bg-white shadow-md px-2 py-1 justify-center mr-2 border-2 border-gray-200 rounded-lg">
                <LeftOutlined />
              </div>
              <div className="text-lg font-medium">Feb 8, 2023</div>
              <div className="bg-white shadow-md px-2 py-1 justify-center ml-2 border-2 border-gray-200 rounded-lg">
                <RightOutlined />
              </div>
            </div>
          </Row>

          {loading && <Text>Loading appointments...</Text>}
          {error && <Text type="danger">{error}</Text>}

          <div>
            {appointments.map((appointment, index) => (
              <div
                key={index}
                className="w-[1002px] max-lg:w-auto max-lg:h-auto h-[72px] p-[20px] mt-5 border border-solid border-gray-200 rounded-md flex justify-between"
              >
                <div className="flex max-lg:flex-col items-center space-x-12 max-lg:space-x-0 gap-10">
                  <div className="flex max-lg:flex-col space-x-10 max-lg:space-x-0">
                    <div className="flex-col">
                      <Text className="text-xs">{appointment.day}</Text>
                      <br />
                      <Text className="text-2xl text-[#096DD9] font-medium">
                        {appointment.date}
                      </Text>
                    </div>
                    <div className="h-[60px] top-0 right-0 rounded-full">
                      <div className="h-full bg-[#D9D9D9] w-[3px] rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex-col">
                    <div className="flex items-center space-x-2 mb-2">
                      <ClockCircleOutlined />
                      <Text className="text-base text-[#262626] ">
                        {appointment.time}
                      </Text>
                    </div>
                    <Text className="text-base w-[53px] h-[30px] bg-[#F0F0F0] rounded p-1 gap-2">
                      {appointment.type}
                    </Text>
                  </div>

                  <div className="flex-col">
                    <div className="flex items-center space-x-2 mb-2">
                      <Text className="text-base text-[#262626] ">Doctor</Text>
                    </div>
                    <Text className="text-lg">{appointment.doctorName}</Text>
                  </div>

                  <div className="flex-col">
                    <div className="flex items-center space-x-2 mb-2">
                      <Text className="text-base text-[#262626] ">
                        Patient Name
                      </Text>
                    </div>
                    <Text className="text-lg">{appointment.patient}</Text>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-[6px] h-[6px] bg-green-500 rounded-full"></div>
                  <Text className="text-base text-[#262626]">
                    {appointment.status}
                  </Text>
                </div>

                <div
                  className="flex shadow-md border border-gray-700 px-1 py-1 rounded-md"
                  onClick={toggleDropdown}
                >
                  <Dropdown overlay={menu} placement="bottomRight">
                    <EllipsisOutlined style={{ fontSize: "24px" }} />
                  </Dropdown>
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ScheduleAppointments;
