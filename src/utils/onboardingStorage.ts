export const saveStepData = (stepNumber: number, data: any) => {
  const existing = JSON.parse(localStorage.getItem("onboardingSteps") || "[]");

  const updated = [...existing.filter((item: any) => item.step !== stepNumber), { step: stepNumber, ...data }];

  localStorage.setItem("onboardingSteps", JSON.stringify(updated));
};
