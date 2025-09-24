import { useContext, useEffect, useState, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import {
  getLoggedInUser,
  isUserAuthenticated,
} from "../../utils/authUtils";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | null;
}

const allowedRoutesByRole: Record<string, string[]> = {
  employee: ["/health","/admin-schedule-appointments", "/safety", "/wellness", "/inbox", "/step-", "/"], // onboarding and dashboards
  admin: ["/admin", "/safety", "/wellness"],
  doctor: ["/doctor", "/safety","/inbox",],
};

const dashboardByRole: Record<string, string> = {
  employee: "/health",
  admin: "/admin/schedule-appointments",
  doctor: "/doctor/schedule-appointments",
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = null }) => {
  useContext(AuthContext);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [onboardingExists, setOnboardingExists] = useState<boolean | null>(null);

  const loggedInUser = getLoggedInUser();

  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      if (!loggedInUser?.id) {
        setOnboardingExists(null);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `https://empolyee-backedn.onrender.com/api/auth/check_onboard?userId=${loggedInUser.id}`
        );
        const data = await res.json();
        if (data.success) {
          setOnboardingExists(data.exists);
        } else {
          setOnboardingExists(null);
        }
      } catch (err) {
        setOnboardingExists(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingStatus();
  }, [loggedInUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isUserAuthenticated() || !loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  const userRole = loggedInUser.role;
  const allowedRoutes = allowedRoutesByRole[userRole] || [];
  const currentPath = location.pathname;

  // Employee onboarding logic
  if (userRole === "employee" && onboardingExists === false) {
    if (currentPath === "/" || currentPath.startsWith("/step-")) {
      return <>{children}</>;
    }
    return <Navigate to="/" replace />;
  }
  if (userRole === "employee" && onboardingExists === true) {
    if (currentPath === "/" || currentPath.startsWith("/step-")) {
      return <Navigate to="/health" replace />;
    }
  }

  // Strict route protection for all roles
  const isAllowed = allowedRoutes.some(route =>
    route === "/" ? currentPath === "/" : currentPath.startsWith(route)
  );
  if (!isAllowed) {
    return <Navigate to={dashboardByRole[userRole]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;