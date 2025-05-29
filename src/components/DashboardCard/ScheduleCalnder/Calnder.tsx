import { useState, useEffect } from 'react';
import { Calendar, Spin, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

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
  avatarSrc: string;
  user: User;
  createdAt: string;
  __v: number;
}

interface ApiResponse {
  appointments: Appointment[];
}

const AppointmentCalendar: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/appointments');
        const data: ApiResponse = await response.json();
        setAppointments(data.appointments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

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

  const dateCellRender = (value: Dayjs) => {
    const appts = getAppointmentsForDate(value);
    return (
      <div className=" ">
        {appts.map((appt) => (
          <div key={appt._id} className="mb-1">
            <div className='bg-black text-white p-2 rounded-lg shadow-md  items-center justify-between'>
       <div className=''>     {appt.time} </div> 
       <div className='text-bold'> {appt.doctorName} </div>
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
          No appointments on {selectedDate.format('MMMM D, YYYY')}
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
            src={appt.avatarSrc}
            alt={`${appt.doctorName} avatar`}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div className="font-semibold">{appt.doctorName}</div>
            <div className="text-sm">Type: {appt.type}</div>
            <div className="text-sm">{appt.time}</div>
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
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Typography.Title level={2} className="text-center mb-6 text-blue-600">
            Appointment Calendar
          </Typography.Title>
          <Calendar
            dateCellRender={dateCellRender}
            onSelect={onSelect}
            value={selectedDate}
            className="mb-6 rounded-lg shadow-md"
            fullscreen
            style={{ border: '2px solid #3b82f6', borderRadius: '8px' }}
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
