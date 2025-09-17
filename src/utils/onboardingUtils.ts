// Onboarding state management utility
export interface OnboardingState {
  isFirstTime: boolean;
  currentStep: number;
  completedSteps: number[];
  isCompleted: boolean;
  lastCompletedAt?: string;
}

export interface OnboardingStepData {
  step: number;
  [key: string]: any;
}

// Local storage keys
const ONBOARDING_STATE_KEY = 'onboardingState';
const ONBOARDING_STEPS_KEY = 'onboardingSteps';
const USER_FIRST_TIME_KEY = 'userFirstTime';

/**
 * Initialize onboarding state for a new user
 */
export const initializeOnboarding = (userId?: string): OnboardingState => {
  const state: OnboardingState = {
    isFirstTime: true,
    currentStep: 1,
    completedSteps: [],
    isCompleted: false,
    lastCompletedAt: new Date().toISOString()
  };

  localStorage.setItem(ONBOARDING_STATE_KEY, JSON.stringify(state));
  localStorage.setItem(USER_FIRST_TIME_KEY, 'true');
  
  // Clear any existing onboarding steps data
  localStorage.removeItem(ONBOARDING_STEPS_KEY);
  localStorage.removeItem('stepsCompleted');
  localStorage.removeItem('botVisible');
  
  return state;
};

/**
 * Get current onboarding state
 */
export const getOnboardingState = (): OnboardingState | null => {
  try {
    const state = localStorage.getItem(ONBOARDING_STATE_KEY);
    return state ? JSON.parse(state) : null;
  } catch (error) {
    console.error('Error parsing onboarding state:', error);
    return null;
  }
};

/**
 * Update onboarding state
 */
export const updateOnboardingState = (updates: Partial<OnboardingState>): OnboardingState => {
  const currentState = getOnboardingState() || initializeOnboarding();
  const newState = { ...currentState, ...updates };
  
  localStorage.setItem(ONBOARDING_STATE_KEY, JSON.stringify(newState));
  return newState;
};

/**
 * Mark a step as completed
 */
export const completeStep = (stepNumber: number): OnboardingState => {
  const currentState = getOnboardingState();
  if (!currentState) {
    return initializeOnboarding();
  }

  const completedSteps = [...currentState.completedSteps];
  if (!completedSteps.includes(stepNumber)) {
    completedSteps.push(stepNumber);
  }

  const newState = updateOnboardingState({
    currentStep: stepNumber + 1,
    completedSteps,
    isCompleted: completedSteps.length >= 9,
    lastCompletedAt: new Date().toISOString()
  });

  return newState;
};

/**
 * Complete the entire onboarding process
 */
export const completeOnboarding = (): OnboardingState => {
  const newState = updateOnboardingState({
    isFirstTime: false,
    isCompleted: true,
    currentStep: 9,
    completedSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    lastCompletedAt: new Date().toISOString()
  });

  // Set legacy flags for backward compatibility
  localStorage.setItem('stepsCompleted', 'true');
  localStorage.setItem('botVisible', 'true');
  localStorage.setItem(USER_FIRST_TIME_KEY, 'false');

  return newState;
};

/**
 * Check if user is first time
 */
export const isFirstTimeUser = (): boolean => {
  const firstTime = localStorage.getItem(USER_FIRST_TIME_KEY);
  return firstTime === 'true' || firstTime === null;
};

/**
 * Check if onboarding is completed
 */
export const isOnboardingCompleted = (): boolean => {
  const state = getOnboardingState();
  return state?.isCompleted || localStorage.getItem('stepsCompleted') === 'true';
};

/**
 * Get current step for user
 */
export const getCurrentStep = (): number => {
  const state = getOnboardingState();
  return state?.currentStep || 1;
};

/**
 * Save step data (legacy compatibility)
 */
export const saveStepData = (stepNumber: number, data: any): void => {
  const existing = JSON.parse(localStorage.getItem(ONBOARDING_STEPS_KEY) || "[]");
  const updated = [...existing.filter((item: any) => item.step !== stepNumber), { step: stepNumber, ...data }];
  localStorage.setItem(ONBOARDING_STEPS_KEY, JSON.stringify(updated));
};

/**
 * Get step data
 */
export const getStepData = (stepNumber?: number): OnboardingStepData[] => {
  const data = JSON.parse(localStorage.getItem(ONBOARDING_STEPS_KEY) || "[]");
  return stepNumber ? data.filter((item: any) => item.step === stepNumber) : data;
};

/**
 * Clear all onboarding data (for testing or reset)
 */
export const clearOnboardingData = (): void => {
  localStorage.removeItem(ONBOARDING_STATE_KEY);
  localStorage.removeItem(ONBOARDING_STEPS_KEY);
  localStorage.removeItem(USER_FIRST_TIME_KEY);
  localStorage.removeItem('stepsCompleted');
  localStorage.removeItem('botVisible');
};

/**
 * Reset onboarding for existing user (if they want to go through it again)
 */
export const resetOnboarding = (): OnboardingState => {
  clearOnboardingData();
  return initializeOnboarding();
};
