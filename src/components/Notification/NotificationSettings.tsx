import React, { useState, useEffect } from 'react';
import { Card, Switch, InputNumber, Button, Space, Typography, message, Divider } from 'antd';
import { BellOutlined, SoundOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { notificationService, NotificationSettings } from '../../services/notificationService';

const { Title, Text } = Typography;

interface NotificationSettingsProps {
  onSettingsChange?: (settings: NotificationSettings) => void;
}

const NotificationSettingsComponent: React.FC<NotificationSettingsProps> = ({
  onSettingsChange
}) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    soundEnabled: true,
    reminderMinutes: 5
  });

  useEffect(() => {
    // Load current settings
    const currentSettings = notificationService.getSettings();
    setSettings(currentSettings);
  }, []);

  const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    notificationService.updateSettings(newSettings);
    
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }

    // Show feedback message
    const settingNames: Record<keyof NotificationSettings, string> = {
      enabled: 'Notifications',
      soundEnabled: 'Notification Sound',
      reminderMinutes: 'Reminder Time'
    };

    message.success(`${settingNames[key]} ${key === 'reminderMinutes' ? `set to ${value} minutes` : value ? 'enabled' : 'disabled'}`);
  };

  const handleTestNotification = () => {
    const userData = localStorage.getItem('user') || localStorage.getItem('loggedInUser');
    let role = 'user';
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        role = parsedUser.role || 'user';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    notificationService.triggerTestNotification(role);
    message.info('Test notification sent!');
  };

  return (
    <Card 
      title={
        <Space>
          <BellOutlined style={{ color: '#1890ff' }} />
          <span>Notification Settings</span>
        </Space>
      }
      style={{ maxWidth: 500 }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Enable Notifications */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text strong>Enable Notifications</Text>
            <br />
            <Text type="secondary">Receive reminders for virtual appointments</Text>
          </div>
          <Switch
            checked={settings.enabled}
            onChange={(checked) => handleSettingChange('enabled', checked)}
            checkedChildren="ON"
            unCheckedChildren="OFF"
          />
        </div>

        <Divider />

        {/* Sound Notifications */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text strong>Notification Sound</Text>
            <br />
            <Text type="secondary">Play sound when notification appears</Text>
          </div>
          <Switch
            checked={settings.soundEnabled}
            onChange={(checked) => handleSettingChange('soundEnabled', checked)}
            checkedChildren={<SoundOutlined />}
            unCheckedChildren={<SoundOutlined />}
          />
        </div>

        <Divider />

        {/* Reminder Time */}
        <div>
          <div style={{ marginBottom: '8px' }}>
            <Text strong>Reminder Time</Text>
            <br />
            <Text type="secondary">How many minutes before appointment to notify</Text>
          </div>
          <Space align="center">
            <InputNumber
              min={1}
              max={60}
              value={settings.reminderMinutes}
              onChange={(value) => value && handleSettingChange('reminderMinutes', value)}
              addonBefore={<ClockCircleOutlined />}
              addonAfter="minutes"
              style={{ width: 150 }}
            />
          </Space>
        </div>

        <Divider />

        {/* Test Notification */}
        <div style={{ textAlign: 'center' }}>
          <Button 
            type="default" 
            icon={<BellOutlined />}
            onClick={handleTestNotification}
            disabled={!settings.enabled}
          >
            Send Test Notification
          </Button>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Test your notification settings
          </Text>
        </div>

        {/* Info */}
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#f6ffed', 
          borderRadius: '6px',
          border: '1px solid #b7eb8f'
        }}>
          <Text style={{ fontSize: '12px', color: '#389e0d' }}>
            <strong>Note:</strong> Notifications are only sent for virtual appointments. 
            Make sure your browser allows notifications for this site.
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default NotificationSettingsComponent;
