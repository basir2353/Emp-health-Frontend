import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  EllipsisOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  Flex,
  Menu,
  Row,
  Space,
  Typography,
} from "antd";

import { RootState } from "../../redux/store";
import { setAppointments } from "../../redux/appointments/appointmentSlice";
import Maria from "../../public/images/Maria.svg";
import Navbar from "../Navbar";
import ProfileBox from "./ProfileSection/ProfileBox";

const { Text } = Typography;

interface Appointment {
  day: string;
  date: string;
  time: string;
  type: string;
  doctorName: string;
  avatarSrc: string;
}

const CreateAppointments: React.FC = () => {
  const navigate = useNavigate();
  const appointmentsData = localStorage.getItem("appointmentData");
  const userData = localStorage.getItem("user");
  let userParsed = JSON.parse(userData || "{}");

  let appointments: any[] = [];

  try {
    const parsed = JSON.parse(appointmentsData || "[]");
    if (Array.isArray(parsed)) {
      appointments = parsed;
    } else if (parsed && typeof parsed === "object") {
      appointments = [parsed];
    }
  } catch {
    appointments = [];
  }

  const [showDropdown, setShowDropdown] = useState(false);
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://empolyee-backedn.onrender.com/api/appointments?userId=${userParsed.id}`
        );
        const data = await response.json();
        if (data && Array.isArray(data.appointments)) {
          setAppointmentsList(data.appointments);
          console.log("Fetched appointments:", data.appointments);
        } else {
          setAppointmentsList([]);
        }
      } catch (error) {
        setAppointmentsList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userParsed.id]);

  const handleMenuClick = (e: any) => {
    switch (e.key) {
      case "reschedule":
        break;
      case "edit":
        break;
      case "cancel":
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
    <div className="mt-4 px-4 sm:px-6 lg:px-10 bg-white min-h-screen">
      <Breadcrumb
        className="mb-4"
        items={[
          { title: "Home" },
          { title: <a href="/health">Health</a> },
          {
            title: (
              <a href="/health/admin-schedule-appointments">Appointments</a>
            ),
          },
        ]}
      />

      <Row gutter={[16, 16]} align="middle" className="mb-6">
        <Col xs={24} lg={12}>
          <div className="text-black text-2xl sm:text-3xl font-medium">
            Appointments
          </div>
        </Col>
        <Col xs={24} lg={12} className="flex justify-end">
          <Flex gap="small" wrap="wrap" className="w-full lg:w-auto">
            {userParsed.role !== "employee" && (
              <Button
                className="w-full lg:w-[170px]"
                type="default"
                onClick={() => navigate("/health/schedule")}
              >
                Upload Schedule
              </Button>
            )}
            {userParsed.role !== "admin" && (
              <Link to="/health/doctors" className="w-full lg:w-auto">
                <Button
                  type="primary"
                  className="w-full lg:w-[170px]"
                  style={{
                    backgroundColor: "black",
                    borderColor: "black",
                    color: "white",
                  }}
                >
                  Book Appointment
                </Button>
              </Link>
            )}
          </Flex>
        </Col>
      </Row>

      <Row gutter={[18, 18]} className="flex-col lg:flex-row">
        <Col xs={24} lg={8} className="mb-6 lg:mb-0">
          <ProfileBox />
        </Col>

        <Col xs={24} lg={16}>
          <div className="text-xl sm:text-2xl mb-4">Appointments</div>
          {loading ? (
            <Text>Loading...</Text>
          ) : appointmentsList.length === 0 ? (
            <Text>No appointments found.</Text>
          ) : (
            <div className="space-y-4">
              {appointmentsList.map((appointment: Appointment, index: number) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <Text className="text-xs">{appointment.day}</Text>
                        <Text className="text-xl sm:text-2xl text-[#096DD9] font-medium">
                          {appointment.date}
                        </Text>
                      </div>
                      <div className="hidden sm:block h-[40px] w-[3px] bg-[#D9D9D9] rounded-full"></div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <ClockCircleOutlined />
                        <Text className="text-sm sm:text-base">
                          {appointment.time}
                        </Text>
                      </div>
                      <Text className="text-sm sm:text-base bg-[#F0F0F0] rounded px-2 py-1">
                        {appointment.type}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={appointment.avatarSrc}
                        style={{
                          border: "2px solid #000",
                          borderRadius: "50%",
                        }}
                        size={{ xs: 32, sm: 40 }}
                      />
                      <Text className="text-sm sm:text-base">
                        {appointment.doctorName}
                      </Text>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Dropdown overlay={menu} placement="bottomRight">
                      <div className="p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                        <EllipsisOutlined style={{ fontSize: "24px" }} />
                      </div>
                    </Dropdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CreateAppointments;