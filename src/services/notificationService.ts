import dayjs from 'dayjs';

export interface AppointmentNotification {
  id: string;
  appointmentId: string;
  title: string;
  message: string;
  type: 'virtual_appointment_reminder';
  appointmentTime: string;
  doctorName: string;
  patientName: string;
  appointmentType: string;
  isVirtual: boolean;
  timeUntilAppointment: number; // in minutes
}

export interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  reminderMinutes: number; // default 5 minutes
}

class NotificationService {
  private notificationSettings: NotificationSettings = {
    enabled: true,
    soundEnabled: true,
    reminderMinutes: 5
  };

  private checkInterval: NodeJS.Timeout | null = null;
  private notifications: Map<string, AppointmentNotification> = new Map();
  private onNotificationCallback: ((notification: AppointmentNotification) => void) | null = null;

  constructor() {
    this.loadSettings();
    this.requestNotificationPermission();
  }

  private loadSettings() {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      this.notificationSettings = { ...this.notificationSettings, ...JSON.parse(saved) };
    }
  }

  private saveSettings() {
    localStorage.setItem('notificationSettings', JSON.stringify(this.notificationSettings));
  }

  private async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  // Update settings
  updateSettings(settings: Partial<NotificationSettings>) {
    this.notificationSettings = { ...this.notificationSettings, ...settings };
    this.saveSettings();
  }

  getSettings(): NotificationSettings {
    return { ...this.notificationSettings };
  }

  // Start monitoring appointments for notifications
  startMonitoring(appointments: any[], userRole: string, userName?: string) {
    this.stopMonitoring();
    
    if (!this.notificationSettings.enabled) return;

    // Filter for virtual appointments only
    const virtualAppointments = appointments.filter(apt => 
      apt.type === 'Virtual' && apt.status !== 'Cancelled'
    );

    // Set up notifications for each virtual appointment
    virtualAppointments.forEach(appointment => {
      this.scheduleNotification(appointment, userRole, userName);
    });

    // Check every minute for upcoming appointments
    this.checkInterval = setInterval(() => {
      this.checkUpcomingAppointments(virtualAppointments, userRole, userName);
    }, 60000); // Check every minute
  }

  private scheduleNotification(appointment: any, userRole: string, userName?: string) {
    try {
      const appointmentTime = this.parseAppointmentTime(appointment);
      if (!appointmentTime) return;

      const now = dayjs();
      const timeUntilAppointment = appointmentTime.diff(now, 'minute');
      
      // Only schedule if appointment is in the future and within our monitoring window
      if (timeUntilAppointment > 0 && timeUntilAppointment <= 60) { // Monitor next 60 minutes
        const notificationId = `appointment_${appointment._id}_${userRole}`;
        
        const notification: AppointmentNotification = {
          id: notificationId,
          appointmentId: appointment._id,
          title: this.getNotificationTitle(userRole),
          message: this.getNotificationMessage(appointment, userRole, userName),
          type: 'virtual_appointment_reminder',
          appointmentTime: appointment.time,
          doctorName: appointment.doctorName,
          patientName: appointment.patient || appointment.user?.name || 'Unknown',
          appointmentType: appointment.type,
          isVirtual: appointment.type === 'Virtual',
          timeUntilAppointment
        };

        this.notifications.set(notificationId, notification);
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  private checkUpcomingAppointments(appointments: any[], userRole: string, userName?: string) {
    const now = dayjs();
    
    this.notifications.forEach((notification, notificationId) => {
      const appointmentTime = this.parseAppointmentTime(
        appointments.find(apt => apt._id === notification.appointmentId)
      );
      
      if (!appointmentTime) return;

      const timeUntilAppointment = appointmentTime.diff(now, 'minute');
      
      // Check if it's time to show the notification (5 minutes before)
      if (timeUntilAppointment <= this.notificationSettings.reminderMinutes && 
          timeUntilAppointment > 0 && 
          !notification.id.includes('_shown')) {
        
        this.showNotification(notification);
        this.notifications.delete(notificationId);
      }
    });
  }

  private parseAppointmentTime(appointment: any): dayjs.Dayjs | null {
    if (!appointment) return null;

    try {
      // Handle different date formats
      let appointmentDate: dayjs.Dayjs;
      
      if (appointment.fullDate) {
        // Format: YYYY-MM-DD
        appointmentDate = dayjs(appointment.fullDate);
      } else if (appointment.date) {
        // Format: MMM D (e.g., "Aug 5")
        const currentYear = dayjs().year();
        appointmentDate = dayjs(`${appointment.date} ${currentYear}`, 'MMM D YYYY');
        
        // If the date is in the past, assume it's next year
        if (appointmentDate.isBefore(dayjs())) {
          appointmentDate = appointmentDate.add(1, 'year');
        }
      } else {
        return null;
      }

      // Parse time (format: "HH:mm" or "H:mm A")
      let timeStr = appointment.time;
      if (timeStr.includes('AM') || timeStr.includes('PM')) {
        return dayjs(`${appointmentDate.format('YYYY-MM-DD')} ${timeStr}`, 'YYYY-MM-DD h:mm A');
      } else {
        return dayjs(`${appointmentDate.format('YYYY-MM-DD')} ${timeStr}`, 'YYYY-MM-DD HH:mm');
      }
    } catch (error) {
      console.error('Error parsing appointment time:', error);
      return null;
    }
  }

  private getNotificationTitle(userRole: string): string {
    switch (userRole) {
      case 'doctor':
        return 'Upcoming Virtual Appointment';
      case 'employee':
      case 'user':
        return 'Virtual Appointment Reminder';
      default:
        return 'Appointment Notification';
    }
  }

  private getNotificationMessage(appointment: any, userRole: string, userName?: string): string {
    const timeStr = appointment.time;
    
    switch (userRole) {
      case 'doctor':
        return `You have a virtual appointment with ${appointment.patient || appointment.user?.name || 'a patient'} in ${this.notificationSettings.reminderMinutes} minutes at ${timeStr}`;
      case 'employee':
      case 'user':
        return `You have a virtual appointment with Dr. ${appointment.doctorName} in ${this.notificationSettings.reminderMinutes} minutes at ${timeStr}`;
      default:
        return `Virtual appointment reminder: ${timeStr}`;
    }
  }

  private showNotification(notification: AppointmentNotification) {
    // Show browser notification if permission is granted
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
        requireInteraction: true
      });

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
      };

      // Auto close after 10 seconds
      setTimeout(() => browserNotification.close(), 10000);
    }

    // Play sound if enabled
    if (this.notificationSettings.soundEnabled) {
      this.playNotificationSound();
    }

    // Call the callback to show in-app notification
    if (this.onNotificationCallback) {
      this.onNotificationCallback(notification);
    }
  }

  private playNotificationSound() {
    try {
      // Create a simple notification sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a pleasant notification sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }

  // Set callback for in-app notifications
  setNotificationCallback(callback: (notification: AppointmentNotification) => void) {
    this.onNotificationCallback = callback;
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.notifications.clear();
  }

  // Manual notification trigger (for testing)
  triggerTestNotification(userRole: string) {
    const testNotification: AppointmentNotification = {
      id: 'test_notification',
      appointmentId: 'test',
      title: this.getNotificationTitle(userRole),
      message: `Test notification for ${userRole} - You have a virtual appointment in 5 minutes`,
      type: 'virtual_appointment_reminder',
      appointmentTime: dayjs().add(5, 'minute').format('HH:mm'),
      doctorName: 'Dr. Test',
      patientName: 'Test Patient',
      appointmentType: 'Virtual',
      isVirtual: true,
      timeUntilAppointment: 5
    };

    this.showNotification(testNotification);
  }
}

// Create singleton instance
export const notificationService = new NotificationService();
export default notificationService;
