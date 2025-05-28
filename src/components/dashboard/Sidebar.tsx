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
} from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addAppointment } from "../../redux/appointments/appointmentSlice";
import axios from "axios";

interface SidebarProps {
  isedit: boolean;
  isOpen: boolean;
  onClose: () => void;
  selectedDoctor: Doctor | null;
}

interface Doctor {
  name: string;
  profession: string;
  education: string;
  image: string;
  available_hours: string;
  experience: string;
}

const datesAndMonths = [
  { date: "1", month: "Jan" },
  { date: "2", month: "Feb" },
  { date: "3", month: "Mar" },
  { date: "4", month: "Apr" },
  { date: "5", month: "May" },
  { date: "6", month: "Jun" },
  { date: "7", month: "Jul" },
  { date: "8", month: "Aug" },
  { date: "9", month: "Sep" },
  { date: "10", month: "Oct" },
  { date: "11", month: "Nov" },
  { date: "12", month: "Dec" },
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
}) => {
  const dispatch = useDispatch();
  const [startIndex, setStartIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedAppointmentType, setSelectedAppointmentType] =
    useState("Walk in");
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(
    null
  );
  const [Isedit, setIsedit] = useState(isedit);
  const [isCancelClicked, setIsCancelClicked] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const getCurrentDay = () => {
    if (selectedDateIndex === null) return "";
    // In a real app, we would calculate the actual day of the week
    // For this example, we're just returning Wednesday
    return days[3]; // Wednesday
  };

  const handleDateClick = (index: number) => {
    setSelectedDateIndex(index);
  };

  const handelcancel = () => {
    setIsCancelClicked(true);
    setIsedit(true);
  };

  const handleCardClick = (index: number) => {
    setSelectedCard(index);
  };

  const handleClickNext = () => {
    const newIndex = Math.min(startIndex + 5, datesAndMonths.length - 5);
    setStartIndex(newIndex);
  };

  const handleClickPrev = () => {
    const newIndex = Math.max(startIndex - 5, 0);
    setStartIndex(newIndex);
  };

  const handleAppointmentTypeChange = (type: string) => {
    setSelectedAppointmentType(type);
  };

  const handleReschedule = () => {
    setIsedit(false);
    setIsCancelClicked(false);
  };

  const handleConfirm = () => {
    if (
      selectedDateIndex === null ||
      selectedCard === null ||
      !selectedDoctor
    ) {
      message.error("Please select date, time and doctor for the appointment");
      return;
    }

    // Create appointment data object
    // Get userId from localStorage user object
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id || null;

    const appointmentData = {
      userId,
      day: getCurrentDay(),
      date: `${datesAndMonths[selectedDateIndex].month} ${datesAndMonths[selectedDateIndex].date}`,
      time: timeSlots[selectedCard],
      type: selectedAppointmentType,
      doctorName: selectedDoctor.name,
      avatarSrc: selectedDoctor.image,
    };

    dispatch(addAppointment(appointmentData));
    // Post appointment to backend
    axios.post("/api/appointments", appointmentData)
      .then(() => {
      // Optionally handle success
      })
      .catch((error) => {
      message.error("Failed to create appointment on server");
      });
    const existingAppointments = JSON.parse(localStorage.getItem("appointmentData") || "[]");
    const apData = [...existingAppointments, appointmentData];
    localStorage.setItem("appointmentData", JSON.stringify(apData));

    message.success("Appointment confirmed successfully");

    onClose();
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

      <div className="flex flex-col items-start ">
        <div className="flex flex-col items-start ">
          <div className="flex flex-col items-start  ">
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
          </div>
          <div className="flex flex-col items-start w-452 h-126">
            <p className="font-normal text-base leading-6 text-gray-400 mb-2 mt-2">
              Appointment Type
            </p>
            <div className="flex items-start gap-2 w-[452px] h-[126px]">
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
        {isedit && (
          <>
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
          </>
        )}
        {!Isedit && (
          <div className="flex flex-row items-center justify-between gap-4 w-[452px] h-[46px] ">
            <div
              className="text-black flex justify-center items-center w-6 h-6 rounded-full bg-transparent border border-black cursor-pointer"
              onClick={handleClickPrev}
            >
              <ArrowLeftOutlined />
            </div>

            <div className="flex flex-row items-center gap-8">
              {datesAndMonths
                .slice(startIndex, startIndex + 5)
                .map((item, index) => (
                  <div
                    key={index}
                    className={`w-[36px] h-auto flex gap-1 cursor-pointer ${
                      selectedDateIndex === startIndex + index
                        ? "border-b-2 border-black"
                        : ""
                    }`}
                    onClick={() => handleDateClick(startIndex + index)}
                  >
                    <p className="font-medium text-base text-black mb-1">
                      {item?.month}
                    </p>
                    <p className="font-medium text-base text-gray-500">
                      {item?.date}
                    </p>
                  </div>
                ))}
            </div>

            <div
              className="text-black flex justify-center items-center w-6 h-6 rounded-full bg-transparent border border-black cursor-pointer"
              onClick={handleClickNext}
            >
              <ArrowRightOutlined />
            </div>
          </div>
        )}
      </div>

      {!Isedit && (
        <div className="p-4 w-full">
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

      {!Isedit && selectedDateIndex !== null && selectedCard !== null && (
        <Card className="w-[436px] py-2 border border-solid border-gray-300 rounded-md bg-[#FAFAFA]">
          <div className="flex">
            <div className="flex flex-col justify-center text-center px-4">
              <div className="text-base">
                {datesAndMonths[selectedDateIndex]?.month}
              </div>
              <div className="text-3xl text-[#F05454] ">
                {datesAndMonths[selectedDateIndex]?.date}
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
        <div className="flex flex-col items-start gap-4">
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
