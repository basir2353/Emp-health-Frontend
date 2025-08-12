import { useState, useEffect } from 'react';
import { Calendar, Spin, Typography, Alert } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import axios from 'axios';



interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Appointment {
  _id: string;
  day: string;
  date: string;
  time: string;
  type: string;
  doctorName: string;
  avatarSrc?: string;
  user: User;
  createdAt: string;
  __v: number;
  doctorId: string;
  status?: string;
  patient: string;
}

interface AppointmentCalendarProps {
  userId: string | null;
  userRole: string | null;
  selectedDoctor: string | null;
  currentMonth: string;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ userId, userRole, selectedDoctor, currentMonth }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [doctorName, setDoctorName] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user") || localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("token");

    let role: string | null = null;
    let name: string | null = null;

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        role = parsedUser.role || null;
        name = parsedUser.name || null;
      } catch (e) {
        console.error("Error parsing user data from local storage:", e);
        setError("Failed to parse user data. Please log in again.");
      }
    }

    console.log("Local Storage - Role:", role, "Name:", name, "Token:", token);

    setUserName(name);

    const fetchAppointments = async () => {
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let endpoint = "https://empolyee-backedn.onrender.com/api/appointments";
        if (role === "admin" && selectedDoctor) {
          endpoint += `?doctorId=${selectedDoctor}`;
        } else if (role === "doctor" && userId) {
          endpoint += `?doctorId=${userId}`;
        } else if (role === "employee" && userId) {
          endpoint += `?userId=${userId}`;
        }

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);

        const fetchedAppointments = response?.data?.appointments;
        if (Array.isArray(fetchedAppointments)) {
          const mappedAppointments = fetchedAppointments.map((appt: any) => ({
            _id: appt._id,
            day: appt.day,
            date: appt.date,
            time: appt.time,
            type: appt.type,
            doctorName: appt.doctorName,
            avatarSrc: appt.avatarSrc || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            patient: appt.user?.name || "-",
            status: appt.status || "Scheduled",
            user: appt.user,
            createdAt: appt.createdAt,
            __v: appt.__v,
            doctorId: appt.doctorId,
          }));

          console.log("Mapped Appointments:", mappedAppointments);

          if (role === "admin") {
            console.log("Admin role detected: Displaying all appointments.");
            setAppointments(mappedAppointments);
          } else if (role === "doctor") {
            if (name) {
              const filteredAppointments = mappedAppointments.filter((appt: Appointment) =>
                appt.doctorName.toLowerCase().includes(name!.toLowerCase() || "")
              );
              console.log("Doctor role detected - Filtered Appointments:", filteredAppointments);
              setAppointments(filteredAppointments);
            } else {
              setAppointments([]);
              setError("User name not found for doctor role.");
            }
          } else if (role === "employee") {
            const filteredAppointments = mappedAppointments.filter((appt: Appointment) =>
              appt.user?._id === userId
            );
            setAppointments(filteredAppointments);
          } else {
            setAppointments([]);
            setError("Invalid role or user name not found.");
          }
        } else {
          setAppointments([]);
          setError("No appointments found in the response.");
        }
      } catch (err: any) {
        console.error("API Error:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    const fetchDoctorName = async () => {
      if (role === "doctor" && userId) {
        try {
          const response = await fetch("https://empolyee-backedn.onrender.com/api/all-doctors");
          if (!response.ok) throw new Error("Failed to fetch doctors");
          const data = await response.json();
          const doctor = data.doctors?.find((d: any) => d._id === userId);
          setDoctorName(doctor?.name || null);
        } catch (error) {
          setDoctorName(null);
        }
      } else if (role === "admin" && selectedDoctor) {
        try {
          const response = await fetch("https://empolyee-backedn.onrender.com/api/all-doctors");
          if (!response.ok) throw new Error("Failed to fetch doctors");
          const data = await response.json();
          const doctor = data.doctors?.find((d: any) => d._id === selectedDoctor);
          setDoctorName(doctor?.name || null);
        } catch (error) {
          setDoctorName(null);
        }
      } else {
        setDoctorName(null);
      }
    };

    fetchAppointments();
    fetchDoctorName();
  }, [userId, userRole, selectedDoctor]);

  const parseDate = (dateStr: string): { month: number; day: number } => {
    const [month, day] = dateStr.split(' ');
    const monthIndex: { [key: string]: number } = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    return { month: monthIndex[month], day: parseInt(day, 10) };
  };

  const getAppointmentsForDate = (date: Dayjs): Appointment[] => {
    return appointments.filter((appt) => {
      const { month, day } = parseDate(appt.date);
      return (
        date.month() === month &&
        date.date() === day &&
        date.year() === new Date().getFullYear()
      );
    });
  };

  const isPatientView = userRole === "employee";

  const dateCellRender = (value: Dayjs) => {
    const appts = getAppointmentsForDate(value);
    return (
      <div className="relative">
        {appts.length > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
        {appts.map((appt) => (
          <div key={appt._id} className="mb-1">
            <div className="bg-black text-white p-2 rounded-lg shadow-md items-center justify-between">
              <div>{appt.time}</div>
              <div className="font-bold">{isPatientView ? appt.doctorName : appt.patient}</div>
              <div className="text-xs text-gray-400">{appt.type}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const onSelect = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const renderAppointmentDetails = () => {
    const appts = getAppointmentsForDate(selectedDate);
    if (appts.length === 0) {
      return (
        <Typography.Text className="text-gray-500">
          No appointments on {selectedDate.format('MMMM D, YYYY')} for {isPatientView ? "you" : doctorName || "selected doctor"}.
        </Typography.Text>
      );
    }
    return appts.map((appt) => (
      <div
        key={appt._id}
        className="bg-gray-800 text-white rounded-lg p-3 mb-4 shadow-lg flex items-center justify-between"
        style={{ minWidth: '300px' }}
      >
        <div className="flex items-center">
          <img
            src={isPatientView ? appt.avatarSrc || "https://cdn-icons-png.flaticon.com/512/149/149071.png" : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt={`${isPatientView ? appt.doctorName : appt.patient} avatar`}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div className="font-semibold">{isPatientView ? appt.doctorName : appt.patient}</div>
            <div className="text-sm">Type: {appt.type}</div>
            <div className="text-sm">{appt.time}</div>
            <div className="text-sm">Status: {appt.status}</div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs">...</span>
        </div>
      </div>
    ));
  };

  return (
    <div className="w-full max-w-[95vw] mx-auto p-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading appointments..." />
        </div>
      ) : (
        <>
          {error && <Alert message={error} type="error" showIcon className="mb-4" />}
          <Typography.Title level={2} className="text-center mb-6 text-blue-600">
            {userRole === "admin" && selectedDoctor
              ? `Appointments for ${doctorName || "Selected Doctor"}`
              : userRole === "doctor"
              ? `Your Appointments (${doctorName || "You"})`
              : userRole === "employee"
              ? "My Appointments"
              : "Appointment Calendar"}
          </Typography.Title>
          <Calendar
            dateCellRender={dateCellRender}
            onSelect={onSelect}
            value={selectedDate}
            className="mb-6 rounded-lg shadow-md"
            fullscreen
            style={{ border: '2px solid #3b82f6', borderRadius: '8px' }}
            validRange={[dayjs(currentMonth, "MMMM").startOf("month"), dayjs(currentMonth, "MMMM").endOf("month")]}
          />
          <div>
            <Typography.Title level={4} className="mb-4 text-blue-600">
              Appointments for {selectedDate.format('MMMM D, YYYY')}
            </Typography.Title>
            {renderAppointmentDetails()}
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentCalendar;