import { useState, useEffect } from "react";
import { Spin, Typography, Alert, Button, Modal } from "antd";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";

interface Appointment {
  _id: string;
  date: string; // "Aug 12"
  time: string; // "09:00 AM"
  type: string;
  doctorName: string;
  patient: string;
  status?: string;
  avatarSrc?: string;
}

interface AppointmentCalendarProps {
  userId: string | null;
  userRole: string | null;
  selectedDoctor: string | null;
  currentMonth: string;
}

const timeSlots = Array.from({ length: 48 }, (_, i) =>
  dayjs().hour(8).minute(0).add(i * 15, "minute").format("HH:mm")
);

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  userId,
  userRole,
  selectedDoctor,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentTimePosition, setCurrentTimePosition] = useState<number>(0);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      let endpoint = "https://empolyee-backedn.onrender.com/api/appointments";
      const role = userRole;

      if (role === "admin" && selectedDoctor) {
        endpoint += `?doctorId=${selectedDoctor}`;
      } else if (role === "doctor" && userId) {
        endpoint += `?doctorId=${userId}`;
      } else if (role === "employee" && userId) {
        endpoint += `?userId=${userId}`;
      }

      try {
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const mapped = res.data.appointments.map((appt: any) => ({
          _id: appt._id,
          date: appt.date,
          time: appt.time,
          type: appt.type,
          doctorName: appt.doctorName,
          patient: appt.user?.name || "-",
          status: appt.status || "Scheduled",
          avatarSrc: appt.avatarSrc || "https://cdn-icons-png.flaticon.com/512/3675/3675805.png", // Default avatar if not available
        }));

        setAppointments(mapped);
      } catch (e: any) {
        setError(e?.message || "Error fetching appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId, userRole, selectedDoctor, selectedDate]);

  const parseDate = (dateStr: string) => {
    const [month, day] = dateStr.split(" ");
    const months: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    return dayjs().month(months[month]).date(parseInt(day, 10));
  };

  const getAppointmentsForSlot = (slot: string, date: Dayjs) =>
    appointments.filter(
      (appt) =>
        parseDate(appt.date).isSame(date, "day") &&
        appt.time.startsWith(slot)
    );

  const renderDayColumn = (date: Dayjs) => (
    <div className="flex flex-col flex-1 border-l relative">
      {timeSlots.map((slot) => {
        const appts = getAppointmentsForSlot(slot, date);
        return (
          <div key={slot} className="border-b h-20 relative p-1">
            {appts.map((appt) => (
              <div
                key={appt._id}
                className="bg-blue-500 text-white text-xs rounded-lg p-2 shadow-md cursor-pointer flex items-center"
                onClick={() => setSelectedAppointment(appt)}
                style={{ minHeight: '60px' }}
              >
                <img
                  src={appt.avatarSrc || 'https://cdn-icons-png.flaticon.com/512/3675/3675805.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-2"
                />
                <div className="flex-1">
                  <div className="font-bold">{userRole === "employee" ? appt.doctorName : appt.patient}</div>
                  <div>Type: {appt.type || 'Virtual'}</div>
                  <div>{appt.time}</div>
                </div>
                <div className="ml-auto">
                  <span className="bg-white text-blue-500 text-xs px-2 py-1 rounded">...</span>
                </div>
              </div>
            ))}
          </div>
        );
      })}
      {/* Red line for current time (only if today) */}
      {date.isSame(dayjs(), "day") && (
        <div
          className="absolute left-0 right-0 bg-red-500 h-0.5"
          style={{ top: `${currentTimePosition}px` }}
        />
      )}
    </div>
  );

  const renderWeekView = () => {
    const startOfWeek = selectedDate.startOf("week");
    const days = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));

    return (
      <div className="flex flex-row h-full">
        {/* Time Column */}
        <div className="w-20 border-r flex flex-col">
          {timeSlots.map((slot) => (
            <div key={slot} className="border-b h-20 flex items-center justify-center text-xs">
              {slot}
            </div>
          ))}
        </div>

        {/* Days Columns */}
        {days.map((day) => (
          <div key={day.format("YYYY-MM-DD")} className="flex-1">
            <div className="text-center font-bold border-b py-2 bg-gray-100">
              {day.format("ddd DD")}
            </div>
            {renderDayColumn(day)}
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => (
    <div className="flex">
      <div className="w-20 border-r flex flex-col">
        {timeSlots.map((slot) => (
          <div key={slot} className="border-b h-20 flex items-center justify-center text-xs">
            {slot}
          </div>
        ))}
      </div>
      {renderDayColumn(selectedDate)}
    </div>
  );

  // Update current time position every minute
  useEffect(() => {
    const updatePosition = () => {
      const startHour = 8;
      const now = dayjs();
      const minutesSinceStart = (now.hour() - startHour) * 60 + now.minute();
      setCurrentTimePosition((minutesSinceStart / 60) * 80); // 80px per hour
    };
    updatePosition();
    const interval = setInterval(updatePosition, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          {error && <Alert message={error} type="error" />}
          <div className="flex justify-between items-center mb-4">
            <Typography.Title level={3}>
              {selectedDate.format("MMMM YYYY")}
            </Typography.Title>
            <div className="flex gap-2">
              <Button onClick={() => setSelectedDate(selectedDate.subtract(1, "week"))}>
                Previous
              </Button>
              <Button onClick={() => setSelectedDate(selectedDate.add(1, "week"))}>
                Next
              </Button>
              <Button onClick={() => setViewMode("day")}>Day View</Button>
              <Button onClick={() => setViewMode("week")}>Week View</Button>
            </div>
          </div>
          {viewMode === "week" ? renderWeekView() : renderDayView()}

          {/* Appointment Details Modal */}
          <Modal
            open={!!selectedAppointment}
            onCancel={() => setSelectedAppointment(null)}
            footer={null}
            title="Appointment Details"
          >
            {selectedAppointment && (
              <div>
                <p><b>Time:</b> {selectedAppointment.time}</p>
                <p><b>Date:</b> {selectedAppointment.date}</p>
                <p><b>Doctor:</b> {selectedAppointment.doctorName}</p>
                <p><b>Patient:</b> {selectedAppointment.patient}</p>
                <p><b>Type:</b> {selectedAppointment.type}</p>
                <p><b>Status:</b> {selectedAppointment.status}</p>
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default AppointmentCalendar;