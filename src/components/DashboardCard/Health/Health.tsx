import React, { useState, useEffect } from "react";
import {
  Space,
  Card,
  Row,
  Col,
  Breadcrumb,
  Button,
  Flex,
} from "antd";
import { GoldOutlined } from "@ant-design/icons";
import UploadSchedulePopup from "../../../Component/CreateAppointemts/UploadSchedulePopup";
import PricingPopup from "../../../Component/CreateAppointemts/PricingPopup";
import FamilySidebar from "../../../Component/CreateAppointemts/FamilyDetailsSidebarProps";
import NotificatiionCardAppointiment from "../../../Component/Notificationcard/NotificatiionCardAppointiment";
import ProfileApointment from "../../../Component/CreateAppointemts/ProfileApointment";
import axios from "axios";

type Appointment = {
  _id: string;
  day: string;
  date: string;
  time: string;
  type: string;
  doctorName: string;
  avatarSrc: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
};

const Health: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPricingPopupOpen, setIsPricingPopupOpen] = useState(false);
  const [isFamilySidebarOpen, setIsFamilySidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("https://empolyee-backedn.onrender.com//api/appointments");
        setAppointments(res.data.appointments || []);
      } catch (err) {
        setError("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="mt-4 h-5 justify-start items-center pl-3 bg-white ml-10">
      <Breadcrumb
        items={[
          { title: "Home" },
          { title: <a href="#">Health</a> },
          { title: <a href="#">Appointments</a> },
        ]}
      />

      <Row className="mt-4">
        <Col>
          <div className="text-black text-4xl ml-1">Appointments</div>
        </Col>

        <Col className="ml-auto mr-2">
          <Flex gap="small">
            <Button
              type="primary"
              onClick={() => setIsPopupOpen(true)}
              style={{
                backgroundColor: "white",
                color: "black",
                borderColor: "black",
              }}
            >
              Upload Schedule11
            </Button>
          </Flex>
        </Col>
      </Row>

      <Row className="mt-6" gutter={16}>
        <Col>
          <Space direction="vertical">
            <ProfileApointment />

            <div className="text-neutral-400 text-2xl pl-3">
              Active Insurance Plankk
            </div>

            <div className="w-[389px] h-[184px] px-2 py-3 bg-white rounded border border-neutral-200 flex flex-col gap-3">
              <div className="text-black text-xl">
                <GoldOutlined /> Gold Health Plan
              </div>
              <ul className="list-disc ml-5 text-neutral-600 text-sm">
                <li>Medical, Dental, and Vision coverage</li>
                <li>No coverage for elective cosmetic procedures</li>
              </ul>
              <div>
                <div className="text-black text-base font-medium">Premium</div>
                <div className="flex justify-between items-center mt-2">
                  <div className="p-1 bg-lime-300 rounded text-black font-medium">
                    $150 per month
                  </div>
                  <div
                    className="px-3.5 py-1 bg-white rounded cursor-pointer shadow border border-zinc-300"
                    onClick={() => setIsPricingPopupOpen(true)}
                  >
                    <div className="text-sm text-black text-opacity-90">
                      See All
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              onClick={() => setIsFamilySidebarOpen(true)}
              className="w-[389px] h-[38.8px] px-3.5 py-1.5 bg-white rounded shadow border border-zinc-300 cursor-pointer text-center text-black text-opacity-90"
            >
              View Family Details
            </div>
          </Space>
        </Col>

        <Col className="ml-10 mt-2">
          <div className="text-base mb-2">Appointments</div>
          <Card className="w-[1001px] max-lg:w-auto">
            {loading && <div>Loading appointments...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && appointments.length === 0 && (
              <div>No appointments found.</div>
            )}
            {!loading &&
              appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex justify-between items-start p-2 ml-2 mt-2 gap-8 bg-blue-50 border border-blue-200 rounded"
                >
                  <div className="flex items-center mr-20">
                    <div className="text-sm text-gray-600">{appointment.day}</div>
                    <div className="text-3xl text-red-500 ml-1">
                      {appointment.date.split(" ")[1]}
                    </div>
                    <div className="text-sm text-gray-600 ml-1">
                      {appointment.date.split(" ")[0]}
                    </div>
                  </div>
                  <div className="flex-grow flex justify-between gap-8">
                    <div className="w-[33%]">
                      <div className="text-xs text-gray-600">Timing</div>
                      <div className="text-base text-gray-900">{appointment.time}</div>
                    </div>
                    <div className="w-[33%]">
                      <div className="text-xs text-gray-600">Doctor</div>
                      <div className="text-base text-gray-900">{appointment.doctorName}</div>
                    </div>
                    <div className="w-[33%]">
                      <div className="text-xs text-gray-600">Type</div>
                      <div className="text-base text-gray-900">{appointment.type}</div>
                    </div>
                    <button className="px-7 py-0.5 bg-white border border-gray-200 rounded text-sm">
                      View
                    </button>
                  </div>
                </div>
              ))}
          </Card>
        </Col>
      </Row>

      {/* Popups and Sidebars */}
      {isPopupOpen && (
        <UploadSchedulePopup 
          closePopup={() => setIsPopupOpen(false)}
          onSubmit={async () => setIsPopupOpen(false)}
        />
      )}
      {isPricingPopupOpen && <PricingPopup onClose={() => setIsPricingPopupOpen(false)} />}
      {isFamilySidebarOpen && (
        <FamilySidebar isOpen={isFamilySidebarOpen} onClose={() => setIsFamilySidebarOpen(false)} />
      )}

      <NotificatiionCardAppointiment />
    </div>
  );
};

export default Health;
