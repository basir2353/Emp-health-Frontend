# Virtual Appointment Notification System

This document describes the notification system implemented for virtual appointments in the healthcare application.

## Features

### 🎯 Core Functionality
- **5-minute advance notifications** for virtual appointments only
- **Sound notifications** with customizable audio alerts
- **Browser notifications** with permission handling
- **In-app modal notifications** with appointment details
- **Role-based messaging** (different messages for doctors vs patients)
- **Join call functionality** directly from notifications

### 🔧 Components

#### 1. Notification Service (`src/services/notificationService.ts`)
- **Main service class** that manages all notification logic
- **Appointment monitoring** with automatic scheduling
- **Sound generation** using Web Audio API
- **Browser notification handling** with permission requests
- **Settings management** with localStorage persistence

#### 2. Notification Modal (`src/components/Notification/NotificationModal.tsx`)
- **Beautiful UI** for displaying appointment reminders
- **Real-time countdown** showing time until appointment
- **Join call button** that appears 5 minutes before appointment
- **Appointment details** including doctor/patient names and time

#### 3. Notification Settings (`src/components/Notification/NotificationSettings.tsx`)
- **Toggle notifications** on/off
- **Sound settings** with enable/disable option
- **Reminder time** customization (1-60 minutes)
- **Test notification** functionality

#### 4. Notification Provider (`src/components/Notification/NotificationProvider.tsx`)
- **Global notification management** integrated into App.tsx
- **Automatic appointment fetching** and monitoring
- **Role-based filtering** for different user types
- **Real-time updates** every 5 minutes

#### 5. Custom Hook (`src/hooks/useNotificationManager.ts`)
- **Reusable hook** for notification management
- **State management** for notification visibility
- **Navigation handling** for join call functionality

## How It Works

### 1. Appointment Detection
- The system monitors all appointments fetched from the API
- Filters for **virtual appointments only** (type: "Virtual")
- Excludes cancelled appointments

### 2. Notification Scheduling
- Calculates time until appointment for each virtual appointment
- Schedules notifications for appointments within the next 60 minutes
- Shows notification exactly **5 minutes before** appointment time

### 3. Notification Display
- **Browser notification** appears if permission is granted
- **In-app modal** shows with appointment details
- **Sound plays** if enabled in settings
- **Join call button** appears when appointment is starting

### 4. User Experience
- **Doctors see**: "You have a virtual appointment with [Patient Name] in 5 minutes"
- **Patients see**: "You have a virtual appointment with Dr. [Doctor Name] in 5 minutes"
- **Join call button** navigates to video call interface

## Integration

### App.tsx Integration
```tsx
<Router>
  <NotificationProvider>
    <Routes>
      {/* All your existing routes */}
    </Routes>
  </NotificationProvider>
</Router>
```

### Notification Page
The notification page now includes:
- **Settings panel** for configuring notifications
- **Test functionality** for verifying the system
- **Recent notifications** display

## Configuration

### Default Settings
- **Notifications**: Enabled
- **Sound**: Enabled  
- **Reminder time**: 5 minutes
- **Monitoring window**: 60 minutes ahead

### Customization
Users can modify settings through the notification settings panel:
- Toggle notifications on/off
- Enable/disable sound
- Adjust reminder time (1-60 minutes)

## Browser Compatibility

### Required Features
- **Web Audio API** for sound generation
- **Notification API** for browser notifications
- **localStorage** for settings persistence

### Fallbacks
- If Web Audio API is unavailable, notifications still work without sound
- If Notification API is unavailable, only in-app notifications are shown
- Settings are gracefully handled with localStorage fallbacks

## Testing

### Test Notification
Use the test component to verify:
- Notification display
- Sound playback
- Browser notification permission
- Modal functionality

### Manual Testing
1. Create a virtual appointment
2. Set the appointment time to 5-10 minutes in the future
3. Wait for the notification to appear
4. Test the join call functionality

## API Integration

### Appointment Data Structure
The system expects appointments with:
```typescript
{
  _id: string;
  type: "Virtual" | "Walk in";
  date: string; // "MMM D" format
  time: string; // "HH:mm" or "H:mm A" format
  doctorName: string;
  patient: string;
  status: string;
  fullDate?: string; // "YYYY-MM-DD" format
  user?: {
    name: string;
  };
}
```

### Endpoint
- **GET** `/api/appointments` - Fetches all appointments
- **Authorization**: Bearer token required
- **Response**: Array of appointment objects

## Security Considerations

- **Permission-based**: Only shows notifications for user's own appointments
- **Role-based filtering**: Doctors see their appointments, patients see theirs
- **Token validation**: All API calls require valid authentication
- **Local storage**: Settings are stored locally, no sensitive data

## Performance

- **Efficient monitoring**: Checks every minute for upcoming appointments
- **Memory management**: Cleans up old notifications automatically
- **Lazy loading**: Only monitors when user is active
- **Optimized rendering**: Uses React hooks for efficient state management

## Troubleshooting

### Common Issues

1. **No notifications appearing**
   - Check if notifications are enabled in settings
   - Verify browser notification permission
   - Ensure appointments are virtual type

2. **Sound not playing**
   - Check if sound is enabled in settings
   - Verify browser supports Web Audio API
   - Check browser volume settings

3. **Notifications too early/late**
   - Adjust reminder time in settings
   - Check appointment time format
   - Verify timezone settings

### Debug Information
The service logs helpful information to the console:
- Appointment parsing results
- Notification scheduling details
- Permission status
- Error messages

## Future Enhancements

- **Push notifications** for mobile devices
- **Email notifications** as backup
- **Custom notification sounds**
- **Multiple reminder times** (e.g., 15 min, 5 min, 1 min)
- **Notification history** tracking
- **Integration with calendar apps**

## Support

For issues or questions about the notification system:
1. Check browser console for error messages
2. Verify notification permissions
3. Test with the built-in test functionality
4. Review appointment data format
