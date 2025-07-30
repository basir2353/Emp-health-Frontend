import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, Typography, message, List, Avatar, Divider } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { AuthContext } from '../components/context/AuthContext';
import { getOnlineUsers, getOnlineDoctors, storeSocketId } from '../api/callApi';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;

const CallTest = () => {
  const { currentUser } = useContext(AuthContext);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineDoctors, setOnlineDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socketId, setSocketId] = useState('test_socket_123');
  const [apiStatus, setApiStatus] = useState({});

  useEffect(() => {
    if (currentUser?.id) {
      fetchOnlineUsers();
      testApiEndpoints();
    }
  }, [currentUser]);

  const testApiEndpoints = async () => {
    const baseUrl = 'http://localhost:5000/api';
    const token = localStorage.getItem('token_real') || localStorage.getItem('token');
    
    try {
      // Test if the base API is working
      console.log('Testing base API connectivity...');
      
      // Test online-users endpoint
      console.log('Testing /auth/online-users...');
      const usersResponse = await axios.get(`${baseUrl}/auth/online-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApiStatus(prev => ({ ...prev, onlineUsers: 'Success', usersData: usersResponse.data }));
      
      // Test online-doctors endpoint
      console.log('Testing /auth/online-doctors...');
      const doctorsResponse = await axios.get(`http://localhost:5000/api/auth/online-doctors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApiStatus(prev => ({ ...prev, onlineDoctors: 'Success', doctorsData: doctorsResponse.data }));
      
    } catch (error) {
      console.error('API test error:', error);
      
      // Try alternative endpoints
      try {
        console.log('Trying alternative endpoints without /auth/...');
        const altUsersResponse = await axios.get(`${baseUrl}/auth/online-users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApiStatus(prev => ({ 
          ...prev, 
          onlineUsers: 'Success (alternative)', 
          usersData: altUsersResponse.data,
          note: 'Using /online-users instead of /auth/online-users'
        }));
      } catch (altError) {
        console.error('Alternative endpoint also failed:', altError);
      }
      
      setApiStatus(prev => ({ 
        ...prev, 
        error: error.response?.data || error.message,
        status: error.response?.status,
        url: error.config?.url
      }));
    }
  };

  const discoverEndpoints = async () => {
    const baseUrl = 'http://localhost:5000/api';
    const token = localStorage.getItem('token_real') || localStorage.getItem('token');
    
    const endpointsToTest = [
      '/auth/online-users',
      '/auth/online-doctors', 
      '/online-users',
      '/online-doctors',
      '/users',
      '/doctors',
      '/auth/users',
      '/auth/doctors'
    ];
    
    const results = {};
    
    for (const endpoint of endpointsToTest) {
      try {
        const response = await axios.get(`${baseUrl}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        });
        results[endpoint] = { status: response.status, data: response.data };
      } catch (error) {
        results[endpoint] = { 
          status: error.response?.status || 'timeout', 
          error: error.message 
        };
      }
    }
    
    setApiStatus(prev => ({ ...prev, endpointDiscovery: results }));
    console.log('Endpoint discovery results:', results);
  };

  const fetchOnlineUsers = async () => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      if (currentUser.role === 'doctor') {
        const response = await getOnlineUsers();
        if (response.success) {
          setOnlineUsers(response.data);
          message.success(`Found ${response.data.length} online employees`);
        }
      } else if (currentUser.role === 'employee') {
        const response = await getOnlineDoctors();
        if (response.success) {
          setOnlineDoctors(response.data);
          message.success(`Found ${response.data.length} online doctors`);
        }
      }
    } catch (error) {
      console.error('Error fetching online users:', error);
      message.error('Failed to fetch online users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testStoreSocketId = async () => {
    if (!currentUser?.id) {
      message.error('No user logged in');
      return;
    }

    try {
      const response = await storeSocketId(currentUser.id, socketId);
      if (response.success) {
        message.success('Socket ID stored successfully!');
      }
    } catch (error) {
      message.error('Failed to store socket ID: ' + error.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Title level={2}>Call System Test & Debug</Title>
      
      <Card className="mb-4">
        <Title level={4}>Current User</Title>
        <Paragraph>
          <strong>ID:</strong> {currentUser?.id || 'Not logged in'}
        </Paragraph>
        <Paragraph>
          <strong>Name:</strong> {currentUser?.name || currentUser?.email || 'N/A'}
        </Paragraph>
        <Paragraph>
          <strong>Role:</strong> {currentUser?.role || 'N/A'}
        </Paragraph>
      </Card>

      <Card className="mb-4">
        <Title level={4}>API Status Test</Title>
        <div className="space-y-2">
          <div>
            <Text strong>Online Users Endpoint:</Text> 
            <Text code className="ml-2">{apiStatus.onlineUsers || 'Not tested'}</Text>
          </div>
          <div>
            <Text strong>Online Doctors Endpoint:</Text> 
            <Text code className="ml-2">{apiStatus.onlineDoctors || 'Not tested'}</Text>
          </div>
          {apiStatus.error && (
            <div>
              <Text strong className="text-red-500">Error:</Text> 
              <Text code className="ml-2 text-red-500">{apiStatus.error}</Text>
            </div>
          )}
          {apiStatus.status && (
            <div>
              <Text strong>Status Code:</Text> 
              <Text code className="ml-2">{apiStatus.status}</Text>
            </div>
          )}
          {apiStatus.url && (
            <div>
              <Text strong>Failed URL:</Text> 
              <Text code className="ml-2">{apiStatus.url}</Text>
            </div>
          )}
          {apiStatus.note && (
            <div>
              <Text strong className="text-blue-500">Note:</Text> 
              <Text className="ml-2 text-blue-500">{apiStatus.note}</Text>
            </div>
          )}
        </div>
        <div className="flex space-x-2 mt-2">
          <Button onClick={testApiEndpoints}>
            Test API Endpoints
          </Button>
          <Button onClick={discoverEndpoints}>
            Discover Endpoints
          </Button>
        </div>
      </Card>

      <Card className="mb-4">
        <Title level={4}>Test Socket ID Storage</Title>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={socketId}
            onChange={(e) => setSocketId(e.target.value)}
            placeholder="Enter socket ID"
            className="border p-2 rounded"
          />
          <Button type="primary" onClick={testStoreSocketId}>
            Store Socket ID
          </Button>
        </div>
      </Card>

      <Card className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <Title level={4}>
            {currentUser?.role === 'doctor' ? 'Online Employees' : 'Online Doctors'}
          </Title>
          <Button onClick={fetchOnlineUsers} loading={loading}>
            Refresh
          </Button>
        </div>
        
        {currentUser?.role === 'doctor' && onlineUsers.length > 0 && (
          <List
            dataSource={onlineUsers}
            renderItem={(user) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={`Employee ${user._id}`}
                  description={`Socket ID: ${user.socketId}`}
                />
              </List.Item>
            )}
          />
        )}
        
        {currentUser?.role === 'employee' && onlineDoctors.length > 0 && (
          <List
            dataSource={onlineDoctors}
            renderItem={(doctor) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={`Doctor ${doctor._id}`}
                  description={`Socket ID: ${doctor.socketId}`}
                />
              </List.Item>
            )}
          />
        )}
        
        {((currentUser?.role === 'doctor' && onlineUsers.length === 0) || 
          (currentUser?.role === 'employee' && onlineDoctors.length === 0)) && (
          <Paragraph className="text-gray-500">
            No {currentUser?.role === 'doctor' ? 'employees' : 'doctors'} online at the moment.
          </Paragraph>
        )}
      </Card>

      <Card>
        <Title level={4}>Raw API Response Data</Title>
        <div className="space-y-4">
          <div>
            <Text strong>Online Users Response:</Text>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(apiStatus.usersData, null, 2)}
            </pre>
          </div>
          <div>
            <Text strong>Online Doctors Response:</Text>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(apiStatus.doctorsData, null, 2)}
            </pre>
          </div>
        </div>
      </Card>

      {apiStatus.endpointDiscovery && (
        <Card className="mt-4">
          <Title level={4}>Endpoint Discovery Results</Title>
          <div className="space-y-2">
            {Object.entries(apiStatus.endpointDiscovery).map(([endpoint, result]) => (
              <div key={endpoint} className="border p-2 rounded">
                <Text strong>{endpoint}:</Text>
                <Text className={`ml-2 ${result.status === 200 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.status}
                </Text>
                {result.error && (
                  <Text className="ml-2 text-red-500">({result.error})</Text>
                )}
                {result.data && (
                  <div className="mt-1">
                    <Text className="text-xs text-gray-600">Data: {JSON.stringify(result.data).substring(0, 100)}...</Text>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CallTest; 