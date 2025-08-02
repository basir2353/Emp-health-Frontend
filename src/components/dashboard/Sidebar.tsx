import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Drawer,
  Image,
  Typography,
  message,
  Calendar,
} from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addAppointment } from "../../redux/appointments/appointmentSlice";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";

interface SidebarProps {
  isedit: boolean;
  isOpen: boolean;
  onClose: () => void;
  selectedDoctor: Doctor | null;
  selectedDate: string | null; // Expected format: YYYY-MM-DD
}

interface Doctor {
  name: string;
  profession: string;
  education: string;
  image: string;
  available_hours: string;
  experience: string;
  date:string
}

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
];

const Sidebar: React.FC<SidebarProps> = ({
  isedit,
  isOpen,
  onClose,
  selectedDoctor,
  selectedDate,
}) => {
  const dispatch = useDispatch();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedAppointmentType, setSelectedAppointmentType] =
    useState("Walk in");
  const [selectedDateValue, setSelectedDateValue] = useState<Dayjs | undefined>(
    selectedDate && dayjs(selectedDate, "YYYY-MM-DD").isValid()
      ? dayjs(selectedDate, "YYYY-MM-DD")
      : undefined
  );
  const [Isedit, setIsedit] = useState(isedit);
  const [isCancelClicked, setIsCancelClicked] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  // Update selectedDateValue when selectedDate prop changes
  useEffect(() => {
    if (selectedDate && dayjs(selectedDate, "YYYY-MM-DD").isValid()) {
      setSelectedDateValue(dayjs(selectedDate, "YYYY-MM-DD"));
    } else {
      setSelectedDateValue(undefined);
    }
  }, [selectedDate]);

  // Get the day of the week for the selected date
  const getCurrentDay = () => {
    if (!selectedDateValue) return "";
    return selectedDateValue.format("ddd"); // e.g., "Wed"
  };

  // Handle date selection in the calendar
  const handleDateSelect = (date: Dayjs) => {
    setSelectedDateValue(date);
  };

  // Disable all dates except the selectedDate
  const disabledDate = (current: Dayjs) => {
    if (!selectedDate || !dayjs(selectedDate, "YYYY-MM-DD").isValid()) {
      return true; // Disable all dates if selectedDate is invalid
    }
    return !current.isSame(dayjs(selectedDate, "YYYY-MM-DD"), "day");
  };

  const handelcancel = () => {
    setIsCancelClicked(true);
    setIsedit(true);
  };

  const handleCardClick = (index: number) => {
    setSelectedCard(index);
  };

  const handleAppointmentTypeChange = (type: string) => {
    setSelectedAppointmentType(type);
  };

  const handleReschedule = () => {
    setIsedit(false);
    setIsCancelClicked(false);
  };

  const handleConfirm = () => {
    if (!selectedDateValue || selectedCard === null || !selectedDoctor) {
      message.error("Please select date, time, and doctor for the appointment");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id || user?._id || null;
    const token = localStorage.getItem("token_real");

    if (!userId) {
      message.error("User ID not found. Please log in again.");
      return;
    }

    if (!token) {
      message.error("No authentication token found. Please log in again.");
      return;
    }

    const appointmentData = {
      userId,
      day: getCurrentDay(),
      date: selectedDateValue.format("MMM D"), // e.g., "Jan 1"
      fullDate: selectedDateValue.format("YYYY-MM-DD"), // Full date for backend
      time: timeSlots[selectedCard],
      type: selectedAppointmentType,
      doctorName: selectedDoctor.name,
      avatarSrc: selectedDoctor.image,
    };
    console.log(selectedDoctor,'hhhh');
    
    dispatch(addAppointment(appointmentData));

    axios
      .post("https://empolyee-backedn.onrender.com/api/appointments", appointmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const existingAppointments = JSON.parse(localStorage.getItem("appointmentData") || "[]");
        const apData = [...existingAppointments, appointmentData];
        localStorage.setItem("appointmentData", JSON.stringify(apData));
        message.success("Appointment confirmed successfully");
        onClose();
      })
      .catch((error) => {
        console.error("Error details:", error.response?.data || error.message);
        message.error("Failed to create appointment on server. Please check your authentication or try again.");
      });
  };

  React.useEffect(() => {
    setIsedit(isedit !== undefined ? isedit : true);
  }, [isedit]);

  return (
    <Drawer
      placement="right"
      width={510}
      height={1024}
      closable={false}
      onClose={onClose}
      open={isOpen}
      style={{ padding: 0, overflow: "hidden" }}
    >
      <div className="flex items-center justify-between border-b h-16 -mt-6">
        <div className="flex">
          <button
            className="text-gray-600 focus:outline-none"
            onClick={onClose}
          >
            <CloseCircleOutlined />
          </button>
          <h2 className="text-base font-semibold ml-2">Appointment Booking</h2>
        </div>
        <div className="flex items-center justify-center space-x-2 ">
          <button
            onClick={onClose}
            className="px-4 py-1 border rounded text-gray-600 border-gray-400 hover:bg-gray-200 focus:outline-none"
          >
            Cancel
          </button>
          <button
            className="px-4 py-1 bg-black text-white rounded hover:bg-gray-800 focus:outline-none"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>

      <div className="flex flex-col items-start p-4">
        <div className="flex flex-col items-start w-full">
          {selectedDoctor && (
            <div className="flex flex-col items-start py-2">
              <div className="flex">
                <Avatar
                  src={
                    <Image
                      src={selectedDoctor?.image}
                      alt={selectedDoctor?.name}
                      className="w-full h-full border-2 rounded-full"
                    />
                  }
                  style={{
                    width: "60px",
                    height: "60px",
                    marginRight: "1rem",
                  }}
                />
                <div>
                  <h3 className="text-lg font-bold text-black mt-2">
                    {selectedDoctor?.name}
                    
                    <span className="font-normal text-base">
                      ({selectedDoctor?.profession})
                    </span>
                  </h3>
                  <div className="flex flex-col items-start">
                    <p className="font-normal text-base leading-9 text-gray-500">
                      {selectedDoctor?.education}
                    </p>
                  </div>
                </div>
              </div>
              <button className="flex items-center justify-center ml-2 mt-2 gap-10 w-[95px] h-[24px] bg-white border border-gray-300 rounded shadow">
                View Profile
              </button>
              <div className="flex items-start gap-24 mt-5">
                <div className="flex flex-col items-start">
                  <p className="text-base leading-6 text-gray-500">
                    Available Hours
                  </p>
                  <div className="flex items-center">
                    <p className="font-medium text-xl leading-2">
                      {selectedDoctor?.available_hours}
                      {/* {selectedDoctor?.date} */}

                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-base text-gray-500">Experience</p>
                  <div className="flex items-center">
                    <p className="font-medium text-xl">
                      {selectedDoctor?.experience}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col items-start w-full mt-4">
            <p className="font-normal text-base leading-6 text-gray-400 mb-2">
              Appointment Type
            </p>
            <div className="flex items-start gap-2 w-full">
              <div
                className={`flex flex-col items-start gap-2 w-[215px] h-[96px] p-3 border ${
                  selectedAppointmentType === "Walk in"
                    ? "border-blue-500"
                    : "border-gray-200"
                } rounded`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    className="w-4 h-4 bg-white border border-gray-300 rounded-full"
                    name="appointmentType"
                    checked={selectedAppointmentType === "Walk in"}
                    onClick={() => handleAppointmentTypeChange("Walk in")}
                  />
                  <p className="font-medium text-base leading-6 text-black ml-3">
                    Walk in
                  </p>
                </div>
                <p className="font-normal text-xs leading-6 text-gray-500">
                  You will visit the doctor in person and get checked up.
                </p>
              </div>
              <div
                className={`flex flex-col items-start gap-2 p-3 w-[215px] h-[96px] ml-2 border ${
                  selectedAppointmentType === "Virtual"
                    ? "border-blue-500"
                    : "border-gray-200"
                } rounded`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    className="w-4 h-4 bg-white border border-gray-300 rounded-full"
                    name="appointmentType"
                    checked={selectedAppointmentType === "Virtual"}
                    onClick={() => handleAppointmentTypeChange("Virtual")}
                  />
                  <p className="font-medium text-base leading-6 text-black ml-3">
                    Virtual
                  </p>
                </div>
                <p className="font-normal text-xs leading-6 text-gray-500">
                  Schedule an appointment to chat with the doctor on call.
                </p>
              </div>
            </div>
          </div>
        </div>
        {Isedit && (
          <div
            style={{
              marginLeft: "2px",
              borderBottom: "2px solid black",
              paddingBottom: "6px",
              marginBottom: "5px",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center" }}
              className="mb-5"
            >
              <Checkbox id="option1" style={{ marginRight: "8px" }} />
              <Typography.Text strong className="text-xl">
                Mark as Checked in
              </Typography.Text>
            </div>
            <div
              style={{
                marginTop: "3px",
                width: "452px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  margin: "0 auto",
                }}
              >
                <div
                  style={{ marginRight: "10px" }}
                  className="flex flex-col"
                >
                  <Typography.Text>Time</Typography.Text>
                  <Typography.Text strong style={{ fontSize: "1.25rem" }}>
                    2:00 PM
                  </Typography.Text>
                </div>
                <div className="flex flex-col">
                  <Typography.Text>Date</Typography.Text>
                  <Typography.Text strong style={{ fontSize: "1.25rem" }}>
                    Feb 5, 2023
                  </Typography.Text>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "0 auto",
                  gap: "8px",
                }}
              >
                <Button onClick={handelcancel} type="default">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  style={{ background: "black" }}
                  onClick={handleReschedule}
                >
                  Reschedule
                </Button>
              </div>
            </div>
          </div>
        )}
        {!Isedit && (
          <div className="flex flex-col items-start w-full mt-4">
            <p className="font-normal text-base leading-6 text-gray-400 mb-2">
              Select Date
            </p>
            <Calendar
              fullscreen={false}
              disabledDate={disabledDate}
              value={selectedDateValue}
              onSelect={handleDateSelect}
              style={{ width: "100%", border: "1px solid #d9d9d9", borderRadius: "4px" }}
            />
          </div>
        )}
      </div>

      {!Isedit && (
        <div className="p-4 w-full">
          <p className="font-normal text-base leading-6 text-gray-400 mb-2">
            Select Time
          </p>
          <div className="grid grid-cols-3 gap-4">
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className={`flex items-center justify-center h-[44px] border border-gray-300 rounded cursor-pointer ${
                  selectedCard === index ? "bg-sky-200" : "bg-gray-200"
                }`}
                onClick={() => handleCardClick(index)}
              >
                <p className="text-sm font-medium text-black">{slot}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!Isedit && selectedDateValue && selectedCard !== null && (
        <Card className="w-[436px] py-2 border border-solid border-gray-300 rounded-md bg-[#FAFAFA] mx-4">
          <div className="flex">
            <div className="flex flex-col justify-center text-center px-4">
              <div className="text-base">
                {selectedDateValue?.format("MMM")}
              </div>
              <div className="text-3xl text-[#F05454]">
                {selectedDateValue?.format("D")}
              </div>
              <div className="text-sm">{getCurrentDay()}</div>
            </div>
            <div className="border-r-2 border-gray-300 mb-2 mt-2 ml-1"></div>

            <div className="flex flex-col ml-2">
              <div className="flex space-x-28">
                <div className="flex flex-col ml-2">
                  <div className="text-xs font-medium text-neutral-600">
                    Timing
                  </div>
                  <div className="text-lg font-normal text-neutral-800">
                    {timeSlots[selectedCard]}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="text-xs font-medium text-neutral-600">
                    Doctor
                  </div>
                  <div className="text-lg font-normal text-neutral-800">
                    {selectedDoctor ? selectedDoctor?.name : ""}
                  </div>
                </div>
              </div>
              <div className="border-b-2 border-gray-300 mb-2 mt-1"></div>
              <div className="flex justify-between m-0 space-x-28 ml-2">
                <div className="flex flex-col">
                  <div className="text-xs font-medium text-neutral-600">
                    Type
                  </div>
                  <div className="text-lg font-normal text-neutral-800 w-20">
                    {selectedAppointmentType}
                  </div>
                </div>

                <div className="flex items-center justify-center w-[107px] mr-2 cursor-pointer mt-2 bg-white h-[24px] border border-solid border-neutral-5 shadow-button-secondary rounded-md">
                  <div className="text-sm font-normal text-neutral-800">
                    Edit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
      {isCancelClicked && (
        <div className="flex flex-col items-start gap-4 p-4">
          <h3 className="text-lg font-medium">Cancellation Reason</h3>
          <div>
            <input
              className="w-5 h-5 mr-3"
              type="radio"
              id="option1"
              checked={selectedOption === "option1"}
              onChange={() => setSelectedOption("option1")}
            />
            <label htmlFor="option1">Patient is late</label>
          </div>
          <div>
            <input
              className="w-5 h-5 mr-3"
              type="radio"
              id="option2"
              checked={selectedOption === "option2"}
              onChange={() => setSelectedOption("option2")}
            />
            <label htmlFor="option2">Patient is a no-show</label>
          </div>
          <div>
            <input
              className="w-5 h-5 mr-3"
              type="radio"
              id="option3"
              checked={selectedOption === "option3"}
              onChange={() => setSelectedOption("option3")}
            />
            <label htmlFor="option3">Doctor is unavailable.</label>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default Sidebar;