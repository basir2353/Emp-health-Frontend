# Role-Based Routing Implementation

This document explains the role-based routing system implemented in the Employee Health Frontend application.

## Overview

The application now supports role-based routing where users are automatically redirected to their appropriate dashboard based on their role stored in localStorage as `loggedInUser`.

## User Roles

The system supports three main roles:
- **employee**: Regular employees (default role)
- **doctor**: Medical professionals
- **admin**: Administrative users

## localStorage Structure

The `loggedInUser` object is stored in localStorage with the following structure:

```json
{
    "id": "68925094fd44c15e94becbd4",
    "name": "Abdul Basit",
    "email": "abasit5612345@gmail.com",
    "role": "employee"
}
```

## Dashboard URLs

Based on user role, users are automatically redirected to:

- **employee**: `/health` - Health dashboard for employees
- **doctor**: `/doctor` - Doctor-specific dashboard
- **admin**: `/admin` - Admin dashboard with administrative features

## Implementation Details

### 1. Auth Utilities (`src/utils/authUtils.ts`)

Key functions:
- `getLoggedInUser()`: Extracts and validates loggedInUser from localStorage
- `getDashboardUrlByRole(role)`: Returns appropriate dashboard URL based on role
- `hasRoleAccess(userRole, requiredRole)`: Checks if user has required role access
- `isUserAuthenticated()`: Checks if user is properly authenticated

### 2. Protected Route Component (`src/Component/ProtectedRoute/ProtectedRoute.jsx`)

Enhanced with:
- Role-based access control
- Automatic redirect to appropriate dashboard
- Protection against accessing other role's dashboards
- Integration with onboarding flow

### 3. App Routing (`src/App.tsx`)

Updated routing structure:
- `/health/*` - Employee dashboard (requires employee role)
- `/doctor/*` - Doctor dashboard (requires doctor role)
- `/admin/*` - Admin dashboard (requires admin role)
- Role-specific routes within each dashboard

## How It Works

1. **Authentication Check**: When accessing protected routes, the system checks for `loggedInUser` in localStorage
2. **Role Validation**: Validates that the user object has required properties (id, email, role)
3. **Dashboard Routing**: Automatically redirects users to their role-appropriate dashboard
4. **Access Control**: Prevents users from accessing dashboards not meant for their role
5. **URL Protection**: If a user manually changes the URL to access a different role's dashboard, they are redirected to their own dashboard

## Testing

Use the test utilities in `src/utils/testAuthUtils.ts`:

```javascript
import { setTestUser, testRoleBasedRouting } from './utils/testAuthUtils';

// Test with different roles
setTestUser('employee');  // Redirects to /health
setTestUser('doctor');    // Redirects to /doctor
setTestUser('admin');     // Redirects to /admin

// Run comprehensive test
testRoleBasedRouting();
```

## Example Usage

### Setting a User in localStorage

```javascript
const user = {
    id: "68925094fd44c15e94becbd4",
    name: "Abdul Basit",
    email: "abasit5612345@gmail.com",
    role: "employee"
};

localStorage.setItem("loggedInUser", JSON.stringify(user));
```

### Role-Based Redirects

- Employee accessing `/doctor` → Redirected to `/health`
- Doctor accessing `/admin` → Redirected to `/doctor`
- Admin accessing `/health` → Redirected to `/admin`

## Security Features

1. **Role Validation**: Ensures users can only access their designated areas
2. **Automatic Redirects**: Prevents unauthorized access through URL manipulation
3. **Onboarding Integration**: Respects onboarding flow while implementing role-based routing
4. **Error Handling**: Graceful handling of malformed or missing user data

## Integration with Existing Features

- **Onboarding**: Role-based routing respects the existing onboarding flow
- **Protected Routes**: All existing protected routes now include role-based access control
- **Dashboard Layouts**: Each role has access to appropriate dashboard features
- **Authentication**: Seamlessly integrates with existing authentication system

## Migration Notes

- The system maintains backward compatibility with the existing `user` localStorage key
- Existing authentication flows continue to work
- No breaking changes to existing components
- Enhanced security without disrupting user experience
