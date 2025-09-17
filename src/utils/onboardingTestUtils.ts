// Test utilities for onboarding flow
import { clearOnboardingData, initializeOnboarding, isFirstTimeUser, isOnboardingCompleted } from './onboardingUtils';

/**
 * Reset user to first-time state for testing
 */
export const resetToFirstTimeUser = (): void => {
  clearOnboardingData();
  console.log('User reset to first-time state');
};

/**
 * Simulate completed onboarding for testing
 */
export const simulateCompletedOnboarding = (): void => {
  clearOnboardingData();
  initializeOnboarding('test-user');
  
  // Mark all steps as completed
  for (let i = 1; i <= 9; i++) {
    const { completeStep } = require('./onboardingUtils');
    completeStep(i);
  }
  
  // Complete onboarding
  const { completeOnboarding } = require('./onboardingUtils');
  completeOnboarding();
  
  console.log('Onboarding simulation completed');
};

/**
 * Get current onboarding status for debugging
 */
export const getOnboardingStatus = () => {
  const status = {
    isFirstTime: isFirstTimeUser(),
    isCompleted: isOnboardingCompleted(),
    localStorage: {
      userFirstTime: localStorage.getItem('userFirstTime'),
      stepsCompleted: localStorage.getItem('stepsCompleted'),
      botVisible: localStorage.getItem('botVisible'),
      onboardingState: localStorage.getItem('onboardingState'),
      onboardingSteps: localStorage.getItem('onboardingSteps')
    }
  };
  
  console.log('Onboarding Status:', status);
  return status;
};

// Make functions available globally for testing in browser console
if (typeof window !== 'undefined') {
  (window as any).onboardingTest = {
    resetToFirstTimeUser,
    simulateCompletedOnboarding,
    getOnboardingStatus
  };
}
