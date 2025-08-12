import {
  FilterOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Flex,
  Image,
  Row,
  Space,
  Typography,
  Spin,
  Alert,
  message,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

interface Appointment {
  _id: string;
  doctorName: string;
  doctorImage?: string;
  doctorSpecialty?: string;
  doctorQualification?: string;
  user: {
    name: string;
  } | null;
  type: string;
  date: string;
  time: string;
  status?: string;
  doctorId: string;
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("MMMM"));

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    try {
      if (userStr) {
        const userObj = JSON.parse(userStr);
        setUserId(userObj?.id || userObj?._id || null);
        setUserRole(userObj?.role || null);
        setUserName(userObj?.name || null);
      } else {
        setUserId(null);
        setUserRole(null);
        setUserName(null);
      }
    } catch (e) {
      setUserId(null);
      setUserRole(null);
      setUserName(null);
    }
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (userRole === "admin") {
        setLoading(true);
        try {
          const res = await fetch("https://empolyee-backedn.onrender.com/api/all-doctors");
          if (!res.ok) throw new Error("Failed to fetch doctors");
          const data = await res.json();
          setDoctors(data.doctors || []);
          if (!selectedDoctor && data.doctors?.length > 0) {
            setSelectedDoctor(data.doctors[0]._id);
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else if (userRole === "doctor" && userId && !userName) {
        setLoading(true);
        try {
          const res = await fetch("https://empolyee-backedn.onrender.com/api/all-doctors");
          if (!res.ok) throw new Error("Failed to fetch doctors");
          const data = await res.json();
          const doctor = data.doctors?.find((d: Doctor) => d._id === userId);
          if (doctor?.name) {
            setUserName(doctor.name);
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDoctors();
  }, [userRole, userId, userName]);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError("");
      setSelectedAppointment(null);
      const endpoint =
        userRole === "admin" && selectedDoctor
          ? `https://empolyee-backedn.onrender.com/api/appointments?doctorId=${selectedDoctor}`
          : userRole === "doctor" && userId
          ? `https://empolyee-backedn.onrender.com/api/appointments?doctorId=${userId}`
          : "https://empolyee-backedn.onrender.com/api/appointments";

      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch appointments");
        const data = await res.json();
        const sorted = (data.appointments || []).sort((a: Appointment, b: Appointment) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });
        setAppointments(sorted);
        if (userRole === "admin" && sorted.length > 0) {
          setSelectedAppointment(sorted[0]._id);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId, userRole, selectedDoctor]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleScheduleSubmit = async (scheduleData: ScheduleData) => {
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

      const response = await fetch(`http://localhost:5000/${userId}/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) throw new Error("Failed to update schedule");
      message.success("Schedule updated successfully");
      closePopup();
    } catch (err: any) {
      setError(err.message);
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
    return "Please select a doctor";
  };

  return (
    <div className="mt-4 justify-start items-center pl-3 bg-white ml-10">
      <Breadcrumb
        items={[
          { title: "Home" },
          { title: <a href="">Health</a> },
          { title: <a href="">Schedule</a> },
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
          </Flex>
        </Col>
      </Row>

      <Row justify="space-between">
        <Col>
          <Space>
            <div className="flex flex-col items-start">
              <div className="flex flex-col items-start rounded-md px-2 py-2">
                {loading && <Spin tip="Loading appointments..." />}
                {error && <Alert message={error} type="error" showIcon />}
                {userRole === "doctor" && !loading && (
                  <div className="border rounded-md p-4 w-full text-center">
                    <Text className="text-lg font-semibold">
                      {getDoctorName()} - {appointments.length} Appointments
                    </Text>
                  </div>
                )}
                {userRole === "admin" && !loading && (
                  <>
                    {appointments.length === 0 && (
                      <div className="border rounded-md p-4 w-full text-center bg-gray-100">
                        <Text className="text-gray-500">
                          No appointments found for {getDoctorName()}.
                        </Text>
                      </div>
                    )}
                    {appointments.length > 0 && (
                      <>
                        <Select
                          placeholder="Select an appointment"
                          style={{ width: "100%", marginBottom: 16 }}
                          onChange={(value) => setSelectedAppointment(value || null)}
                          value={selectedAppointment}
                          options={appointments.map((appt) => ({
                            value: appt._id,
                            label: `${appt.date} ${appt.time} - ${appt.user?.name || "Unknown Patient"} (${appt.type})`,
                          }))}
                          allowClear
                        />
                        {selectedAppointment ? (
                          appointments
                            .filter((appt) => appt._id === selectedAppointment)
                            .map((appt, idx) => (
                              <div
                                key={idx}
                                className="flex items-center mb-4 py-2 px-3 border rounded-md w-full"
                              >
                                <div className="w-[60px] h-[60px] rounded-full overflow-hidden mr-3 border-2">
                                  <Image
                                    src={appt.doctorImage || "/images/default-doctor.svg"}
                                    alt={appt.doctorName}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <div className="flex flex-col items-start">
                                  <h3 className="text-lg font-bold text-black">
                                    {appt.doctorName}{" "}
                                    <span className="font-normal text-base">
                                      ({appt.doctorSpecialty || appt.type})
                                    </span>
                                  </h3>
                                  <p className="font-normal text-base leading-6 text-gray-500">
                                    {appt.doctorQualification || ""}
                                  </p>
                                  <p className="font-normal text-base text-gray-700 mt-1">
                                    Patient: {appt.user?.name || "Unknown Patient"} <br />
                                    Date: {appt.date} | Time: {appt.time}
                                  </p>
                                  <p className="text-gray-500 mt-1">Status: {appt.status || "N/A"}</p>
                                </div>
                              </div>
                            ))
                        ) : (
                          <div className="border rounded-md p-4 w-full text-center bg-gray-100">
                            <Text className="text-gray-500">
                              Please select an appointment for {getDoctorName()}.
                            </Text>
                          </div>
                        )}
                      </>
                    )}
                  </>
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