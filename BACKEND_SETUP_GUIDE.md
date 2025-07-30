# Backend Setup Guide for Call System

## Issue: 404 Error on API Endpoints

The 404 error indicates that the API endpoints `/api/auth/online-users` and `/api/auth/online-doctors` don't exist on your backend yet.

## Required Backend Endpoints

You need to implement these endpoints in your backend:

### 1. Store Socket ID Endpoint
```javascript
// POST /api/auth/store_socket_id
router.post('/store_socket_id', async (req, res) => {
  try {
    const { userId, socketId } = req.body;

    if (!userId || !socketId) {
      return res.status(400).json({
        success: false,
        message: 'User ID and Socket ID are required',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { socketId, isOnline: true, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Socket ID updated successfully',
      data: {
        userId: updatedUser._id,
        socketId: updatedUser.socketId,
        isOnline: updatedUser.isOnline,
      },
    });
  } catch (error) {
    console.error('Error updating socket ID:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});
```

### 2. Get Online Users Endpoint
```javascript
// GET /api/auth/online-users
router.get('/online-users', async (req, res) => {
  try {
    const onlineUsers = await User.find({ isOnline: true, role: 'user' }, '_id socketId role');
    res.status(200).json({
      success: true,
      message: 'Online users fetched successfully',
      data: onlineUsers,
    });
  } catch (error) {
    console.error('Error fetching online users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});
```

### 3. Get Online Doctors Endpoint
```javascript
// GET /api/auth/online-doctors
router.get('/online-doctors', async (req, res) => {
  try {
    const onlineDoctors = await User.find({ isOnline: true, role: 'doctor' }, '_id socketId role');
    res.status(200).json({
      success: true,
      message: 'Online doctors fetched successfully',
      data: onlineDoctors,
    });
  } catch (error) {
    console.error('Error fetching online doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});
```

## User Model Requirements

Make sure your User model has these fields:

```javascript
const userSchema = new mongoose.Schema({
  // ... existing fields
  socketId: {
    type: String,
    default: null
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'doctor', 'admin'],
    default: 'user'
  }
  // ... other fields
});
```

## Socket.IO Integration

Update your socket handler to store socket IDs:

```javascript
// In your socket handler
socket.on('user-joined', async (userData) => {
  try {
    // Store socket ID in database
    await User.findByIdAndUpdate(userData.id, {
      isOnline: true,
      socketId: socket.id
    });
    
    console.log(`User ${userData.id} connected with socket ${socket.id}`);
  } catch (error) {
    console.error('Error storing socket ID:', error);
  }
});

socket.on('disconnect', async () => {
  try {
    // Find user by socket ID and mark as offline
    await User.findOneAndUpdate(
      { socketId: socket.id },
      { isOnline: false, socketId: null }
    );
    
    console.log(`User disconnected: ${socket.id}`);
  } catch (error) {
    console.error('Error updating user status:', error);
  }
});
```

## Testing Steps

1. **Implement the endpoints** in your backend
2. **Test with Postman** or similar tool:
   - `POST /api/auth/store_socket_id`
   - `GET /api/auth/online-users`
   - `GET /api/auth/online-doctors`
3. **Use the test page** at `/inbox/call-test` to verify
4. **Check the endpoint discovery** to see what's working

## Alternative: Use Existing Endpoints

If you have different endpoint names, update the frontend:

```javascript
// In src/api/callApi.js, change the endpoints to match your backend
export const getOnlineUsers = async () => {
  const response = await callApi.get('/your-actual-endpoint');
  return response.data;
};
```

## Quick Fix for Testing

If you want to test the frontend without implementing the backend yet, you can create a mock response:

```javascript
// Temporary mock endpoint for testing
router.get('/online-doctors', (req, res) => {
  res.json({
    success: true,
    data: [
      { _id: 'doctor1', socketId: 'socket123', role: 'doctor' },
      { _id: 'doctor2', socketId: 'socket456', role: 'doctor' }
    ]
  });
});
```

This will allow you to test the frontend functionality while you implement the real backend endpoints. 