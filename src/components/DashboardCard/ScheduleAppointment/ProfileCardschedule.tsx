import React, { useEffect, useState } from "react";
import { Image } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Maria from "../../../public/images/Maria.svg"; // Fallback image

interface Appointment {
  _id: string;
  doctorName: string;
  avatarSrc?: string;
}

const ProfileCardschedule: React.FC = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user data from local storage (try 'user' or 'loggedInUser')
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

    setUserRole(role);
    setUserName(name);

    const fetchAppointments = async () => {
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          "https://empolyee-backedn.onrender.com/api/appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);

        const fetchedAppointments = response?.data?.appointments;
        if (Array.isArray(fetchedAppointments)) {
          // Extract unique doctors
          const doctorMap = new Map<string, Appointment>();
          fetchedAppointments.forEach((appt: any) => {
            if (!doctorMap.has(appt.doctorName)) {
              doctorMap.set(appt.doctorName, {
                _id: appt._id,
                doctorName: appt.doctorName,
                avatarSrc: appt.avatarSrc,
              });
            }
          });

          const uniqueDoctors = Array.from(doctorMap.values());
          console.log("Unique Doctors:", uniqueDoctors);

          // Filter doctors based on user role
          if (role === "admin") {
            console.log("Admin role detected: Displaying all doctors.");
            setDoctors(uniqueDoctors);
          } else if (role === "doctor") {
            if (name) {
              const filteredDoctors = uniqueDoctors.filter((doctor) =>
                doctor.doctorName.toLowerCase().includes(name!.toLowerCase())
              );
              console.log("Doctor role detected - Filtered Doctors:", filteredDoctors);
              setDoctors(filteredDoctors);
            } else {
              setDoctors([]);
              setError("User name not found for doctor role.");
            }
          } else {
            setDoctors([]);
            setError("Invalid role or user name not found.");
          }
        } else {
          setDoctors([]);
          setError("No appointments found in the response.");
        }
      } catch (err: any) {
        console.error("API Error:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col items-start p-4 max-w-md w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Doctors</h2>

      {loading && <div className="mt-4 text-blue-600">Loading doctors...</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}

      {!loading && !error && doctors.length === 0 && (
        <div className="mt-4 text-gray-500">No doctors scheduled.</div>
      )}

      {!loading && !error && (
        <div className="space-y-4 w-full">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="flex flex-col items-start bg-white shadow-lg rounded-xl p-4 border-l-4 border-blue-500 hover:shadow-xl hover:scale-105 transition-transform duration-200"
            >
              <div className="flex items-center w-full max-lg:flex-col">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-blue-200 ring-2 ring-blue-300">
                  <Image
                    src={doctor.avatarSrc || Maria}
                    alt={`Dr. ${doctor.doctorName}`}
                    className="object-cover w-full h-full"
                    fallback={Maria}
                    preview={false}
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-800">
                    Dr. {doctor.doctorName}
                    <span className="font-normal text-base text-gray-500 ml-2">Doctor</span>
                  </h3>
                  <p className="text-sm text-gray-600">M.B.B.S., F.C.P.S.</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/health/doctor/${doctor._id}`)}
                className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors duration-200 shadow-md w-full text-center"
              >
                View Schedule
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileCardschedule;