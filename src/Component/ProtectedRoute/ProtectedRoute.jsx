import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import { isFirstTimeUser, isOnboardingCompleted, getCurrentStep } from "../../utils/onboardingUtils";


interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();
  const userExist = localStorage.getItem("user");
  
  // If no user is logged in, redirect to login
  if (!userExist) return <Navigate to="/login" replace />;

  // Check if user is first time and onboarding is not completed
  const isFirstTime = isFirstTimeUser();
  const onboardingCompleted = isOnboardingCompleted();
  
  // If user is first time and onboarding is not completed
  if (isFirstTime && !onboardingCompleted) {
    // If they're trying to access health routes, redirect to onboarding
    if (location.pathname.startsWith('/health') || 
        location.pathname.startsWith('/wellness') || 
        location.pathname.startsWith('/safety') ||
        location.pathname.startsWith('/admin') ||
        location.pathname.startsWith('/doctor') ||
        location.pathname.startsWith('/inbox')) {
      return <Navigate to="/" replace />;
    }
    
    // If they're on onboarding steps, allow them to continue
    if (location.pathname === '/' || location.pathname.startsWith('/step-')) {
      return <>{children}</>;
    }
    
    // For any other route, redirect to onboarding start
    return <Navigate to="/" replace />;
  }
  
  // If onboarding is completed but user is trying to access onboarding steps
  if (onboardingCompleted && (location.pathname === '/' || location.pathname.startsWith('/step-'))) {
    // Redirect to health dashboard
    return <Navigate to="/health" replace />;
  }

  // Role-based access control (commented out for now as per original code)
  // if (requiredRole && user?.role !== requiredRole) {
  //   return <Navigate to="/unauthorized" replace />; // You can define this route
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
