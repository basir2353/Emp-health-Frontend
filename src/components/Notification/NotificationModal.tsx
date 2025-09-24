import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography, Space, Avatar, Tag } from 'antd';
import { ClockCircleOutlined, UserOutlined, VideoCameraOutlined, BellOutlined } from '@ant-design/icons';
import { AppointmentNotification } from '../../services/notificationService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface NotificationModalProps {
  notification: AppointmentNotification | null;
  visible: boolean;
  onClose: () => void;
  onJoinCall?: (appointmentId: string) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  visible,
  onClose,
  onJoinCall
}) => {
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    if (notification && visible) {
      setCountdown(notification.timeUntilAppointment);
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [notification, visible]);

  if (!notification) return null;

  const formatCountdown = (minutes: number) => {
    if (minutes <= 0) return 'Now';
    if (minutes === 1) return '1 minute';
    return `${minutes} minutes`;
  };

  const handleJoinCall = () => {
    if (onJoinCall) {
      onJoinCall(notification.appointmentId);
    }
    onClose();
  };

  return (
    <Modal
      title={
        <Space>
          <BellOutlined style={{ color: '#1890ff' }} />
          <span>Virtual Appointment Reminder</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="dismiss" onClick={onClose}>
          Dismiss
        </Button>,
        notification.timeUntilAppointment <= 5 && (
          <Button 
            key="join" 
            type="primary" 
            icon={<VideoCameraOutlined />}
            onClick={handleJoinCall}
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          >
            Join Call
          </Button>
        )
      ].filter(Boolean)}
      width={500}
      centered
    >
      <div style={{ padding: '20px 0' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header with appointment type */}
          <div style={{ textAlign: 'center' }}>
            <Tag 
              icon={<VideoCameraOutlined />} 
              color="blue" 
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              Virtual Appointment
            </Tag>
          </div>

          {/* Countdown */}
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f6ffed', borderRadius: '8px' }}>
            <Title level={2} style={{ margin: 0, color: '#52c41a' }}>
              {formatCountdown(countdown)}
            </Title>
            <Text type="secondary">until your appointment</Text>
          </div>

          {/* Appointment Details */}
          <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ClockCircleOutlined style={{ color: '#1890ff' }} />
                <div>
                  <Text strong>Time:</Text>
                  <br />
                  <Text style={{ fontSize: '16px' }}>{notification.appointmentTime}</Text>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <div>
                  <Text strong>Doctor:</Text>
                  <br />
                  <Text style={{ fontSize: '16px' }}>{notification.doctorName}</Text>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />
                <div>
                  <Text strong>Patient:</Text>
                  <br />
                  <Text style={{ fontSize: '16px' }}>{notification.patientName}</Text>
                </div>
              </div>
            </Space>
          </div>

          {/* Message */}
          <div style={{ padding: '12px', backgroundColor: '#e6f7ff', borderRadius: '8px', border: '1px solid #91d5ff' }}>
            <Text style={{ fontSize: '14px' }}>
              {notification.message}
            </Text>
          </div>

          {/* Instructions */}
          {countdown <= 5 && (
            <div style={{ padding: '12px', backgroundColor: '#fff7e6', borderRadius: '8px', border: '1px solid #ffd591' }}>
              <Text style={{ fontSize: '14px', color: '#d46b08' }}>
                <strong>Ready to join?</strong> Click "Join Call" when you're ready to start your virtual appointment.
              </Text>
            </div>
          )}
        </Space>
      </div>
    </Modal>
  );
};

export default NotificationModal;
