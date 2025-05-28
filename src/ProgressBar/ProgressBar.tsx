import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  // Calculate progress as a percentage of 50% (not 100%)
  const maxProgressWidth = 50; // percent of screen (vw)
  const progress =
    currentStep > totalSteps
      ? maxProgressWidth
      : (currentStep / totalSteps) * maxProgressWidth;

  return (
    <div
      style={{
        width: "100vw", // full screen width
        background: "#e0e0e0",
        height: 8,
        marginTop: 16,
        marginBottom: 16,
        position: "relative",
      }}
    >
      <div
        style={{
          width: `${progress}vw`, // filled portion maxes at 50vw
          height: "100%",
          background: "#1890ff",
          transition: "width 0.3s",
        }}
      />
    </div>
  );
};

export default ProgressBar;
