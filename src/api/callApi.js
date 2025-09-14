import axios from 'axios';

const API_BASE_URL = 'https://empolyee-backedn.onrender.com/api';

// Create axios instance with default config
const callApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor to include auth token
callApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token_real') || localStorage.getItem('token');
    if (token) {
      // Try different token formats
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-auth-token'] = token;
      console.log('Adding auth token to request:', token.substring(0, 20) + '...');
    } else {
      console.warn('No auth token found in localStorage');
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
    const response = await callApi.post('/auth/store_socket_id', {
      userId,
      socketId
    });
    return response.data;
  } catch (error) {
    console.error('Error storing socket ID:', error);
    throw error;
  }
};
// Frontend: src/api/callApi.js
export const leaveCall = async (userId) => {
  try {
    console.log('Calling leaveCall API for user:', userId);
    const response = await callApi.post('/auth/leave', { userId });
    console.log('leaveCall response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error disconnecting user:', error.response?.data || error.message);
    throw error;
  }
};
// Get online users (employees)
export const getOnlineUsers = async () => {
  try {
    console.log('Calling getOnlineUsers API...');
    const response = await callApi.get('https://empolyee-backedn.onrender.com/api/auth/online-users');
    console.log('getOnlineUsers response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching online users:', error.response?.data || error.message);
    throw error;
  }
};

// Get online doctors
export const getOnlineDoctors = async () => {
  try {
    console.log('Calling getOnlineDoctors API...');
    const response = await callApi.get('https://empolyee-backedn.onrender.com/api/auth/online-doctors');
    console.log('getOnlineDoctors response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching online doctors:', error.response?.data || error.message);
    throw error;
  }
};

// Get all doctors
export const getAllDoctors = async () => {
  try {
    console.log('Calling getAllDoctors API...');
    const response = await callApi.get('https://empolyee-backedn.onrender.com/api/all-doctors');
    console.log('getAllDoctors response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching all doctors:', error.response?.data || error.message);
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

// Get all appointments
export const getAllAppointments = async () => {
  try {
    console.log('Calling getAllAppointments API...');
    const response = await callApi.get('https://empolyee-backedn.onrender.com/api/appointments');
    console.log('getAllAppointments response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error.response?.data || error.message);
    throw error;
  }
};

// Get user appointments (for employees)
export const getUserAppointments = async (userId) => {
  try {
    console.log('Calling getUserAppointments API for user:', userId);
    const response = await callApi.get(`https://empolyee-backedn.onrender.com/api/appointments/user/${userId}`);
    console.log('getUserAppointments response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user appointments:', error.response?.data || error.message);
    throw error;
  }
};

// Get doctor appointments
export const getDoctorAppointments = async (doctorId) => {
  try {
    console.log('Calling getDoctorAppointments API for doctor:', doctorId);
    const response = await callApi.get(`https://empolyee-backedn.onrender.com/api/appointments/doctor/${doctorId}`);
    console.log('getDoctorAppointments response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor appointments:', error.response?.data || error.message);
    throw error;
  }
};

export default callApi; 