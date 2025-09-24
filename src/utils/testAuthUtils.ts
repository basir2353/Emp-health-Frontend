// Test utility functions for role-based routing

import { getLoggedInUser, getDashboardUrlByRole, hasRoleAccess, isUserAuthenticated } from './authUtils';

/**
 * Test function to simulate different user roles
 * This is for testing purposes only - remove in production
 */
export const testRoleBasedRouting = () => {
  console.log('=== Testing Role-Based Routing ===');
  
  // Test data for different roles
  const testUsers = [
    {
      id: "68925094fd44c15e94becbd4",
      name: "Abdul Basit",
      email: "abasit5612345@gmail.com",
      role: "employee"
    },
    {
      id: "68925094fd44c15e94becbd5",
      name: "Dr. John Smith",
      email: "john.smith@hospital.com",
      role: "doctor"
    },
    {
      id: "68925094fd44c15e94becbd6",
      name: "Admin User",
      email: "admin@hospital.com",
      role: "admin"
    }
  ];

  testUsers.forEach(user => {
    console.log(`\n--- Testing User: ${user.name} (${user.role}) ---`);
    
    // Set user in localStorage for testing
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    
    // Test authentication
    console.log('Is authenticated:', isUserAuthenticated());
    
    // Test getting logged in user
    const loggedInUser = getLoggedInUser();
    console.log('Logged in user:', loggedInUser);
    
    // Test getting dashboard URL
    const dashboardUrl = getDashboardUrlByRole(user.role);
    console.log('Dashboard URL:', dashboardUrl);
    
    // Test role access
    console.log('Has admin access:', hasRoleAccess(user.role, 'admin'));
    console.log('Has doctor access:', hasRoleAccess(user.role, 'doctor'));
    console.log('Has employee access:', hasRoleAccess(user.role, 'employee'));
  });
  
  // Clear test data
  localStorage.removeItem("loggedInUser");
  console.log('\n=== Test Complete ===');
};

/**
 * Set a test user in localStorage for manual testing
 * @param role - The role to test ('employee', 'doctor', 'admin')
 */
export const setTestUser = (role: 'employee' | 'doctor' | 'admin') => {
  const testUsers = {
    employee: {
      id: "68925094fd44c15e94becbd4",
      name: "Abdul Basit",
      email: "abasit5612345@gmail.com",
      role: "employee"
    },
    doctor: {
      id: "68925094fd44c15e94becbd5",
      name: "Dr. John Smith",
      email: "john.smith@hospital.com",
      role: "doctor"
    },
    admin: {
      id: "68925094fd44c15e94becbd6",
      name: "Admin User",
      email: "admin@hospital.com",
      role: "admin"
    }
  };
  
  localStorage.setItem("loggedInUser", JSON.stringify(testUsers[role]));
  console.log(`Test user set: ${testUsers[role].name} (${role})`);
  console.log(`Expected dashboard URL: ${getDashboardUrlByRole(role)}`);
};
