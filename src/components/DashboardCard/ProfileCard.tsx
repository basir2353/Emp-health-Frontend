import { Card, Image, Progress, Modal, Form, Input, Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ProfileImage from '../../public/images/profile.svg';
import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios

type OnboardingStep = {
  step: number;
  height?: string | number;
  unit?: string;
  avatar?: string;
  blood_group?: string;
};

const ProfileCard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user?.name;
  const userEmail = user?.email;
  const userId = user?._id || user?.id || '';

  // State for onboarding steps
  const [onboardingData, setOnboardingData] = useState<OnboardingStep[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch onboarding data from API
  useEffect(() => {
    const fetchOnboardingData = async () => {
      if (!userId) return;
      setIsLoadingData(true);
      try {
        const response = await axios.get(
          `http://empolyee-backedn.onrender.com/api/auth/get_onboard_data?userId=${userId}`
        );
        if (response.data && response.data.steps) {
          setOnboardingData(response.data.steps);
        }
      } catch (error) {
        console.error('Failed to fetch onboarding data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchOnboardingData();
  }, [userId]);

  // Extract values from onboardingData
  const height = onboardingData.find((item) => item.step === 1)?.height;
  const blood_group = onboardingData.find((item) => item.step === 3)?.blood_group;
  const unit = onboardingData.find((item) => item.step === 1)?.unit;
  const avatar = onboardingData.find((item) => item.step === 8)?.avatar;

  // State for modal visibility and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token') || '';
  };

  // Handle modal open/close
  const showModal = () => {
    setIsModalOpen(true);
    form.setFieldsValue({ email: userEmail }); // Pre-fill email
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Handle password change with Axios
  const handleChangePassword = async (values: { email: string; currentPassword: string; newPassword: string; confirmPassword: string }) => {
    const { email, currentPassword, newPassword, confirmPassword } = values;

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      message.error('New password and confirm password do not match!');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      message.error('Authentication token not found. Please log in again.');
      return;
    }

    // Extract userId from localStorage
    let userId = '';
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userId = userData._id || userData.id || '';
      if (!userId) {
        message.error('User ID not found. Please log in again.');
        return;
      }
    } catch {
      console.error('Error parsing user data from localStorage');
      message.error('Invalid user data. Please log in again.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://empolyee-backedn.onrender.com/api/auth/forgot-password',
        {
          email,
          currentPassword,
          newPassword,
          userId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Axios response.data contains the response body
      message.success('Password changed successfully!');
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      console.error('Error changing password:', error);
      // Check if error.response exists and has data
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message || 'Failed to change password. Please try again.');
      } else {
        message.error('An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card bordered={false} className="w-auto  h-auto  bg-[#141414]">
        <div className="flex flex-row max-lg:flex-col justify-evenly">
          <div className="w-96 h-24 p-2 rounded justify-between items-center inline-flex mt-4">
            <div className="justify-start items-start gap-2.5 flex">
              <div className="w-28 h-28 rounded-full overflow-hidden">
                <Image
                  src={avatar ? avatar : ProfileImage}
                  alt="Profile"
                  className="w-96 h-96 object-cover"
                />
              </div>
              <div className="flex-col justify-start items-start gap-2 inline-flex">
                <div className="text-white text-xl font-medium leading-7">
                  Hello {userName}!
                </div>
                <div className="w-98 justify-start items-start gap-2 inline-flex">
                  <div>
                    <span className="text-white text-sm font-medium leading-snug">
                      Blood Group: {blood_group ? blood_group : 'Not available'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white text-sm font-medium leading-snug">
                      Height:
                    </span>
                    <span className="text-white text-sm font-normal leading-snug">
                      {height ? `${height} ${unit}` : 'Not available'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-white text-sm font-medium leading-snug">
                    Weight: 80 KG
                  </span>
                </div>
              </div>
            </div>
            <div
              className="w-8 h-8 px-3.5 py-1 bg-sky-100 rounded shadow border border-zinc-600 justify-center items-center gap-2 flex cursor-pointer"
              onClick={showModal}
            >
              <div className="bg-white bg-opacity-0 flex-col justify-center items-center inline-flex">
                <div className="w-4 h-4 p-px justify-center items-center inline-flex">
                  <EditOutlined />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-96 h-16 px-2 flex-col justify-start items-start gap-5 inline-flex mt-3">
          <div className="flex-col justify-start items-start gap-1 flex">
            <div className="text-white text-sm font-medium leading-snug">
              Profile Completion21
            </div>
            <div className="w-[375px] max-lg:w-auto h-5 py-1.5 justify-center items-center inline-flex">
              <Progress percent={50} trailColor="white" showInfo={false} />
              <svg
                width="36"
                height="43"
                viewBox="0 0 36 43"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ position: 'absolute', right: '0', marginTop: '2' }}
              >
                <path
                  d="M28.3843 27.7178H8.22046V38.0854C8.22046 40.2528 10.4484 41.705 12.4314 40.8301L17.3593 38.656C18.1526 38.3061 19.0585 38.3164 19.8435 38.6844L24.111 40.6848C26.1004 41.6173 28.3843 40.1655 28.3843 37.9684V27.7178Z"
                  fill="#D46B08"
                />
                <circle cx="18.3024" cy="17.6359" r="17.4142" fill="#FFDE99" />
                <circle
                  cx="18.3025"
                  cy="17.6358"
                  r="15.5811"
                  fill="url(#paint0_linear_332_8971)"
                />
                <circle
                  cx="18.3024"
                  cy="17.6364"
                  r="5.37074"
                  fill="#D9D9D9"
                  fillOpacity="0.15"
                />
                <circle
                  cx="18.3025"
                  cy="17.6356"
                  r="7.40511"
                  fill="#D9D9D9"
                  fillOpacity="0.15"
                />
                <circle
                  cx="18.3025"
                  cy="17.6361"
                  r="9.76499"
                  fill="#D9D9D9"
                  fillOpacity="0.15"
                />
                <circle
                  cx="18.3026"
                  cy="17.6365"
                  r="12.6131"
                  fill="#D9D9D9"
                  fillOpacity="0.15"
                />
                <circle
                  cx="18.3025"
                  cy="17.6361"
                  r="14.7289"
                  fill="#D9D9D9"
                  fillOpacity="0.15"
                />
                <path
                  d="M13.7197 17.636L16.7713 20.9967L22.8851 14.2754"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_332_8971"
                    x1="32.5088"
                    y1="17.6358"
                    x2="2.72131"
                    y2="17.6358"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FFAE00" />
                    <stop offset="1" stopColor="#FF8C00" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </Card>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        className="text-gray-800"
        styles={{
          header: { background: '#F5F5F5', color: '#333333', borderBottom: '1px solid #E0E0E0' },
          body: { background: '#F5F5F5', padding: '24px' },
          mask: { background: 'rgba(0, 0, 0, 0.45)' },
        }}
      >
        <Form
          form={form}
          onFinish={handleChangePassword}
          layout="vertical"
          initialValues={{ email: userEmail }}
          requiredMark="optional"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Please enter a valid email address!' },
            ]}
          >
            <Input
              placeholder="Enter your email"
              className="border border-gray-300 rounded p-2 bg-white text-gray-800"
              disabled
            />
          </Form.Item>
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please enter your current password!' }]}
          >
            <Input.Password
              placeholder="Enter current password"
              className="border border-gray-300 rounded p-2 bg-white text-gray-800"
            />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter your new password!' },
              { min: 8, message: 'Password must be at least 8 characters!' },
            ]}
          >
            <Input.Password
              placeholder="Enter new password"
              className="border border-gray-300 rounded p-2 bg-white text-gray-800"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm new password"
              className="border border-gray-300 rounded p-2 bg-white text-gray-800"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded p-2"
              loading={isLoading}
              disabled={isLoading}
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProfileCard;