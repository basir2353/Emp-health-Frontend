import React, { createContext, useEffect, useState } from "react";

// Define types for the user and context
interface User {
  id: string;
  email: string;
  role?: string;
  name?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (userData: User) => boolean;
  logout: () => boolean;
}

// Create the Auth Context with TypeScript
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: () => false,
  logout: () => false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

// Create the Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage or session)
    const checkLoggedIn = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = (userData: User): boolean => {
    try {
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      setCurrentUser(userData);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Logout function
  const logout = (): boolean => {
    try {
      // Remove user data from localStorage
      localStorage.removeItem("user");
      setCurrentUser(null);
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };

  // Context value
  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;