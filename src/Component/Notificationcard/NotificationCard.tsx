import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CalendarDays, Clock, User2, X } from "lucide-react";

interface Appointment {
  _id: string;
  day: string;
  date: string;
  time: string;
  type: string;
  doctorName: string;
  avatarSrc: string;
  createdAt: string;
}

const NotificationCard: React.FC = () => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [closed, setClosed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestAppointment = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<{ appointments: Appointment[] }>(
          "https://empolyee-backedn.onrender.com/api/appointments/",
          {
            headers: {
              "x-auth-token": token || "",
            },
          }
        );

        const allAppointments = response.data.appointments;

        if (allAppointments.length > 0) {
          const latest = allAppointments.reduce((a, b) =>
            new Date(a.createdAt) > new Date(b.createdAt) ? a : b
          );
          setAppointment(latest);

          // Auto-close after 30 seconds
          setTimeout(() => {
            setClosed(true);
          }, 60000);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchLatestAppointment();
  }, []);

  if (closed || !appointment) return null;

  return (
    <div className="w-[360px] p-5 fixed top-20 right-6 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 transition-all">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          📅 New Appointment Booked
        </h3>
        <button onClick={() => setClosed(true)} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <User2 className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{appointment.doctorName}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-green-500" />
          <span>{appointment.date} ({appointment.day})</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-500" />
          <span>{appointment.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 border text-gray-700">
            {appointment.type}
          </span>
        </div>
      </div>

      <div className="mt-5 text-right">
        <button
          onClick={() => navigate("/health/admin-schedule-appointments")}
          className="bg-black text-white px-4 py-2 text-sm rounded-lg hover:bg-gray-800 transition"
        >
          View Appointment
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
