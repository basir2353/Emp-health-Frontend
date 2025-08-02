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
} from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Calendar from "./Calnder";
import UploadManualPopUp from "./UploadManualPopUp";
import dayjs from "dayjs";

const { Text } = Typography;

interface Appointment {
  doctorName: string;
  doctorImage?: string;
  doctorSpecialty?: string;
  doctorQualification?: string;
  user: {
    name: string;
  };
  type: string;
  date: string;
  time: string;
  status?: string;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    try {
      if (userStr) {
        const userObj = JSON.parse(userStr);
        setUserId(userObj?.id || userObj?._id || null);
      } else {
        setUserId(null);
      }
    } catch (e) {
      setUserId(null);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch("https://empolyee-backedn.onrender.com//api/appointments")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch appointments");
        return res.json();
      })
      .then((data) => {
        const sorted = (data.appointments || []).sort((a: Appointment, b: Appointment) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });
        setAppointments(sorted);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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

      const response = await fetch(`https://empolyee-backedn.onrender.com/${userId}/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData), // Send directly without 'schedule' wrapper
      });

      if (!response.ok) throw new Error("Failed to update schedule");
      message.success("Schedule updated successfully");
      closePopup(); // Close popup on success
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="mt-4 h-5 justify-start items-center pl-3 bg-white ml-10">
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
                {!loading && appointments.length === 0 && (
                  <p className="text-gray-500">No appointments found.</p>
                )}
                {!loading &&
                  appointments.slice(0, 1).map((appt, idx) => (
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
                          Patient: {appt.user?.name} <br />
                          Date: {appt.date} | Time: {appt.time}
                        </p>
                        <p className="text-gray-500 mt-1">Status: {appt.status || "N/A"}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Space>
        </Col>

        <Col className="mr-10">
          <Row justify="space-between" align="middle">
            <div className="flex items-center">
              <div>
                <div className="bg-white shadow-md px-2 py-1 justify-center mr-2 border-2 border-gray-200 rounded-lg">
                  <LeftOutlined />
                </div>
              </div>
              <div className="text-lg font-medium">February</div>
              <div>
                <div className="bg-white shadow-md px-2 py-1 justify-center ml-2 border-2 border-gray-200 rounded-lg">
                  <RightOutlined className="" />
                </div>
              </div>
              <Button className="ml-2" type="default" icon={<FilterOutlined />}>
                Filter
              </Button>
            </div>
          </Row>
        </Col>
      </Row>

      <Calendar />

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