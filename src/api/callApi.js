import axios from 'axios';

const API_BASE_URL = 'https://empolyee-backedn.onrender.com/api';

const callApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000, // Increased timeout for cross-IP scenarios
  withCredentials: true,
});

callApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token_real') || localStorage.getItem('token');
    if (token) {
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

callApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication failed:', error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.message);
      throw new Error('Network timeout. Please check your connection or try again.');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('Network error:', error.message);
      throw new Error('Network error. Please check your connection or server availability.');
    }
    return Promise.reject(error);
  }
);

export const storeSocketId = async (userId, socketId) => {
  try {
    const response = await callApi.post('/auth/store_socket_id', {
      userId,
      socketId,
    });
    return response.data;
  } catch (error) {
    console.error('Error storing socket ID:', error.response?.data || error.message);
    throw error;
  }
};

export const leaveCall = async (userId) => {
  try {
    console.log('Calling leaveCall API for user:', userId);
    const response = await callApi.post('/auth/leave', { userId });
    return response.data;
  } catch (error) {
    console.error('Error disconnecting user:', error.response?.data || error.message);
    throw error;
  }
};

export const getOnlineUsers = async () => {
  try {
    const response = await callApi.get('/auth/online-users');
    return response.data;
  } catch (error) {
    console.error('Error fetching online users:', error.response?.data || error.message);
    throw error;
  }
};

export const getOnlineDoctors = async () => {
  try {
    const response = await callApi.get('/auth/online-doctors');
    return response.data;
  } catch (error) {
    console.error('Error fetching online doctors:', error.response?.data || error.message);
    throw error;
  }
};

export const getCallHistory = async () => {
  try {
    const response = await callApi.get('/calls');
    return response.data;
  } catch (error) {
    console.error('Error fetching call history:', error.response?.data || error.message);
    throw error;
  }
};

export const createCallRecord = async (callData) => {
  try {
    const response = await callApi.post('/calls', callData);
    return response.data;
  } catch (error) {
    console.error('Error creating call record:', error.response?.data || error.message);
    throw error;
  }
};

export const updateCallStatus = async (callId, status) => {
  try {
    const response = await callApi.patch(`/calls/${callId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating call status:', error.response?.data || error.message);
    throw error;
  }
};

export default callApi;