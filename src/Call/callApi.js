import axios from 'axios';

const API_BASE_URL = 'http://empolyee-backedn.onrender.com/api/auth';

// Create axios instance with default config
const callApi = axios.create({
  baseURL: 'http://empolyee-backedn.onrender.com/api/auth',
  timeout: 10000,
});

// Add request interceptor to include auth token
callApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token_real') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
callApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication failed');
    }
    return Promise.reject(error);
  }
);

// Store socket ID for user
export const storeSocketId = async (userId, socketId) => {
  try {
    const response = await callApi.post('/store_socket_id', {
      userId,
      socketId
    });
    return response.data;
  } catch (error) {
    console.error('Error storing socket ID:', error);
    throw error;
  }
};

// Get online users (employees)
export const getOnlineUsers = async () => {
  try {
    const response = await callApi.get('/online-users');
    return response.data;
  } catch (error) {
    console.error('Error fetching online users:', error);
    throw error;
  }
};

// Get online doctors
export const getOnlineDoctors = async () => {
  try {
    const response = await axios.get('http://empolyee-backedn.onrender.com/api/auth/online-doctors');
    return response.data;
  } catch (error) {
    console.error('Error fetching online doctors:', error);
    throw error;
  }
};

// Get call history
export const getCallHistory = async () => {
  try {
    const response = await callApi.get('/calls');
    return response.data;
  } catch (error) {
    console.error('Error fetching call history:', error);
    throw error;
  }
};

// Create a new call record
export const createCallRecord = async (callData) => {
  try {
    const response = await callApi.post('/calls', callData);
    return response.data;
  } catch (error) {
    console.error('Error creating call record:', error);
    throw error;
  }
};

// Update call status
export const updateCallStatus = async (callId, status) => {
  try {
    const response = await callApi.patch(`/calls/${callId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating call status:', error);
    throw error;
  }
};

export default callApi;