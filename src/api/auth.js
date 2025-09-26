// services/api.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Axios instance with token injection
const authAxios = axios.create({
  baseURL: API_URL,
});

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

// Register user
export const registerUser = async (userData) => {
  const response = await axios.post(`http://localhost:5000/api/auth/register`, userData);
  return response.data;
};

// Verify OTP
export const verifyOTP = async (data) => {
  const response = await axios.post(`http://localhost:5000/api/auth/verify-otp`, data);
  return response.data;
};

// Resend OTP
export const resendOTP = async (emailData) => {
  const response = await axios.post(`${API_URL}/auth/resend-otp`, emailData);
  return response.data;
};

// Login user
export const loginUser = async ({ email, password }) => {
  const response = await axios.post(`http://localhost:5000/api/auth/login`, {
    email,
    password,
  });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Get authenticated user profile
export const getUserProfile = async () => {
  const response = await authAxios.get(`/auth/profile`);
  return response.data;
};

// Admin: Get all users
export const getAllUsers = async () => {
  const response = await authAxios.get(`/auth/users`);
  return response.data;
};

// Submit report (with token + incidents)
export const sendReport = async () => {
  const allIncidents = JSON.parse(localStorage.getItem('allIncidents') || '[]');
  const response = await authAxios.post(`/report`, { allIncidents });
  return response.data;
};

// Create appointment
export const createAppointment = async (appointmentData) => {
  const response = await authAxios.post(`/appointments`, appointmentData);
  return response.data;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('user');
  return true;
};
