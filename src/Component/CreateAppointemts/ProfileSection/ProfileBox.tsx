import { MessageOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Spin, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { format, parse, isValid } from "date-fns";
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

// Normalize date format (e.g., "Aug 5" to "Aug 5")
const normalizeDateFormat = (date: string, year: number = new Date().getFullYear()): string => {
  if (!date) return "N/A";
  try {
    const parsedDate = parse(`${date}`, "MMM d", new Date(year));
    if (isValid(parsedDate)) {
      return format(parsedDate, "MMM d");
    }
    // Try parsing as a full date if already in a different format
    const fallbackDate = parse(date, "yyyy-MM-dd", new Date());
    if (isValid(fallbackDate)) {
      return format(fallbackDate, "MMM d");
    }
    return "N/A";
  } catch {
    return "N/A";
  }
};

// Normalize time format (e.g., "10:00 AM" or "10:00 - 11:00" to "10:00 AM")
const normalizeTimeFormat = (time: string): string => {
  if (!time) return "N/A";
  try {
    // Handle "10:00 AM" format
    if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(time)) {
      const parsedTime = parse(time, "h:mm a", new Date());
      if (isValid(parsedTime)) {
        return format(parsedTime, "h:mm a");
      }
    }
    // Handle "10:00 - 11:00" format
    if (/^\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/.test(time)) {
      const [start] = time.split("-").map(t => t.trim());
      const parsedTime = parse(start, "H:mm", new Date());
      if (isValid(parsedTime)) {
        return format(parsedTime, "h:mm a");
      }
    }
    // Handle "10-12" format
    if (/^\d{1,2}-\d{1,2}$/.test(time)) {
      const [start] = time.split("-").map(t => t.trim());
      const parsedTime = parse(`${start}:00`, "H:mm", new Date());
      if (isValid(parsedTime)) {
        return format(parsedTime, "h:mm a");
      }
    }
    return "N/A";
  } catch {
    return "N/A";
  }
};

// Combine and normalize date and time for parsing
const normalizeDateTime = (date: string, time: string, year: number = new Date().getFullYear()): string => {
  const normalizedDate = normalizeDateFormat(date, year);
  const normalizedTime = normalizeTimeFormat(time);
  if (normalizedDate === "N/A" || normalizedTime === "N/A") {
    return "N/A";
  }
  try {
    const dateTimeStr = `${normalizedDate} ${normalizedTime}`;
    const parsedDateTime = parse(dateTimeStr, "MMM d h:mm a", new Date());
    if (isValid(parsedDateTime)) {
      return format(parsedDateTime, "h:mm a");
    }
    return "N/A";
  } catch {
    return "N/A";
  }
};

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
          `http://localhost:5000/api/appointments?userId=${userId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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

  // Normalize date and time
  const displayDate = normalizeDateFormat(appointment.date);
  const displayTime = normalizeDateTime(appointment.date, appointment.time);

  return (
    <Card className="w-full max-w-[450px] mx-auto p-8 bg-black text-white">
      <Title level={4} className="text-white mb-4">
        Upcoming Appointment
      </Title>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Avatar
            size={{ xs: 48, sm: 64 }}
            src={appointment.avatarSrc || "https://cdn-icons-png.flaticon.com/512/3675/3675805.png"}
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
              {displayDate}
            </Text>
          </div>
          <div>
            <Text className="text-white text-sm">Timing</Text>
            <Text className="text-white font-semibold text-lg block">
              {displayTime}
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