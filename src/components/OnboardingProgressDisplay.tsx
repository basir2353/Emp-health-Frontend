import React, { useState, useEffect, useCallback } from 'react';
import { Card, Progress, Typography, Button, Space, Spin, Alert } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { getOnboardingProgress } from '../api/onboardingApi.js';

const { Title, Text } = Typography;

interface OnboardingProgressDisplayProps {
  userId?: string;
  showRefresh?: boolean;
  compact?: boolean;
}

interface StepProgress {
  step: number;
  summary?: {
    step: number;
    [key: string]: any;
    completedAt?: string;
  };
  completedAt?: string;
  updatedAt?: string;
  // Step-specific fields based on API documentation
  height?: string;
  unit?: string;
  emergency_contact_relation?: string;
  emergency_contact_name?: string;
  emergency_contact?: string;
  blood_group?: string;
  data?: any;
  provider?: string;
  success?: boolean;
  skipped?: boolean;
  allergies?: string[];
  allergy_description?: string;
  disorders?: string[];
  disorder_detail?: string;
  avatar?: string;
  completed?: boolean;
}

interface OnboardingData {
  userId: string;
  steps: StepProgress[];
  totalSteps: number;
  isComplete: boolean;
  progressPercentage: number;
}

const OnboardingProgressDisplay: React.FC<OnboardingProgressDisplayProps> = ({
  userId,
  showRefresh = true,
  compact = false
}) => {
  const [loading, setLoading] = useState(false);
  const [progressData, setProgressData] = useState<OnboardingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProgressData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response: any = await getOnboardingProgress(userId);
      if (response && response.success) {
        setProgressData(response.data);
      } else {
        const errorMessage = response?.message || 'Failed to load onboarding progress';
        setError(errorMessage);
        console.warn('API returned unsuccessful response:', response);
      }
    } catch (err: any) {
      console.error('Error loading onboarding progress:', err);
      
      // Handle different types of errors
      let errorMessage = 'Unable to load progress data';
      
      if (err.response?.status === 404) {
        errorMessage = 'User onboarding data not found';
      } else if (err.response?.status === 401) {
        errorMessage = 'Authentication required';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  const getStepTitle = (stepNumber: number): string => {
    const stepTitles: { [key: number]: string } = {
      1: 'Height Information',
      2: 'Emergency Contact',
      3: 'Blood Group',
      4: 'Custom Step',
      5: 'Provider Information',
      6: 'Allergies',
      7: 'Medical Disorders',
      8: 'Avatar Selection',
      9: 'Completion'
    };
    return stepTitles[stepNumber] || `Step ${stepNumber}`;
  };

  const getStepIcon = (isCompleted: boolean) => {
    return isCompleted ? (
      <CheckCircleOutlined style={{ color: '#52c41a' }} />
    ) : (
      <ClockCircleOutlined style={{ color: '#d9d9d9' }} />
    );
  };

  const getStepDataSummary = (stepData: StepProgress): string => {
    if (!stepData) return '';
    
    switch (stepData.step) {
      case 1: // Height Information
        return stepData.height && stepData.unit ? `${stepData.height} ${stepData.unit}` : '';
      case 2: // Emergency Contact
        return stepData.emergency_contact_name ? `${stepData.emergency_contact_name} (${stepData.emergency_contact_relation})` : '';
      case 3: // Blood Group
        return stepData.blood_group || '';
      case 4: // Custom Step
        return stepData.data ? JSON.stringify(stepData.data).substring(0, 50) + '...' : '';
      case 5: // Provider Information
        return stepData.provider ? `${stepData.provider} ${stepData.success ? '(Success)' : '(Failed)'}` : '';
      case 6: // Allergies
        return stepData.allergies?.length ? `${stepData.allergies.length} allergies: ${stepData.allergies.join(', ')}` : '';
      case 7: // Medical Disorders
        return stepData.disorders?.length ? `${stepData.disorders.length} disorders: ${stepData.disorders.join(', ')}` : '';
      case 8: // Avatar
        return stepData.avatar ? 'Avatar uploaded' : '';
      case 9: // Completion
        return stepData.completed ? 'Completed' : '';
      default:
        return '';
    }
  };

  if (loading && !progressData) {
    return (
      <Card style={{ margin: '20px 0' }}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Spin size="large" />
          <Text style={{ display: 'block', marginTop: '15px', fontSize: '16px' }}>
            Loading onboarding progress...
          </Text>
          <Text type="secondary" style={{ display: 'block', marginTop: '5px' }}>
            Fetching your latest data
          </Text>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card style={{ margin: '20px 0' }}>
        <Alert
          message="Error Loading Progress"
          description={
            <div>
              <Text>{error}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Please check your connection and try again.
              </Text>
            </div>
          }
          type="error"
          showIcon
          action={
            <Button 
              type="primary" 
              size="small" 
              onClick={loadProgressData}
              loading={loading}
            >
              Retry
            </Button>
          }
        />
      </Card>
    );
  }

  if (!progressData) {
    return (
      <Card style={{ margin: '20px 0' }}>
        <Alert
          message="No Progress Data"
          description="Unable to load onboarding progress data. This might be your first time using the application."
          type="warning"
          showIcon
          action={
            <Button 
              size="small" 
              onClick={loadProgressData}
              loading={loading}
            >
              Refresh
            </Button>
          }
        />
      </Card>
    );
  }

  const completedSteps = progressData.steps.filter(step => step.completedAt).length;
  const progressPercentage = progressData.progressPercentage || (completedSteps / progressData.totalSteps) * 100;

  if (compact) {
    return (
      <Card size="small" style={{ margin: '10px 0' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Text strong>Onboarding Progress</Text>
            <br />
            <Text type="secondary">{completedSteps}/{progressData.totalSteps} steps completed</Text>
          </div>
          <div style={{ minWidth: '100px' }}>
            <Progress 
              percent={Math.round(progressPercentage)} 
              size="small" 
              status={progressData.isComplete ? 'success' : 'active'}
            />
          </div>
          {showRefresh && (
            <Button 
              type="text" 
              icon={<ReloadOutlined />} 
              onClick={loadProgressData}
              loading={loading}
              size="small"
            />
          )}
        </Space>
      </Card>
    );
  }

  return (
    <Card 
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>Onboarding Progress</Title>
          {showRefresh && (
            <Button 
              type="text" 
              icon={<ReloadOutlined />} 
              onClick={loadProgressData}
              loading={loading}
            />
          )}
        </Space>
      }
      style={{ margin: '20px 0' }}
    >
      <div style={{ marginBottom: '20px' }}>
        <Progress 
          percent={Math.round(progressPercentage)} 
          status={progressData.isComplete ? 'success' : 'active'}
          strokeWidth={8}
        />
        <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
          {completedSteps} of {progressData.totalSteps} steps completed
          {progressData.isComplete && ' - Onboarding Complete!'}
        </Text>
      </div>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {Array.from({ length: progressData.totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const stepData = progressData.steps.find(s => s.step === stepNumber);
          const isCompleted = stepData?.completedAt ? true : false;
          const stepSummary = stepData ? getStepDataSummary(stepData) : '';
          
          return (
            <div 
              key={stepNumber}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: index < progressData.totalSteps - 1 ? '1px solid #f0f0f0' : 'none'
              }}
            >
              <div style={{ marginRight: '12px', fontSize: '16px' }}>
                {getStepIcon(isCompleted)}
              </div>
              <div style={{ flex: 1 }}>
                <Text strong={isCompleted}>{getStepTitle(stepNumber)}</Text>
                {stepSummary && (
                  <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginTop: '2px' }}>
                    {stepSummary}
                  </Text>
                )}
                {stepData?.completedAt && (
                  <Text type="secondary" style={{ display: 'block', fontSize: '11px', marginTop: '2px' }}>
                    Completed: {new Date(stepData.completedAt).toLocaleDateString()}
                  </Text>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {progressData.isComplete && (
        <Alert
          message="Congratulations!"
          description="You have successfully completed all onboarding steps."
          type="success"
          style={{ marginTop: '20px' }}
        />
      )}
    </Card>
  );
};

export default OnboardingProgressDisplay;
