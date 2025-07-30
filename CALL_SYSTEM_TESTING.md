# Call System Testing Guide

## Issue: Not seeing online doctors/users

### Step 1: Test the API Endpoints

1. **Navigate to the test page:**
   - Go to: `http://localhost:3000/inbox/call-test`
   - This will show you detailed debugging information

2. **Check API Status:**
   - Click "Test API Endpoints" button
   - Look for any error messages or status codes
   - Check the "Raw API Response Data" section

### Step 2: Verify Backend Routes

Make sure your backend has these routes working:

```javascript
// These should return online users/doctors
GET /api/online-users
GET /api/online-doctors

// This should store socket ID
POST /api/store_socket_id
```

### Step 3: Test with Different Users

1. **Login as a Doctor:**
   - Login with a doctor account
   - Go to `/inbox/call`
   - You should see "Online Employees" section
   - Click "Fetch Online Users" to test

2. **Login as an Employee:**
   - Login with an employee account  
   - Go to `/inbox/call`
   - You should see "Online Doctors" section
   - Click "Fetch Online Users" to test

### Step 4: Check Console Logs

Open browser developer tools (F12) and check:

1. **Network tab:** Look for API calls to `/online-users` and `/online-doctors`
2. **Console tab:** Look for error messages or debugging logs

### Step 5: Common Issues & Solutions

#### Issue 1: "No doctors/employees online"
**Solution:** Make sure doctors/employees are:
- Logged into the system
- Have connected to the call service (socket connection)
- Have their socket ID stored in the database

#### Issue 2: API errors (401, 404, 500)
**Solution:** 
- Check if authentication token is valid
- Verify backend routes are working
- Check backend logs for errors

#### Issue 3: Empty response from API
**Solution:**
- Check if users have `isOnline: true` in database
- Verify `socketId` field is populated
- Check if role filtering is working correctly

### Step 6: Manual Testing

1. **Store Socket ID manually:**
   - Use the test page to manually store a socket ID
   - Check if it appears in the online users list

2. **Check Database:**
   - Verify users have `isOnline: true`
   - Verify `socketId` field is not null
   - Check user roles are correct

### Step 7: Backend Verification

Make sure your backend socket handler is:
1. Storing socket IDs when users connect
2. Setting `isOnline: true` when users join
3. Setting `isOnline: false` when users disconnect
4. Properly filtering users by role

### Debug Information

The enhanced Call component now includes:
- ✅ Better error handling and logging
- ✅ Manual refresh buttons
- ✅ Detailed console logs
- ✅ API response debugging
- ✅ Test component for debugging

### Next Steps

If you're still not seeing online users:

1. Check the test page (`/inbox/call-test`) for detailed error information
2. Verify your backend routes are working with Postman or similar tool
3. Check if users are actually connecting and storing their socket IDs
4. Verify the database has users with `isOnline: true` and valid `socketId` values 