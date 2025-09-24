import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import OnboardingProgressDisplay from '../components/OnboardingProgressDisplay';

const { Title } = Typography;

const OnboardingProgress: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <Card>
          <Space align="center">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              Onboarding Progress
            </Title>
          </Space>
        </Card>

        {/* Progress Display */}
        <OnboardingProgressDisplay showRefresh={true} compact={false} />

        {/* Additional Information */}
        <Card title="About Onboarding">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Title level={4}>What is Onboarding?</Title>
              <p>
                Onboarding helps us personalize your health experience by collecting essential information 
                about your health profile, emergency contacts, and preferences. This information enables us 
                to provide you with better health recommendations and services.
              </p>
            </div>
            
            <div>
              <Title level={4}>Your Data is Secure</Title>
              <p>
                All your onboarding data is securely stored and encrypted. We use industry-standard 
                security practices to protect your personal health information. You can update or 
                delete your information at any time.
              </p>
            </div>

            <div>
              <Title level={4}>Need Help?</Title>
              <p>
                If you have any questions about the onboarding process or need assistance completing 
                any steps, please contact our support team or use the help resources available in 
                your dashboard.
              </p>
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default OnboardingProgress;

