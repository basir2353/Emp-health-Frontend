import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";


interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const userExist = localStorage.getItem("user");
  if (!userExist) return <Navigate to="/login" replace />;

  // if (requiredRole && user?.role !== requiredRole) {
  //   return <Navigate to="/unauthorized" replace />; // You can define this route
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
