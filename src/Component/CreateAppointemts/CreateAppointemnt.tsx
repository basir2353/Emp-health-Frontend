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


  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

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
    <>
      <div className="mt-4 h-5 justify-start items-center pl-3 bg-white ml-10 max-lg:ml-0">
        <Breadcrumb
          className=""
          items={[
            { title: "Home" },
            { title: <a href="/health">Health</a> },
            {
              title: (
                <a href="/health/admin-schedule-appointments">Appointments212</a>
              ),
            },
          ]}
        />

        <Row>
          <Col className=" flex max-lg:flex-col justify-between right-0 mb-6">
            <div className="text-black text-3xl ml-1 font-medium">
              Appointments
            </div>
          </Col>

          <Col
            className="gutter-row right-8 flex max-lg:ml-0"
            style={{ marginLeft: "auto" }}
          >
            <Flex gap="small" wrap="wrap" className="flex max-lg:flex-col">
              {userParsed.role !== 'employee' ? 
            <Button
                className="w-[144px] "
                type="default"
                block
                onClick={() => navigate("/health/schedule")}
                style={{ width: "170px" }}
              >
                Upload Schedule2
              </Button>
              : ''}
              <Link to="/health/doctors">
              {userParsed.role === 'admin' ?
              ''  
              :
               <Button
                  type="primary"
                  block
                  style={{
                    backgroundColor: "black",
                    borderColor: "black",
                    color: "white",
                  }}
                >
                  Book Appointment
                </Button>
            }
               
              </Link>
            </Flex>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="flex-col md:flex-row">
          <Col xs={24} md={8} lg={6} className="mb-6 md:mb-0">
            <Space direction="vertical">
              <ProfileBox  />
            </Space>
          </Col>

          <Col className="ml-10 max-lg:ml-0">
            <Row>
              <div className="text-2xl ">Appointments!</div>
            </Row>
            <div>
              {appointmentsList.map((appointment: Appointment, index: number) => (
                <div
                  key={index}
                  className="gap-56 max-lg:gap-0 h-[72px] max-lg:h-auto p-[20px] mt-5 border border-solid border-gray-200 rounded-md flex justify-between"
                >
                  <div className="flex max-lg:gap-10  max-lg:flex-col items-center space-x-44 max-lg:space-x-0">
                    <div className="flex space-x-10 max-lg:space-x-0">
                      <div className="flex-col">
                        <Text className="text-xs">{appointment.day}</Text>
                        <br />
                        <Text className="text-2xl text-[#096DD9] font-medium">
                          {appointment.date}
                        </Text>
                      </div>
                      <div className=" h-[60px] max-lg:h-auto top-0 right-0 rounded-full">
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
                      <Text className="text-base w-[53px] h-[30px] bg-[#F0F0F0] rounded p-1 gap-2 ">
                        {appointment.type}
                      </Text>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Avatar
                        src={appointment.avatarSrc}
                        style={{
                          border: "2px solid #000",
                          borderRadius: "50%",
                        }}
                      />
                      <Text className="text-base">
                        {appointment.doctorName}
                      </Text>
                    </div>
                  </div>
                  <div>
                    <div
                      className="flex shadow-md border border-gray-700 px-1 py-1 rounded-md"
                      onClick={toggleDropdown}
                    >
                      <Dropdown overlay={menu} placement="bottomRight">
                        <EllipsisOutlined style={{ fontSize: "24px" }} />
                      </Dropdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CreateAppointments;