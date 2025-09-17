// Legacy compatibility - redirect to new onboarding system
export const saveStepData = (stepNumber: number, data: any) => {
  // Import the new function to maintain backward compatibility
  const { saveStepData: newSaveStepData } = require('./onboardingUtils');
  return newSaveStepData(stepNumber, data);
};
