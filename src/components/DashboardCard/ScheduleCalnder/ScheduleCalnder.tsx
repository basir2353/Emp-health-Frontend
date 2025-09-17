import {
  FilterOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Flex,
  Row,
  Space,
  Typography,
  Spin,
  Alert,
  message,
  Select,
} from "antd";
import { BreadCrumb } from "../../../components/BreadCrumbs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AppointmentCalendar from "./Calnder";
import UploadManualPopUp from "./UploadManualPopUp";
import dayjs from "dayjs";

const { Text } = Typography;

interface Doctor {
  _id: string;
  name: string;
  specialty?: string;
  qualification?: string;
  avatarSrc?: string;
}

interface ScheduleData {
  date: dayjs.Dayjs | null;
  startTime: dayjs.Dayjs | null;
  endTime: dayjs.Dayjs | null;
  breaks: Array<{
    id: string;
    startTime: dayjs.Dayjs | null;
    endTime: dayjs.Dayjs | null;
  }>;
}

const ScheduleCalnder: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("MMMM"));

  useEffect(() => {
    const userStr = localStorage.getItem("user") || localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("token");

    let role: string | null = null;
    let name: string | null = null;
    let id: string | null = null;

    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        role = parsedUser.role || null;
        name = parsedUser.name || null;
        id = parsedUser.id || parsedUser._id || null;
      } catch (e) {
        console.error("Error parsing user data from local storage:", e);
        setError("Failed to parse user data. Please log in again.");
      }
    }

    console.log("Local Storage - Role:", role, "Name:", name, "ID:", id, "Token:", token);

    setUserId(id);
    setUserRole(role);
    setUserName(name);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    const fetchDoctors = async () => {
      if (userRole === "admin") {
        setLoading(true);
        try {
          const res = await axios.get("https://empolyee-backedn.onrender.com/api/all-doctors", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Doctors API Response:", res.data);
          setDoctors(res.data.doctors || []);
          if (!selectedDoctor && res.data.doctors?.length > 0) {
            setSelectedDoctor(res.data.doctors[0]._id);
          }
        } catch (err: any) {
          console.error("Error fetching doctors:", err);
          setError(err?.response?.data?.message || err?.message || "Failed to fetch doctors");
        } finally {
          setLoading(false);
        }
      } else if (userRole === "doctor" && userId && !userName) {
        setLoading(true);
        try {
          const res = await axios.get("https://empolyee-backedn.onrender.com/api/all-doctors", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Doctors API Response for Doctor:", res.data);
          const doctor = res.data.doctors?.find((d: Doctor) => d._id === userId);
          if (doctor?.name) {
            setUserName(doctor.name);
          }
        } catch (err: any) {
          console.error("Error fetching doctor name:", err);
          setError(err?.response?.data?.message || err?.message || "Failed to fetch doctor name");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDoctors();
  }, [userRole, userId, userName]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleScheduleSubmit = async (scheduleData: ScheduleData) => {
    const token = localStorage.getItem("token");
    if (!userId) {
      setError("User ID not found");
      return;
    }

    try {
      const formattedData = {
        date: scheduleData.date?.format("YYYY-MM-DD"),
        startTime: scheduleData.startTime?.format("HH:mm"),
        endTime: scheduleData.endTime?.format("HH:mm"),
        breaks: scheduleData.breaks
          .map((breakItem) => ({
            startTime: breakItem.startTime?.format("HH:mm"),
            endTime: breakItem.endTime?.format("HH:mm"),
          }))
          .filter((breakItem) => breakItem.startTime && breakItem.endTime),
      };

      console.log("Submitting schedule data:", formattedData);

      const response = await axios.post(`https://empolyee-backedn.onrender.com/${userId}/schedule`, formattedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Schedule submit response:", response.data);

      if (response.status !== 200) throw new Error("Failed to update schedule");
      message.success("Schedule updated successfully");
      closePopup();
    } catch (err: any) {
      console.error("Error submitting schedule:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to update schedule");
    }
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    const newMonth = direction === "prev" ? dayjs(currentMonth, "MMMM").subtract(1, "month") : dayjs(currentMonth, "MMMM").add(1, "month");
    setCurrentMonth(newMonth.format("MMMM"));
  };

  const getDoctorName = () => {
    if (userRole === "doctor") {
      return userName || "Logged-in Doctor";
    }
    if (userRole === "admin" && selectedDoctor) {
      return doctors.find((d) => d._id === selectedDoctor)?.name || "Selected Doctor";
    }
    if (userRole === "employee") {
      return "You";
    }
    return "Please select a doctor";
  };

  return (
    <div className="mt-4 justify-start items-center pl-3 bg-white ml-10">
      <BreadCrumb
        className="mb-4"
        items={[
          { title: "Home", path: "/" },
          { title: "Health", path: "/health" },
          { title: "Schedule", path: "/health/schedule" },
        ]}
      />

      <Row>
        <Col className="gutter-row flex justify-between right-0 mb-6">
          <div className="text-black text-3xl ml-1 font-medium">Schedule</div>
        </Col>

        <Col className="gutter-row right-8 flex max-lg:ml-32" style={{ marginLeft: "auto" }}>
          <Flex gap="small" align="center">
            {userRole === "admin" && (
              <Select
                placeholder="Select a doctor"
                style={{ width: 200 }}
                onChange={(value) => setSelectedDoctor(value)}
                value={selectedDoctor}
                options={doctors.map((doctor) => ({
                  value: doctor._id,
                  label: doctor.name,
                }))}
                allowClear
              />
            )}
            {(userRole === "admin" || userRole === "doctor") && (
              <>
                <Button
                  type="default"
                  onClick={openPopup}
                  style={{
                    width: "165px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UploadOutlined style={{ marginRight: "5px" }} />
                  Upload Schedule
                </Button>
                <Button
                  type="primary"
                  onClick={openPopup}
                  style={{
                    width: "165px",
                    height: "36px",
                    backgroundColor: "black",
                    borderColor: "black",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PlusOutlined style={{ marginRight: "5px" }} />
                  Manual Upload
                </Button>
              </>
            )}
          </Flex>
        </Col>
      </Row>

      <Row justify="space-between">
        <Col>
          <Space>
            <div className="flex flex-col items-start">
              <div className="flex flex-col items-start rounded-md px-2 py-2">
                {loading && <Spin tip="Loading..." />}
                {error && <Alert message={error} type="error" showIcon />}
                {(userRole === "doctor" || userRole === "admin" || userRole === "employee") && !loading && (
                  <div className="border rounded-md p-4 w-full text-center">
                    <Text className="text-lg font-semibold">
                      {getDoctorName()}
                    </Text>
                  </div>
                )}
                {userRole === null && !loading && (
                  <div className="border rounded-md p-4 w-full text-center bg-gray-100">
                    <Text className="text-gray-500">Please log in to view schedule.</Text>
                  </div>
                )}
              </div>
            </div>
          </Space>
        </Col>

        <Col className="mr-10">
          <Row justify="space-between" align="middle">
            <div className="flex items-center">
              <Button
                className="bg-white shadow-md px-2 py-1 justify-center mr-2 border-2 border-gray-200 rounded-lg"
                onClick={() => handleMonthChange("prev")}
              >
                <LeftOutlined />
              </Button>
              <div className="text-lg font-medium">{currentMonth}</div>
              <Button
                className="bg-white shadow-md px-2 py-1 justify-center ml-2 border-2 border-gray-200 rounded-lg"
                onClick={() => handleMonthChange("next")}
              >
                <RightOutlined />
              </Button>
              <Button className="ml-2" type="default" icon={<FilterOutlined />}>
                Filter
              </Button>
            </div>
          </Row>
        </Col>
      </Row>

      <AppointmentCalendar
        userId={userId}
        userRole={userRole}
        selectedDoctor={selectedDoctor}
        currentMonth={currentMonth}
      />

      {isPopupOpen && (
        <UploadManualPopUp
          closePopup={closePopup}
          onSubmit={handleScheduleSubmit}
        />
      )}
    </div>
  );
};

export default ScheduleCalnder;
