import React, { ReactNode, useState, useEffect } from "react";
import Navbar from "../Navbar";
import Bot from "../BotStatic/BotStatic";
import { useLocation } from "react-router-dom";
import ProgressBar from "../../ProgressBar/ProgressBar";
const stepPaths = [
  "/", "/step-2", "/step-3", "/step-4", "/step-5", "/step-6", "/step-7", "/step-8", "/step-9"
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const currentStep = stepPaths.indexOf(location.pathname) + 1;
  const totalSteps = stepPaths.length;

  return (
    <div>
      <Navbar />
<ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      {children}
      <Bot /> 
    </div>
  );
};

export default Layout;
