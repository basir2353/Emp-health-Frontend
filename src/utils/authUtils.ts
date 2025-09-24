// Auth utility functions for user management and role-based routing

export interface LoggedInUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Extract loggedInUser from localStorage with proper error handling
 * @returns LoggedInUser object or null if not found/invalid
 */
export const getLoggedInUser = (): LoggedInUser | null => {
  try {
    const loggedInUserStr = localStorage.getItem("loggedInUser");
    if (!loggedInUserStr) {
      return null;
    }
    
    const user = JSON.parse(loggedInUserStr);
    
    // Validate that the user object has required properties
    if (!user || typeof user !== 'object') {
      console.warn('Invalid loggedInUser data in localStorage');
      return null;
    }
    
    if (!user.id || !user.email || !user.role) {
      console.warn('loggedInUser missing required properties (id, email, role)');
      return null;
    }
    
    return user as LoggedInUser;
  } catch (error) {
    console.error('Error parsing loggedInUser from localStorage:', error);
    return null;
  }
};

/**
 * Get the appropriate dashboard URL based on user role
 * @param role - User role (employee, doctor, admin)
 * @returns Dashboard URL path
 */
export const getDashboardUrlByRole = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'doctor':
      return '/doctor';
    case 'admin':
      return '/admin';
    case 'employee':
    default:
      return '/health';
  }
};

/**
 * Check if user has access to a specific route based on role
 * @param userRole - User's role
 * @param requiredRole - Required role for the route
 * @returns boolean indicating access permission
 */
export const hasRoleAccess = (userRole: string, requiredRole?: string): boolean => {
  if (!requiredRole) {
    return true; // No specific role required
  }
  
  return userRole.toLowerCase() === requiredRole.toLowerCase();
};

/**
 * Check if user is authenticated (has valid loggedInUser in localStorage)
 * @returns boolean indicating authentication status
 */
export const isUserAuthenticated = (): boolean => {
  return getLoggedInUser() !== null;
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("user"); // Also clear the old 'user' key for compatibility
};
