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
  PhoneOutlined,
} from "@ant-design/icons";
import ProfileCardschedule from "./ProfileCardschedule";

const { Text } = Typography;

interface Appointment {
  _id: string;
  day: string;
  date: string;
  time: string;
  type: string;
  doctorName: string;
  patient: string;
  status: string;
  user?: {
    name: string;
  };
}

const ScheduleAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user") || localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("token");

    let role: string | null = null;
    let name: string | null = null;

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        role = parsedUser.role || null;
        name = parsedUser.name || null;
      } catch (e) {
        console.error("Error parsing user data from local storage:", e);
        setError("Failed to parse user data. Please log in again.");
      }
    }

    console.log("Local Storage - Role:", role, "Name:", name, "Token:", token);

    setUserRole(role);
    setUserName(name);

    const fetchAppointments = async () => {
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          "https://empolyee-backedn.onrender.com/api/appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);

        const fetchedAppointments = response?.data?.appointments;
        if (Array.isArray(fetchedAppointments)) {
          const mappedAppointments = fetchedAppointments.map((appt: any) => ({
            _id: appt._id,
            day: appt.day,
            date: appt.date,
            time: appt.time,
            type: appt.type,
            doctorName: appt.doctorName,
            patient: appt.user?.name || "-",
            status: appt.status || "Scheduled",
          }));

          console.log("Mapped Appointments:", mappedAppointments);

          if (role === "admin") {
            console.log("Admin role detected: Displaying all appointments.");
            setAppointments(mappedAppointments);
          } else if (role === "doctor") {
            if (name) {
              const filteredAppointments = mappedAppointments.filter((appt: Appointment) =>
                appt.doctorName.toLowerCase().includes(name!.toLowerCase() || "")
              );
              console.log("Doctor role detected - Filtered Appointments:", filteredAppointments);
              setAppointments(filteredAppointments);
            } else {
              setAppointments([]);
              setError("User name not found for doctor role.");
            }
          } else {
            setAppointments([]);
            setError("Invalid role or user name not found.");
          }
        } else {
          setAppointments([]);
          setError("No appointments found in the response.");
        }
      } catch (err: any) {
        console.error("API Error:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleMenuClick = (key: string, index: number) => {
    setActiveDropdown(null);
    switch (key) {
      case "call":
        navigate("/inbox/call");
        break;
      case "edit":
        setIsSidebarOpen(!isSidebarOpen);
        break;
      case "cancel":
        console.log("Cancel appointment:", appointments[index]);
        break;
      default:
        break;
    }
  };

  const renderMenu = (index: number) => (
    <Menu
      onClick={({ key }) => handleMenuClick(key, index)}
      items={[
        {
          key: "call",
          label: "Call",
          icon: <PhoneOutlined />,
        },
        {
          key: "edit",
          label: "Edit",
          icon: <EditOutlined />,
        },
        {
          key: "cancel",
          label: "Cancel",
          icon: <CloseCircleOutlined />,
          danger: true,
        },
      ]}
    />
  );

  return (
    <div className="mt-4 px-4 bg-white w-full">
      <Breadcrumb
        items={[
          { title: "Home" },
          { title: <a href="/health">Health</a> },
          { title: <a href="/health/scheduled-appointments">Scheduled Appointments</a> },
        ]}
      />

      <Row className="w-full mb-6" justify="space-between" align="middle">
        <Col xs={24} lg={12}>
          <div className="text-black text-2xl font-medium">
            Scheduled Appointments
          </div>
        </Col>
        <Col xs={24} lg={12} className="flex justify-end">
          <Flex gap="small" wrap="wrap">
            <Button
              type="default"
              onClick={() => navigate("/health/schedule")}
              className="w-full lg:w-44"
            >
              Upload Schedule!
            </Button>
          </Flex>
        </Col>
      </Row>

      <Row className="w-full" gutter={[16, 16]}>
        <Col xs={24} lg={6}>
          <Space direction="vertical" className="w-full">
            <ProfileCardschedule />
          </Space>
        </Col>

        <Col xs={24} lg={18}>
          <Row justify="space-between" align="middle" className="mb-4">
            <div className="text-2xl">Scheduled Appointments</div>
            <div className="flex items-center">
              <div className="bg-white shadow-md p-2 border-2 border-gray-200 rounded-lg mr-2">
                <LeftOutlined />
              </div>
              <div className="text-lg font-medium">Feb 8, 2023</div>
              <div className="bg-white shadow-md p-2 border-2 border-gray-200 rounded-lg ml-2">
                <RightOutlined />
              </div>
            </div>
          </Row>

          {loading && <Text>Loading appointments...</Text>}
          {error && <Text type="danger">{error}</Text>}

          {!loading && !error && appointments.length === 0 && (
            <Text>No appointments available.</Text>
          )}

          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <div
                key={appointment._id}
                className="w-full p-4 border border-gray-200 rounded-md flex flex-col lg:flex-row justify-between items-start lg:items-center"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center w-full lg:w-3/4 space-y-4 lg:space-y-0 lg:space-x-8">
                  <div className="flex flex-col">
                    <Text className="text-xs">{appointment.day || "-"}</Text>
                    <Text className="text-xl text-blue-600 font-medium">
                      {appointment.date || "-"}
                    </Text>
                  </div>
                  <div className="h-10 w-0.5 bg-gray-200 rounded-full lg:h-12 max-lg:hidden"></div>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2 mb-2">
                      <ClockCircleOutlined />
                      <Text className="text-base text-gray-800">
                        {appointment.time || "-"}
                      </Text>
                    </div>
                    <Text className="text-base bg-gray-100 rounded px-2 py-1">
                      {appointment.type || "-"}
                    </Text>
                  </div>
                  <div className="flex flex-col">
                    <Text className="text-base text-gray-800 mb-2">Doctor</Text>
                    <Text className="text-lg">{appointment.doctorName || "-"}</Text>
                  </div>
                  <div className="flex flex-col">
                    <Text className="text-base text-gray-800 mb-2">Patient Name</Text>
                    <Text className="text-lg">{appointment.patient || "-"}</Text>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <Text className="text-base text-gray-800">
                    {appointment.status || "-"}
                  </Text>
                  <Dropdown
                    overlay={renderMenu(index)}
                    placement="bottomRight"
                    trigger={["click"]}
                  >
                    <div className="shadow-md border border-gray-700 p-1 rounded-md cursor-pointer">
                      <EllipsisOutlined className="text-2xl" />
                    </div>
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