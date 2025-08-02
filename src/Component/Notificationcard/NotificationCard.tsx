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
  userId?: string; // Make userId optional in case API doesn't return it
}

const NotificationCard: React.FC = () => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [closed, setClosed] = useState(false);
  const [error, setError] = useState<string | null>(null); // Added for error tracking
  const navigate = useNavigate();

  // Get userId from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  useEffect(() => {
    const fetchLatestAppointment = async () => {
      if (!userId) {
        console.log("No userId found in localStorage");
        setError("No user logged in");
        return;
      }

      try {
        const token = localStorage.getItem("token_real");
        console.log("Fetching appointments with userId:", userId, "and token:", token);

        const response = await axios.get<{ appointments: Appointment[] }>(
          "https://empolyee-backedn.onrender.com/api/appointments", // Fixed typo in URL
          {
            headers: {
              "x-auth-token": token || "",
            },
            params: { userId },
          }
        );

        const userAppointments = response.data.appointments;
        console.log("API response appointments:", userAppointments);

        if (userAppointments.length > 0) {
          // Find the latest appointment
          const latest = userAppointments.reduce((a, b) =>
            new Date(a.createdAt) > new Date(b.createdAt) ? a : b
          );
          console.log("Latest appointment:", latest);

          // Temporarily skip recency check for debugging
          setAppointment(latest);

          // Auto-close after 60 seconds
          setTimeout(() => {
            console.log("Auto-closing notification");
            setClosed(true);
          }, 60000);
        } else {
          console.log("No appointments found for user");
          setError("No appointments found");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to fetch appointments");
      }
    };

    fetchLatestAppointment();
  }, [userId]);

  // Render nothing if closed, no appointment, or error
  if (closed || !appointment) {
    console.log("Not rendering - closed:", closed, "appointment:", appointment, "error:", error);
    return null;
  }

  return (
    <div className="w-[360px] p-5 fixed top-20 right-6 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 transition-all">
      {error && <div className="text-red-500 mb-2">{error}</div>}
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