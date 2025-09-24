import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService, AppointmentNotification } from '../services/notificationService';

interface UseNotificationManagerReturn {
  currentNotification: AppointmentNotification | null;
  isNotificationVisible: boolean;
  showNotification: (notification: AppointmentNotification) => void;
  hideNotification: () => void;
  startMonitoring: (appointments: any[], userRole: string, userName?: string) => void;
  stopMonitoring: () => void;
  handleJoinCall: (appointmentId: string) => void;
}

export const useNotificationManager = (): UseNotificationManagerReturn => {
  const navigate = useNavigate();
  const [currentNotification, setCurrentNotification] = useState<AppointmentNotification | null>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  // Handle notification callback
  const handleNotification = useCallback((notification: AppointmentNotification) => {
    setCurrentNotification(notification);
    setIsNotificationVisible(true);
  }, []);

  // Set up the notification callback
  useEffect(() => {
    notificationService.setNotificationCallback(handleNotification);
    
    return () => {
      notificationService.stopMonitoring();
    };
  }, [handleNotification]);

  const showNotification = useCallback((notification: AppointmentNotification) => {
    setCurrentNotification(notification);
    setIsNotificationVisible(true);
  }, []);

  const hideNotification = useCallback(() => {
    setIsNotificationVisible(false);
    setCurrentNotification(null);
  }, []);

  const startMonitoring = useCallback((appointments: any[], userRole: string, userName?: string) => {
    notificationService.startMonitoring(appointments, userRole, userName);
  }, []);

  const stopMonitoring = useCallback(() => {
    notificationService.stopMonitoring();
  }, []);

  // Handle join call action
  const handleJoinCall = useCallback((appointmentId: string) => {
    // Navigate to the call room - you might need to adjust this based on your routing
    navigate(`/call/${appointmentId}`);
  }, [navigate]);

  return {
    currentNotification,
    isNotificationVisible,
    showNotification,
    hideNotification,
    startMonitoring,
    stopMonitoring,
    handleJoinCall
  };
};
