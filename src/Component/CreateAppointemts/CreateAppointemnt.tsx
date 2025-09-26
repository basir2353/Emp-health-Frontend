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
  Button,
  Col,
  Dropdown,
  Flex,
  Menu,
  Row,
  Space,
  Typography,
} from "antd";
import { BreadCrumb } from "../../components/BreadCrumbs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { RootState } from "../../redux/store";
import { setAppointments } from "../../redux/appointments/appointmentSlice";
import Navbar from "../Navbar";
import ProfileBox from "./ProfileSection/ProfileBox";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Text } = Typography;

interface Appointment {
  _id: string;
  day: string;
  date: string;
  time: string;
  type: string;
  doctorName: string;
  avatarSrc: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Normalize date format (e.g., "Aug 5" to "2025-08-05")
const normalizeDateFormat = (date: string, year: number = new Date().getFullYear()): string => {
  if (!date) return "N/A";
  try {
    // Parse "Aug 5" or similar short formats
    const parsedDate = dayjs(`${date} ${year}`, "MMM D YYYY");
    if (parsedDate.isValid()) {
      return parsedDate.format("YYYY-MM-DD");
    }
    // If already in a parseable format, try parsing directly
    if (dayjs(date).isValid()) {
      return dayjs(date).format("YYYY-MM-DD");
    }
    return "N/A";
  } catch {
    return "N/A";
  }
};

// Normalize time format (e.g., "10:00 AM" or "10:00 - 11:00" or "10-12")
const normalizeTimeFormat = (time: string): string => {
  if (!time) return "N/A";
  try {
    // Handle "10-12" format
    if (/^\d{1,2}-\d{1,2}$/.test(time)) {
      const [start, end] = time.split("-").map(t => t.trim());
      return `${start.padStart(2, "0")}:00 - ${end.padStart(2, "0")}:00`;
    }
    // Handle "10:00 - 12:00" format
    if (/^\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/.test(time)) {
      return time;
    }
    // Handle "10:00 AM" format
    if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(time)) {
      return dayjs(time, "h:mm A").format("HH:mm");
    }
    return "N/A";
  } catch {
    return "N/A";
  }
};

// Normalize appointment data
const normalizeAppointment = (appt: Appointment): Appointment => ({
  ...appt,
  date: normalizeDateFormat(appt.date),
  time: normalizeTimeFormat(appt.time),
  createdAt: dayjs(appt.createdAt).isValid() ? appt.createdAt : dayjs().toISOString(),
  avatarSrc: appt.avatarSrc || "https://cdn-icons-png.flaticon.com/512/3675/3675805.png",
});

const CreateAppointments: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appointmentsData = localStorage.getItem("appointmentData");
  const userData = localStorage.getItem("user");
  let userParsed = userData ? JSON.parse(userData) : {};

  let appointments: Appointment[] = [];

  try {
    const parsed = JSON.parse(appointmentsData || "[]");
    if (Array.isArray(parsed)) {
      appointments = parsed.map(normalizeAppointment);
    } else if (parsed && typeof parsed === "object") {
      appointments = [normalizeAppointment(parsed)];
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
          `http://empolyee-backedn.onrender.com/api/appointments?userId=${userParsed.id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && Array.isArray(data.appointments)) {
          const normalizedAppointments = data.appointments.map(normalizeAppointment);
          setAppointmentsList(normalizedAppointments);
          dispatch(setAppointments(normalizedAppointments));
          console.log("Fetched appointments:", normalizedAppointments);
        } else {
          setAppointmentsList([]);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointmentsList([]);
      } finally {
        setLoading(false);
      }
    };

    if (userParsed.id) {
      fetchAppointments();
    } else {
      console.warn("No user ID found, skipping fetchAppointments");
      setLoading(false);
    }
  }, [userParsed.id, dispatch]);

  const handleMenuClick = (e: any) => {
    switch (e.key) {
      case "reschedule":
        // Implement reschedule logic
        break;
      case "edit":
        // Implement edit logic
        break;
      case "cancel":
        // Implement cancel logic
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
      <BreadCrumb
        className="mb-4"
        items={[
          { title: "Home", path: "/" },
          { title: "Health", path: "/health" },
          {
            title: "Appointments",
            path: "/health/admin-schedule-appointments"
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
                          {dayjs(appointment.date).isValid()
                            ? dayjs(appointment.date).format("MMM D, YYYY")
                            : "Invalid Date"}
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