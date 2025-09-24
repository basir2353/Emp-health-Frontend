import axios from 'axios';

const API_URL = 'https://empolyee-backedn.onrender.com/api';

// Axios instance with token injection for authenticated requests
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

/**
 * Get current user ID from localStorage or token
 */
const getCurrentUserId = () => {
  // Try to get user ID from localStorage first
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    try {
      const user = JSON.parse(loggedInUser);
      return user.id || user._id || user.userId;
    } catch (error) {
      console.error('Error parsing loggedInUser:', error);
    }
  }
  
  // Fallback: generate a temporary ID or use email as identifier
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.id || userData._id || userData.email || 'temp-user';
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  return 'temp-user';
};

/**
 * Store single onboarding step
 * @param {number} stepNumber - Step number (1-9)
 * @param {object} stepData - Step data to store
 * @returns {Promise<object>} API response
 */
export const storeOnboardingStep = async (stepNumber, stepData) => {
  try {
    const userId = getCurrentUserId();
    const response = await authAxios.post('/onboarding/store', {
      userId,
      data: [{
        step: stepNumber,
        ...stepData
      }]
    });
    return response.data;
  } catch (error) {
    console.error('Error storing onboarding step:', error);
    throw error;
  }
};

/**
 * Store multiple onboarding steps (bulk operation)
 * @param {Array} stepsData - Array of step data objects
 * @returns {Promise<object>} API response
 */
export const storeMultipleOnboardingSteps = async (stepsData) => {
  try {
    const userId = getCurrentUserId();
    const response = await authAxios.post('/onboarding/store-multiple', {
      userId,
      data: stepsData
    });
    return response.data;
  } catch (error) {
    console.error('Error storing multiple onboarding steps:', error);
    throw error;
  }
};

/**
 * Get user's complete onboarding progress
 * @param {string} userId - User ID (optional, uses current user if not provided)
 * @returns {Promise<object>} User's onboarding progress
 */
export const getOnboardingProgress = async (userId = null) => {
  try {
    const targetUserId = userId || getCurrentUserId();
    const response = await authAxios.get(`/onboarding/progress/${targetUserId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching onboarding progress:', error);
    throw error;
  }
};

/**
 * Get specific step data for a user
 * @param {number} stepNumber - Step number (1-9)
 * @param {string} userId - User ID (optional, uses current user if not provided)
 * @returns {Promise<object>} Step data
 */
export const getOnboardingStep = async (stepNumber, userId = null) => {
  try {
    const targetUserId = userId || getCurrentUserId();
    const response = await authAxios.get(`/onboarding/step/${targetUserId}/${stepNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching onboarding step:', error);
    throw error;
  }
};

/**
 * Delete specific onboarding step
 * @param {number} stepNumber - Step number (1-9)
 * @param {string} userId - User ID (optional, uses current user if not provided)
 * @returns {Promise<object>} API response
 */
export const deleteOnboardingStep = async (stepNumber, userId = null) => {
  try {
    const targetUserId = userId || getCurrentUserId();
    const response = await authAxios.delete(`/onboarding/step/${targetUserId}/${stepNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting onboarding step:', error);
    throw error;
  }
};

/**
 * Health check for onboarding API
 * @returns {Promise<object>} Health status
 */
export const checkOnboardingHealth = async () => {
  try {
    const response = await authAxios.get('/onboarding/health');
    return response.data;
  } catch (error) {
    console.error('Error checking onboarding health:', error);
    throw error;
  }
};

/**
 * Complete onboarding process - stores all steps and marks as complete
 * @param {object} allStepsData - Object containing all step data
 * @returns {Promise<object>} API response
 */
export const completeOnboardingProcess = async (allStepsData) => {
  try {
    const userId = getCurrentUserId();
    
    // Prepare steps data for bulk storage
    const stepsData = Object.keys(allStepsData).map(stepNumber => ({
      step: parseInt(stepNumber),
      ...allStepsData[stepNumber]
    }));
    
    // Store all steps at once
    const response = await storeMultipleOnboardingSteps(stepsData);
    
    return response;
  } catch (error) {
    console.error('Error completing onboarding process:', error);
    throw error;
  }
};

/**
 * Load user's onboarding data on login
 * This should be called when user logs in to populate local storage
 * @returns {Promise<object>} User's onboarding progress
 */
export const loadUserOnboardingData = async () => {
  try {
    const progress = await getOnboardingProgress();
    
    // Store in localStorage for offline access
    if (progress.success && progress.data) {
      localStorage.setItem('onboardingProgress', JSON.stringify(progress.data));
      
      // Update local onboarding state
      localStorage.setItem('onboardingState', JSON.stringify({
        isFirstTime: !progress.data.isComplete,
        currentStep: progress.data.currentStep || 1,
        completedSteps: progress.data.completedSteps || [],
        isCompleted: progress.data.isComplete,
        lastCompletedAt: progress.data.lastCompletedAt
      }));
    }
    
    return progress;
  } catch (error) {
    console.error('Error loading user onboarding data:', error);
    // Return default state if API fails
    return {
      success: false,
      data: {
        userId: getCurrentUserId(),
        steps: [],
        totalSteps: 9,
        isComplete: false,
        progressPercentage: 0
      }
    };
  }
};

export default {
  storeOnboardingStep,
  storeMultipleOnboardingSteps,
  getOnboardingProgress,
  getOnboardingStep,
  deleteOnboardingStep,
  checkOnboardingHealth,
  completeOnboardingProcess,
  loadUserOnboardingData
};

