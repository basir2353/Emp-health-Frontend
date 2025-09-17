import React, { useState, useEffect } from 'react';
import { Card, Typography, List, Avatar, Button, message, Badge, Tag } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, VideoCameraOutlined, PhoneOutlined } from '@ant-design/icons';
import { getAllAppointments, getAllDoctors } from '../api/callApi';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const DoctorAppointments = ({ currentUser }) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter appointments for current doctor
  const doctorAppointments = appointments.filter(appointment => 
    appointment.doctorName === currentUser?.name || 
    appointment.doctorName === `Dr. ${currentUser?.name}`
  );

  // Separate upcoming and past appointments
  const upcomingAppointments = doctorAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.createdAt);
    const now = new Date();
    return appointmentDate >= now;
  });

  const pastAppointments = doctorAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.createdAt);
    const now = new Date();
    return appointmentDate < now;
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const [appointmentsResponse, doctorsResponse] = await Promise.all([
        getAllAppointments(),
        getAllDoctors()
      ]);
      
      if (appointmentsResponse.appointments) {
        setAppointments(appointmentsResponse.appointments);
        console.log('Fetched appointments:', appointmentsResponse.appointments);
      }
      
      if (doctorsResponse.doctors) {
        setAllDoctors(doctorsResponse.doctors);
        console.log('Fetched doctors:', doctorsResponse.doctors);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchAppointments();
    }
  }, [currentUser?.id]);

  const joinVideoCall = (doctorSocketId) => {
    if (doctorSocketId) {
      navigate(`/room/${doctorSocketId.toLowerCase()}`);
    } else {
      message.warning('Unable to start video call');
    }
  };

  const getAppointmentTypeColor = (type) => {
    switch (type) {
      case 'Virtual': return 'blue';
      case 'Walk in': return 'green';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDoctorSocketId = (doctorName) => {
    const doctor = allDoctors.find(doc => 
      doc.name === doctorName || 
      doc.name === doctorName.replace('Dr. ', '')
    );
    return doctor?.socketId;
  };

  return (
    <div className="space-y-4">
      {/* Upcoming Appointments */}
      <Card className="border-blue-500 border-2">
        <div className="flex justify-between items-center mb-4">
          <Title level={4} className="mb-0">
            <CalendarOutlined className="mr-2" />
            Upcoming Appointments
          </Title>
          <Button onClick={fetchAppointments} loading={loading}>
            Refresh
          </Button>
        </div>
        
        {upcomingAppointments.length > 0 ? (
          <List
            dataSource={upcomingAppointments}
            renderItem={(appointment) => (
              <List.Item
                actions={[
                  <Button 
                    type="primary" 
                    icon={<VideoCameraOutlined />}
                    onClick={() => {
                      const doctorSocketId = getDoctorSocketId(appointment.doctorName);
                      joinVideoCall(doctorSocketId);
                    }}
                    className="bg-green-600"
                  >
                    Start Call
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <div className="flex items-center space-x-2">
                      <span>{appointment.user?.name || 'Unknown Patient'}</span>
                      <Tag color={getAppointmentTypeColor(appointment.type)}>
                        {appointment.type}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CalendarOutlined className="text-gray-500" />
                        <span>{appointment.day}, {appointment.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockCircleOutlined className="text-gray-500" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Patient: {appointment.user?.email || 'No email provided'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Scheduled: {formatDate(appointment.createdAt)}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div className="text-center py-8">
            <CalendarOutlined className="text-4xl text-gray-400 mb-2" />
            <Paragraph className="text-gray-500">
              No upcoming appointments found.
            </Paragraph>
          </div>
        )}
      </Card>

      {/* Past Appointments */}
      <Card className="border-gray-300 border-2">
        <Title level={4} className="mb-4">
          <ClockCircleOutlined className="mr-2" />
          Past Appointments
        </Title>
        
        {pastAppointments.length > 0 ? (
          <List
            dataSource={pastAppointments}
            renderItem={(appointment) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <div className="flex items-center space-x-2">
                      <span>{appointment.user?.name || 'Unknown Patient'}</span>
                      <Tag color={getAppointmentTypeColor(appointment.type)}>
                        {appointment.type}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CalendarOutlined className="text-gray-500" />
                        <span>{appointment.day}, {appointment.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockCircleOutlined className="text-gray-500" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Patient: {appointment.user?.email || 'No email provided'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Completed: {formatDate(appointment.createdAt)}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div className="text-center py-8">
            <ClockCircleOutlined className="text-4xl text-gray-400 mb-2" />
            <Paragraph className="text-gray-500">
              No past appointments found.
            </Paragraph>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DoctorAppointments;


