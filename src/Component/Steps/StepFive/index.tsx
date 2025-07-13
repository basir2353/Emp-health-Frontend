import { Button, Col, Layout, Row, Modal, Progress, notification, Form, Input } from "antd";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { AppleFilled, LoadingOutlined, CheckCircleFilled, ExclamationCircleFilled, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { BaseButton } from "../../form/base-button";
import { saveStepData } from "../../../utils/onboardingStorage";
import { useState, useEffect } from "react";

interface DeviceStatus {
  provider: string;
  status: 'idle' | 'authenticating' | 'connecting' | 'connected' | 'failed';
  error?: string;
}

interface AuthCredentials {
  email?: string;
  password?: string;
  phone?: string;
}

function StepFive() {
  const { Title, Text } = Typography;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [deviceStatuses, setDeviceStatuses] = useState<{[key: string]: DeviceStatus}>({
    Apple: { provider: 'Apple', status: 'idle' },
    Google: { provider: 'Google', status: 'idle' },
    Samsung: { provider: 'Samsung', status: 'idle' }
  });
  
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [isProgressModalVisible, setIsProgressModalVisible] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<string>('');
  const [connectingStep, setConnectingStep] = useState(0);
  const [hasConnectedDevice, setHasConnectedDevice] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Realistic connection steps
  const connectionSteps = [
    "Verifying credentials...",
    "Establishing secure connection...",
    "Requesting device permissions...",
    "Syncing device data...",
    "Finalizing connection..."
  ];

  // Provider-specific auth requirements
  const getAuthFields = (provider: string) => {
    switch (provider) {
      case 'Apple':
        return {
          title: 'Sign in to Apple Health',
          fields: [
            { name: 'email', label: 'Apple ID Email', type: 'email', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true }
          ],
          helpText: 'We\'ll securely connect to your Apple Health data using your Apple ID.'
        };
      case 'Google':
        return {
          title: 'Sign in to Google Fit',
          fields: [
            { name: 'email', label: 'Google Email', type: 'email', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true }
          ],
          helpText: 'We\'ll access your Google Fit data through secure OAuth authentication.'
        };
      case 'Samsung':
        return {
          title: 'Sign in to Samsung Health',
          fields: [
            { name: 'email', label: 'Samsung Account Email', type: 'email', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true }
          ],
          helpText: 'Connect your Samsung Health account to sync your fitness data.'
        };
      default:
        return { title: '', fields: [], helpText: '' };
    }
  };

  // Check for device conflicts before linking
  const checkDeviceConflicts = (provider: string): { allowed: boolean; message?: string } => {
    const connectedDevices = Object.keys(deviceStatuses).filter(
      key => deviceStatuses[key].status === 'connected'
    );

    if (connectedDevices.length === 0) {
      return { allowed: true };
    }

    // Define conflicting device pairs
    const conflicts = {
      'Apple': ['Google', 'Samsung'],
      'Google': ['Apple', 'Samsung'], 
      'Samsung': ['Apple', 'Google']
    };

    const conflictingDevice = connectedDevices.find(connected => 
      conflicts[provider as keyof typeof conflicts]?.includes(connected)
    );

    if (conflictingDevice) {
      return {
        allowed: false,
        message: `Cannot connect ${provider} while ${conflictingDevice} is connected. Health data platforms typically don't allow multiple primary health apps to be connected simultaneously to prevent data conflicts. Please disconnect ${conflictingDevice} first if you want to use ${provider} instead.`
      };
    }

    return { allowed: true };
  };

  // Handle device linking - show auth modal first
  const handleLinkDevice = (provider: string) => {
    // Check for conflicts first
    const conflictCheck = checkDeviceConflicts(provider);
    
    if (!conflictCheck.allowed) {
      notification.warning({
        message: 'Device Conflict Detected',
        description: conflictCheck.message,
        placement: 'topRight',
        duration: 6,
      });
      return;
    }

    setCurrentProvider(provider);
    setIsAuthModalVisible(true);
    form.resetFields();
  };

  // Handle authentication submission
  const handleAuthentication = async (values: AuthCredentials) => {
    setAuthLoading(true);
    
    try {
      // Simulate authentication API call
      const authResult = await simulateAuthentication(currentProvider, values);
      
      if (authResult.success) {
        setIsAuthModalVisible(false);
        setIsProgressModalVisible(true);
        setConnectingStep(0);
        
        // Update status to connecting
        setDeviceStatuses(prev => ({
          ...prev,
          [currentProvider]: { ...prev[currentProvider], status: 'connecting' }
        }));

        // Proceed with device linking
        await proceedWithDeviceLinking(currentProvider);
      } else {
        throw new Error(authResult.error || 'Authentication failed');
      }
    } catch (error: any) {
      notification.error({
        message: 'Authentication Failed',
        description: error.message || 'Please check your credentials and try again.',
        placement: 'topRight',
        duration: 4,
      });
    } finally {
      setAuthLoading(false);
    }
  };

  // Simulate authentication with provider
  const simulateAuthentication = (provider: string, credentials: AuthCredentials): Promise<{success: boolean, error?: string}> => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // Basic validation
        if (!credentials.email || !credentials.password) {
          resolve({ success: false, error: 'Email and password are required' });
          return;
        }

        // Simulate different auth scenarios
        const random = Math.random();
        
        if (random > 0.25) { // 75% success rate for auth
          resolve({ success: true });
        } else {
          const authErrors = [
            'Invalid email or password',
            'Account not found',
            'Too many failed attempts. Please try again later.',
            'Two-factor authentication required',
            'Account temporarily locked'
          ];
          
          const errorMessage = authErrors[Math.floor(Math.random() * authErrors.length)];
          resolve({ success: false, error: errorMessage });
        }
      }, 1500); // Realistic auth delay
    });
  };

  // Proceed with device linking after successful auth
  const proceedWithDeviceLinking = async (provider: string) => {
    try {
      const result = await simulateDeviceLinking(provider);
      
      if (result.success) {
        setDeviceStatuses(prev => ({
          ...prev,
          [provider]: { ...prev[provider], status: 'connected' }
        }));
        
        setHasConnectedDevice(true);
        
        notification.success({
          message: `${provider} Connected Successfully!`,
          description: `Your ${provider} device has been linked and is ready to sync data.`,
          placement: 'topRight',
          duration: 3,
        });

        saveStepData(5, { provider, success: true, timestamp: new Date().toISOString() });
        
        setTimeout(() => {
          setIsProgressModalVisible(false);
        }, 1000);
      } else {
        throw new Error(result.error || 'Device linking failed');
      }
    } catch (error: any) {
      setDeviceStatuses(prev => ({
        ...prev,
        [provider]: { 
          ...prev[provider], 
          status: 'failed',
          error: error.message 
        }
      }));
      
      notification.error({
        message: `${provider} Connection Failed`,
        description: error.message || 'Please try again or contact support if the issue persists.',
        placement: 'topRight',
        duration: 4,
      });
      
      setTimeout(() => {
        setIsProgressModalVisible(false);
      }, 1500);
    }
  };

  // Simulate device linking process after auth
  const simulateDeviceLinking = (provider: string): Promise<{success: boolean, error?: string}> => {
    return new Promise((resolve) => {
      let currentStep = 0;
      
      const stepInterval = setInterval(() => {
        if (currentStep < connectionSteps.length - 1) {
          currentStep++;
          setConnectingStep(currentStep);
        } else {
          clearInterval(stepInterval);
          
          const random = Math.random();
          
          if (random > 0.1) { // 90% success rate after successful auth
            resolve({ success: true });
          } else {
            const linkingErrors = [
              'Device not found. Make sure your device is nearby and discoverable.',
              'Permission denied. Please allow access to your device data.',
              'Network timeout. Please check your internet connection.',
              'Device data sync failed. Please try again.'
            ];
            
            const errorMessage = linkingErrors[Math.floor(Math.random() * linkingErrors.length)];
            resolve({ success: false, error: errorMessage });
          }
        }
      }, 1000);
    });
  };

  // Disconnect device
  const disconnectDevice = (provider: string) => {
    Modal.confirm({
      title: `Disconnect ${provider}?`,
      content: `Are you sure you want to disconnect your ${provider} device? This will stop syncing your health data from this source.`,
      okText: 'Yes, Disconnect',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setDeviceStatuses(prev => ({
          ...prev,
          [provider]: { ...prev[provider], status: 'idle', error: undefined }
        }));

        // Check if no devices are connected after disconnection
        const remainingConnected = Object.keys(deviceStatuses).filter(
          key => key !== provider && deviceStatuses[key].status === 'connected'
        );
        
        if (remainingConnected.length === 0) {
          setHasConnectedDevice(false);
        }

        notification.success({
          message: `${provider} Disconnected`,
          description: `Your ${provider} device has been disconnected successfully.`,
          placement: 'topRight',
          duration: 3,
        });
      }
    });
  };

  // Skip button handler
  const skipClick = () => {
    saveStepData(5, { provider: null, success: false, skipped: true });
    navigate("/step-6");
  };

  // Continue to next step
  const continueToNext = () => {
    navigate("/step-6");
  };

  // Get button props based on device status
  const getButtonProps = (provider: string) => {
    const status = deviceStatuses[provider];
    
    // Check if this provider conflicts with already connected devices
    const conflictCheck = checkDeviceConflicts(provider);
    const isDisabledDueToConflict = !conflictCheck.allowed && status.status === 'idle';
    
    switch (status.status) {
      case 'authenticating':
      case 'connecting':
        return {
          loading: true,
          disabled: true,
          type: 'default' as const
        };
      case 'connected':
        return {
          icon: <CheckCircleFilled style={{ color: '#52c41a' }} />,
          type: 'default' as const,
          style: { borderColor: '#52c41a', color: '#52c41a' },
          onClick: () => disconnectDevice(provider)
        };
      case 'failed':
        return {
          icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
          type: 'default' as const,
          style: { borderColor: '#ff4d4f', color: '#ff4d4f' },
          onClick: () => disconnectDevice(provider)
        };
      default:
        return {
          type: 'default' as const,
          disabled: isDisabledDueToConflict,
          style: isDisabledDueToConflict ? { opacity: 0.5 } : {}
        };
    }
  };

  const authConfig = getAuthFields(currentProvider);

  return (
    <>
      <Row
        style={{ height: "calc(100vh - 81px)", backgroundColor: "#f5f5f5" }}
        justify="center"
        align="middle"
      >
        <Col span={24} md={12}>
          <Row justify="center">
            <Col span={24} md={18} className="text-center">
              <Title>Link Your Devices</Title>
              <Text type="secondary">
                Connect your smart devices to automatically sync your health and fitness data.
                You'll need to sign in to each service to authorize the connection.
                <br /><br />
                <Text type="warning" className="text-sm">
                  Note: You can only connect one primary health platform at a time to prevent data conflicts.
                </Text>
              </Text>

              <div className="mt-5 mb-5">
                <Button
                  size="large"
                  className="w-4/5 mb-2"
                  icon={<AppleFilled />}
                  onClick={() => handleLinkDevice("Apple")}
                  {...getButtonProps("Apple")}
                >
                  {deviceStatuses.Apple.status === 'connected' ? 'Disconnect Apple Health' :
                   deviceStatuses.Apple.status === 'failed' ? 'Retry Apple Connection' :
                   deviceStatuses.Apple.status === 'connecting' ? 'Connecting to Apple...' :
                   deviceStatuses.Apple.status === 'authenticating' ? 'Authenticating...' :
                   checkDeviceConflicts('Apple').allowed ? 'Connect Apple Health' : 'Unavailable (Conflict)'}
                </Button>
                
                <Button
                  size="large"
                  className="w-4/5 mb-2"
                  icon={<img src="assets/googleIcon.svg" width={"15px"} />}
                  onClick={() => handleLinkDevice("Google")}
                  {...getButtonProps("Google")}
                >
                  {deviceStatuses.Google.status === 'connected' ? 'Disconnect Google Fit' :
                   deviceStatuses.Google.status === 'failed' ? 'Retry Google Connection' :
                   deviceStatuses.Google.status === 'connecting' ? 'Connecting to Google...' :
                   deviceStatuses.Google.status === 'authenticating' ? 'Authenticating...' :
                   checkDeviceConflicts('Google').allowed ? 'Connect Google Fit' : 'Unavailable (Conflict)'}
                </Button>
                
                <Button
                  size="large"
                  className="w-4/5 mb-2"
                  icon={<img src="assets/samsung.svg" width={"20px"} />}
                  onClick={() => handleLinkDevice("Samsung")}
                  {...getButtonProps("Samsung")}
                >
                  {deviceStatuses.Samsung.status === 'connected' ? 'Disconnect Samsung Health' :
                   deviceStatuses.Samsung.status === 'failed' ? 'Retry Samsung Connection' :
                   deviceStatuses.Samsung.status === 'connecting' ? 'Connecting to Samsung...' :
                   deviceStatuses.Samsung.status === 'authenticating' ? 'Authenticating...' :
                   checkDeviceConflicts('Samsung').allowed ? 'Connect Samsung Health' : 'Unavailable (Conflict)'}
                </Button>
              </div>
              
              <div className="mt-4 space-y-2">
                {hasConnectedDevice && (
                  <Button 
                    type="primary" 
                    size="large" 
                    className="w-4/5"
                    onClick={continueToNext}
                    style={{backgroundColor: '#000000', color: '#fff'}}
                  >
                    Continue
                  </Button>
                )}
                
                <div>
                  <BaseButton onClick={skipClick} type="text">
                    {hasConnectedDevice ? 'Add More Later' : 'Skip for Now'}
                  </BaseButton>
                </div>
              </div>
            </Col>
          </Row>
        </Col>

        <Layout
          style={{
            width: "720px",
            height: "calc(100vh - 81px)",
            right: "0px",
            top: "80px",
          }}
        >
          <Layout.Content className="bg-blue-100">
            <div className="w-[638px] max-lg:ml-0 ml-10 mt-7 max-lg:w-auto">
              <Title
                level={2}
                className="font-satoshi font-semibold text-4xl leading-10 text-black"
              >
                Connect your smart watch & fitness apps.
              </Title>
              <Text className="font-satoshi font-normal text-base leading-6 text-gray-600">
                Sync your health data automatically from your favorite devices and apps. 
                Your data is encrypted and secure, and you can disconnect anytime. 
                You'll need to sign in to authorize each connection.
              </Text>
            </div>
            <img
              src="/step5.png"
              alt="Step 5"
              className="w-[430px] max-lg:w-auto max-lg:ml-0 ml-[335px]"
            />
          </Layout.Content>
        </Layout>
      </Row>

      {/* Authentication Modal */}
      <Modal
        title={authConfig.title}
        open={isAuthModalVisible}
        onCancel={() => setIsAuthModalVisible(false)}
        footer={null}
        centered
        width={450}
      >
        <div className="py-4">
          <Text type="secondary" className="block mb-4">
            {authConfig.helpText}
          </Text>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAuthentication}
            autoComplete="off"
          >
            {authConfig.fields.map((field) => (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                rules={[
                  { required: field.required, message: `Please enter your ${field.label.toLowerCase()}` },
                  ...(field.type === 'email' ? [{ type: 'email' as const, message: 'Please enter a valid email address' }] : [])
                ]}
              >
                {field.type === 'password' ? (
                  <Input.Password
                    size="large"
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                ) : (
                  <Input
                    size="large"
                    type={field.type}
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                  />
                )}
              </Form.Item>
            ))}
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button onClick={() => setIsAuthModalVisible(false)}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={authLoading}
                style={{backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff'}}
              >
                Sign In & Connect
              </Button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Connection Progress Modal */}
      <Modal
        title={`Connecting to ${currentProvider}`}
        open={isProgressModalVisible}
        footer={null}
        closable={false}
        centered
        width={400}
      >
        <div className="text-center py-4">
          <div className="mb-4">
            <LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </div>
          
          <Progress 
            percent={Math.round(((connectingStep + 1) / connectionSteps.length) * 100)} 
            showInfo={false}
            strokeColor="#1890ff"
            className="mb-4"
          />
          
          <Text className="block mb-2">
            {connectionSteps[connectingStep]}
          </Text>
          
          <Text type="secondary" className="block text-sm">
            This may take a few moments...
          </Text>
        </div>
      </Modal>
    </>
  );
}

export default StepFive;