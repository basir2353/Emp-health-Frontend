import { MessageOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import axios from "axios";

const AddIcon = (
  <svg width="28" height="30" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Add your icon SVG content here */}
  </svg>
);

interface Appointment {
  _id: string;
  doctorName: string;
  avatarSrc?: string;
  date: string;
  time: string;
  type: string;
}

// Real-time polling hook
const useAppointments = (userId?: string) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const params = userId ? { userId } : {};
        const res = await axios.get("https://empolyee-backedn.onrender.com/api/appointments", { params });
        if (isMounted) {
          setAppointments(res.data.appointments || []);
        }
      } catch {
        if (isMounted) setAppointments([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAppointments();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { appointments, loading };
};

const ProfileBox = () => {
  const navigate = useNavigate();
  const { appointments, loading } = useAppointments();

  // Get the closest upcoming appointment
  const upcoming = appointments.length > 0 ? appointments[0] : null;

  if (loading) {
    return (
      <Card className="w-[390px] max-lg:w-auto h-[310px] mx-auto p-4 bg-black flex items-center justify-center">
        <Spin tip="Loading..." size="large" />
      </Card>
    );
  }

  if (!upcoming) {
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
          <Avatar size={64} src={upcoming.avatarSrc} className="rounded-full" />
          <div>
            <span className="text-white font-medium text-sm">Doctor</span>
            <br />
            <span className="text-white font-semibold text-lg">{upcoming.doctorName}</span>
          </div>
          <div className="ml-32 max-lg:ml-5">{AddIcon}</div>
        </div>

        <div className="flex flex-col gap-5 mt-5">
          <div className="flex items-start gap-24">
            <div className="flex flex-col">
              <span className="text-white">Date</span>
              <span className="text-white font-semibold text-xl">
                {format(new Date(upcoming.date), "MMM dd")}
              </span>
            </div>
            {/* <div className="flex flex-col">
              <span className="text-white">Timing</span>
              <span className="text-white font-semibold text-xl">
                {format(new Date(`${upcoming.date}T${upcoming.time}`), "h:mm a")}
              </span>
            </div> */}
          </div>

          <div className="flex items-start gap-20 max-lg:gap-0">
            <div className="flex flex-col">
              <div className="flex items-start bg-[#313131] shadow-lg rounded-sm w-[102px] max-lg:w-auto h-[40px] px-1 py-2">
                <span className="text-white font-satoshi font-normal text-base mr-1">Type:</span>
                <span className="text-white font-satoshi font-medium text-sm">{upcoming.type}</span>
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
