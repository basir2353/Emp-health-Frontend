import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNotificationManager } from '../../hooks/useNotificationManager';
import NotificationModal from './NotificationModal';
import axios from 'axios';

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    currentNotification,
    isNotificationVisible,
    hideNotification,
    startMonitoring,
    stopMonitoring,
    handleJoinCall
  } = useNotificationManager();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Get user info from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user") || localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("token");

    if (userStr && token) {
      try {
        const parsedUser = JSON.parse(userStr);
        setUserRole(parsedUser.role || null);
        setUserName(parsedUser.name || null);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  // Fetch appointments when user role is available
  useEffect(() => {
    if (!userRole) return;

    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(
          "http://empolyee-backedn.onrender.com/api/appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedAppointments = response?.data?.appointments;
        if (Array.isArray(fetchedAppointments)) {
          const mappedAppointments = fetchedAppointments.map((appt: any) => ({
            _id: appt._id,
            day: appt.day,
            date: appt.date,
            time: appt.time,
            type: appt.type,
            doctorName: appt.doctorName,
            patient: appt.user?.name || "-",
            status: appt.status || "Scheduled",
            fullDate: appt.fullDate,
            user: appt.user
          }));

          // Filter appointments based on user role
          let filteredAppointments = mappedAppointments;
          if (userRole === "doctor" && userName) {
            filteredAppointments = mappedAppointments.filter((appt: any) =>
              appt.doctorName.toLowerCase().includes(userName.toLowerCase())
            );
          } else if (userRole === "employee") {
            // For employees, show their own appointments
            const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
            filteredAppointments = mappedAppointments.filter((appt: any) =>
              appt.user?._id === userId || appt.userId === userId
            );
          }

          setAppointments(filteredAppointments);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();

    // Set up interval to refresh appointments every 5 minutes
    const interval = setInterval(fetchAppointments, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userRole, userName]);

  // Start/stop monitoring based on appointments and user role
  useEffect(() => {
    if (appointments.length > 0 && userRole && !isMonitoring) {
      startMonitoring(appointments, userRole, userName || undefined);
      setIsMonitoring(true);
    } else if (appointments.length === 0 && isMonitoring) {
      stopMonitoring();
      setIsMonitoring(false);
    }

    return () => {
      if (isMonitoring) {
        stopMonitoring();
        setIsMonitoring(false);
      }
    };
  }, [appointments, userRole, userName, isMonitoring, startMonitoring, stopMonitoring]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return (
    <>
      {children}
      <NotificationModal
        notification={currentNotification}
        visible={isNotificationVisible}
        onClose={hideNotification}
        onJoinCall={handleJoinCall}
      />
    </>
  );
};

export default NotificationProvider;
