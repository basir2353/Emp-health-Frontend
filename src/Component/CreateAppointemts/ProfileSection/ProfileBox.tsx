import { MessageOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Spin, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { useEffect, useState } from "react";

const { Text, Title } = Typography;

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
          const appointments: Appointment[] =
            data.appointments && Array.isArray(data.appointments)
              ? data.appointments
              : [];
          console.log("Fetched appointments:", appointments);

          const extractLatestAppointment = appointments[appointments.length - 1];
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
  const userParsed = JSON.parse(userData || "{}");
  const userId = userParsed.id;
  const { appointment, loading } = useLatestAppointment(userId);

  if (loading) {
    return (
      <Card className="w-full max-w-[450px] mx-auto p-8 bg-black text-white">
        <div className="flex items-center justify-center h-[200px]">
          <Spin tip="Loading..." size="large" />
        </div>
      </Card>
    );
  }

  if (!appointment) {
    return (
      <Card className="w-full max-w-[450px] mx-auto p-8 bg-black text-white">
        <Title level={4} className="text-white mb-4">
          Upcoming Appointment
        </Title>
        <Text className="text-white">No upcoming appointments.</Text>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-[450px] mx-auto p-8 bg-black text-white">
      <Title level={4} className="text-white mb-4">
        Upcoming Appointment
      </Title>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Avatar
            size={{ xs: 48, sm: 64 }}
            src={appointment.avatarSrc}
            className="rounded-full"
          />
          <div>
            <Text className="text-white text-sm">Doctor</Text>
            <Text className="text-white font-semibold text-lg block">
              {appointment.doctorName}
            </Text>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">
          <div>
            <Text className="text-white text-sm">Date</Text>
            <Text className="text-white font-semibold text-lg block">
              {format(parse(appointment.date, "MMM d", new Date()), "MMM d")}
            </Text>
          </div>
          <div>
            <Text className="text-white text-sm">Timing</Text>
            <Text className="text-white font-semibold text-lg block">
              {format(
                parse(
                  `${appointment.date} ${appointment.time}`,
                  "MMM d h:mm a",
                  new Date()
                ),
                "h:mm a"
              )}
            </Text>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">
          <div className="flex items-center bg-[#313131] rounded-sm px-3 py-1">
            <Text className="text-white text-sm mr-2">Type:</Text>
            <Text className="text-white font-medium text-sm">
              {appointment.type}
            </Text>
          </div>
          <Button
            type="primary"
            onClick={() => navigate("/inbox/messages")}
            className="w-full sm:w-auto"
            style={{
              background: "white",
              border: "1px solid #141414",
              color: "black",
              borderRadius: 4,
              padding: "0 24px",
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MessageOutlined style={{ marginRight: 8 }} />
            Start Appointment
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileBox;