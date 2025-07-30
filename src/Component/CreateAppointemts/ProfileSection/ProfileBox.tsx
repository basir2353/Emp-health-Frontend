import { MessageOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

const AddIcon = (
  <svg width="28" height="30" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Add your icon SVG content here */}
  </svg>
);

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Appointment {
  _id: string;
  doctorName: string;
  avatarSrc?: string;
  date: string;
  time: string;
  type: string;
  day: string;
  user: User;
  createdAt: string;
  __v: number;
}

// Real-time polling hook
const useLatestAppointment = (userId: string) => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAppointments = async () => {
      if (!userId) {
        setAppointment(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://empolyee-backedn.onrender.com/api/appointments?userId=${userId}`
        );
        const data = await response.json();

        if (isMounted) {
          const appointments: Appointment[] = data.appointments && Array.isArray(data.appointments) ? data.appointments : [];
          console.log("Fetched appointments:", appointments);

          // Set the first appointment (index [0]) or null if none
          const extractLatestAppointment = appointments[appointments.length - 1]
          setAppointment(extractLatestAppointment || null);
          console.log("Selected appointment:", extractLatestAppointment || null);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching appointments:", error);
          setAppointment(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAppointments();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { appointment, loading };
};

const ProfileBox = () => {
  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  let userParsed = JSON.parse(userData || "{}");
  // Assuming userId comes from parsed user data
  const userId = userParsed.id; // Adjust based on your user data structure
  const { appointment, loading } = useLatestAppointment(userId);

  if (loading) {
    return (
      <Card className="w-[390px] max-lg:w-auto h-[310px] mx-auto p-4 bg-black flex items-center justify-center">
        <Spin tip="Loading..." size="large" />
      </Card>
    );
  }

  if (!appointment) {
    return (
      <Card className="w-[390px] max-lg:w-auto h-[310px] mx-auto p-4 bg-black">
        <h3 className="text-white font-semibold text-xl">Upcoming Appointment</h3>
        <p className="text-white mt-10">No upcoming appointments.</p>
      </Card>
    );
  }

  return (
    <Card className="w-[390px] max-lg:w-auto h-[310px] mx-auto p-4 bg-black">
      <div className="flex flex-col items-start">
        <h3 className="text-white font-semibold text-xl">Upcoming Appointment</h3>

        <div className="flex items-center gap-1 mt-10">
          <Avatar size={64} src={appointment.avatarSrc} className="rounded-full" />
          <div>
            <span className="text-white font-medium text-sm">Doctor</span>
            <br />
            <span className="text-white font-semibold text-lg">{appointment.doctorName}</span>
          </div>
          <div className="ml-32 max-lg:ml-5">{AddIcon}</div>
        </div>

        <div className="flex flex-col gap-5 mt-5">
          <div className="flex items-start gap-24">
            <div className="flex flex-col">
              <span className="text-white">Date</span>
              <span className="text-white font-semibold text-xl">
                {format(
                  parse(appointment.date, "MMM d", new Date()),
                  "MMM d"
                )}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-white">Timing</span>
              <span className="text-white font-semibold text-xl">
                {format(
                  parse(`${appointment.date} ${appointment.time}`, "MMM d h:mm a", new Date()),
                  "h:mm a"
                )}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-20 max-lg:gap-0">
            <div className="flex flex-col">
              <div className="flex items-start bg-[#313131] shadow-lg rounded-sm w-[102px] max-lg:w-auto h-[40px] px-1 py-2">
                <span className="text-white font-satoshi font-normal text-base mr-1">Type:</span>
                <span className="text-white font-satoshi font-medium text-sm">{appointment.type}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <Button
                type="primary"
                onClick={() => navigate("/inbox/messages")}
                style={{
                  background: "white",
                  border: "1px solid #141414",
                  color: "black",
                  borderRadius: 4,
                  padding: "5px 20px",
                  height: "42px",
                }}
              >
                <MessageOutlined />
                Start Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileBox;