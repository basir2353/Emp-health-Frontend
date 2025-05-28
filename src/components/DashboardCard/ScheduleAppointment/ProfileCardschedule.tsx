import React, { useEffect, useState } from "react";
import { Image } from "antd";
import { useNavigate } from "react-router-dom";
import Maria from "../../../public/images/Maria.svg"; // fallback image
import axios from "axios";

interface Appointment {
  doctorName: string;
  avatarSrc?: string;
  id: string;
}

function ProfileCardschedule() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://e-health-backend-production.up.railway.app/api/appointments");
        const fetchedAppointments = response?.data?.appointments;
        setAppointments(Array.isArray(fetchedAppointments) ? fetchedAppointments : []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col items-start">
      <div className="text-xl ml-1 font-medium">Doctors</div>

      {loading && <div className="mt-5 text-blue-500">Loading...</div>}
      {error && <div className="mt-5 text-red-500">{error}</div>}

      {!loading && !error && (appointments?.length ?? 0) === 0 && (
        <div className="mt-5 text-gray-500">No doctors scheduled.</div>
      )}

      {!loading &&
        !error &&
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex flex-col items-start bg-white shadow-lg rounded-md px-2 py-2 mt-5 w-full"
          >
            <div className="flex items-center p-5">
              <div className="w-[60px] h-[60px] rounded-full overflow-hidden mr-3 border-2">
                <Image
                  src={appointment.avatarSrc || Maria}
                  alt={`Dr. ${appointment.doctorName}`}
                  className="object-cover w-full h-full"
                  fallback={Maria}
                  preview={false}
                />
              </div>
              <div className="flex flex-col items-start">
                <h3 className="text-lg font-bold text-black">
                  Dr. {appointment.doctorName}
                  <span className="font-normal text-base text-gray-600"> Doctor</span>
                </h3>
                <p className="font-normal text-base leading-9 text-gray-500">
                  M.B.B.S., F.C.P.S.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/health/schedule/${appointment.id}`)}
              className="flex items-center justify-center ml-5 gap-2 px-4 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded shadow hover:bg-gray-50 transition"
            >
              View Schedule
            </button>
          </div>
        ))}
    </div>
  );
}

export default ProfileCardschedule;
