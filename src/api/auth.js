// api/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Setup axios with authentication

const authAxios = axios.create({
  baseURL: API_URL
});

// Add token to requests if available
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Register new user (initiates email verification)
export const registerUser = async (userData) => {

  const response = await axios.post(`http://localhost:5000/api/auth/register`, userData);
  return response.data;
};

// Verify OTP code
export const verifyOTP = async (verificationData) => {
  console.log(verificationData,'heello');
  
  const response = await axios.post(`http://localhost:5000/api/auth/verify-otp`, verificationData);
  return response.data;

};

export const sendReport = async (credentials) => {

  console.log(credentials);
  const { email, password } = credentials;

  const token = localStorage.getItem('token');
  const allIncidents = JSON.parse(localStorage.getItem('allIncidents'));

  const headers = token ? { 'x-auth-token': token } : {};

  const response = await axios.post(
    `http://localhost:5000/api/report`,
    {allIncidents}, // Yeh object hona chahiye
    { headers }
  );

  return response.data;
};

// Resend OTP
export const resendOTP = async (emailData) => {
  const response = await axios.post(`http://localhost:5000/resend-otp`, emailData);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {

  console.log(credentials);
  const { email, password } = credentials;

  const token = localStorage.getItem('token');
  const reportData = localStorage.getItem('token');

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await axios.post(
    `http://localhost:5000/api/auth/login`,
    { email, password }, // Yeh object hona chahiye
    { headers }
  );

  return response.data;
};


// Get user profile
export const getUserProfile = async () => {
  const response = await authAxios.get(`http://localhost:5000/auth/profile`);
  return response.data;
};

// Get all users (admin only)
export const getAllUsers = async () => {
  const response = await authAxios.get(`http://localhost:5000/auth/users`);
  return response.data;
};

// Logout (client-side only - clears localStorage)
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('loggedInUser');
  return true;
};