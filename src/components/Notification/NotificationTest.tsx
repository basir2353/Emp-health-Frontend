import React, { useState } from 'react';
import { Button, Card, Space, Typography, message } from 'antd';
import { BellOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { notificationService } from '../../services/notificationService';

const { Title, Text } = Typography;

interface NotificationTestProps {
  userRole?: string;
}

const NotificationTest: React.FC<NotificationTestProps> = ({ userRole = 'employee' }) => {
  const [isTesting, setIsTesting] = useState(false);

  const handleTestNotification = async () => {
    setIsTesting(true);
    
    try {
      // Test the notification service
      notificationService.triggerTestNotification(userRole);
      message.success('Test notification sent!');
    } catch (error) {
      console.error('Error testing notification:', error);
      message.error('Failed to send test notification');
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestBrowserNotification = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Test Notification', {
          body: 'This is a test browser notification for virtual appointments',
          icon: '/favicon.ico'
        });
        message.success('Browser notification sent!');
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Test Notification', {
              body: 'This is a test browser notification for virtual appointments',
              icon: '/favicon.ico'
            });
            message.success('Browser notification sent!');
          } else {
            message.warning('Notification permission denied');
          }
        });
      } else {
        message.warning('Notification permission denied. Please enable notifications in your browser settings.');
      }
    } else {
      message.error('This browser does not support notifications');
    }
  };

  return (
    <Card 
      title={
        <Space>
          <PlayCircleOutlined style={{ color: '#1890ff' }} />
          <span>Notification Testing</span>
        </Space>
      }
      style={{ maxWidth: 400 }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text strong>Test In-App Notification</Text>
          <br />
          <Text type="secondary">Test the notification system with a sample virtual appointment reminder</Text>
        </div>
        
        <Button 
          type="primary" 
          icon={<BellOutlined />}
          onClick={handleTestNotification}
          loading={isTesting}
          block
        >
          Send Test Notification
        </Button>

        <div>
          <Text strong>Test Browser Notification</Text>
          <br />
          <Text type="secondary">Test browser notification permission and display</Text>
        </div>
        
        <Button 
          type="default" 
          icon={<BellOutlined />}
          onClick={handleTestBrowserNotification}
          block
        >
          Test Browser Notification
        </Button>

        <div style={{ 
          padding: '12px', 
          backgroundColor: '#f6ffed', 
          borderRadius: '6px',
          border: '1px solid #b7eb8f'
        }}>
          <Text style={{ fontSize: '12px', color: '#389e0d' }}>
            <strong>Note:</strong> Notifications will automatically appear 5 minutes before virtual appointments. 
            This test shows how the notification will look.
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default NotificationTest;
