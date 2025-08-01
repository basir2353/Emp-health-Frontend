const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/emp-health';

console.log('🔗 Attempting to connect to MongoDB...');
console.log('📡 Connection string:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err.message);
  console.error('💡 Troubleshooting tips:');
  console.error('   1. Check if MONGODB_URI is set correctly in your .env file');
  console.error('   2. Verify your MongoDB Atlas cluster is running');
  console.error('   3. Check if your IP is whitelisted in MongoDB Atlas');
  console.error('   4. Verify username and password in connection string');
  process.exit(1);
});

// Define Report Schema
const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['option1', 'option2', 'general']
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  involvedParties: [{
    type: String
  }],
  reportToHR: {
    type: Boolean,
    default: false
  },
  anonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Being Investigated', 'Escalated', 'Closed'],
    default: 'Pending'
  },
  identityStatus: {
    type: String,
    enum: ['provided', 'declined', null],
    default: null
  }
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

// Define User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'doctor'],
    default: 'user'
  },
  identityStatus: {
    type: String,
    enum: ['provided', 'declined', null],
    default: null
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

// Store connected users and their rooms
const connectedUsers = new Map();
const rooms = new Map();

app.use(cors());
app.use(express.json());

// API endpoints for storing socket IDs
app.post('/api/auth/store_socket_id', (req, res) => {
  const { userId, socketId } = req.body;
  connectedUsers.set(socketId, { userId, socketId, isOnline: true });
  res.json({ success: true, message: 'Socket ID stored' });
});

app.get('/api/auth/online-users', (req, res) => {
  const onlineUsers = Array.from(connectedUsers.values()).filter(user => user.isOnline);
  res.json({ data: onlineUsers });
});

app.get('/api/auth/online-doctors', (req, res) => {
  // For demo purposes, treat some users as doctors
  const onlineDoctors = Array.from(connectedUsers.values())
    .filter(user => user.isOnline && user.userId.includes('doctor'));
  res.json({ data: onlineDoctors });
});

// Report Routes
app.post("/api/reports", async (req, res) => {
  try {
    const report = new Report({
      ...req.body,
      user: req.body.userId || req.body.user // Attach user ID from request
    });
    await report.save();
    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (err) {
    res.status(500).json({ message: "Failed to save report", error: err.message });
  }
});

// GET /reports - Get current user's reports
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ reports });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
  }
});

// GET /reports/all - Fetch all reports with pagination (admin/doctor only)
app.get('/api/reports/all', async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Fetch paginated reports from the database
    const [reports, total] = await Promise.all([
      Report.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email'),
      Report.countDocuments()
    ]);

    res.status(200).json({
      reports,
      total,
      page,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all reports', error: error.message });
  }
});

// PATCH /reports/:id/status - Update report status
app.patch('/api/reports/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }
    
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.status(200).json({ message: 'Report status updated successfully', report });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update report status', error: error.message });
  }
});

// DELETE /reports/:id - Delete a report by ID
app.delete('/api/reports/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete report', error: error.message });
  }
});

// PATCH /reports/:userId/identity - Update identity status
app.patch('/api/reports/:userId/identity', async (req, res) => {
  const { userId } = req.params;
  const { identityApproved } = req.body;

  try {
    // Validate input
    if (typeof identityApproved !== 'boolean') {
      return res.status(400).json({ message: 'identityApproved must be a boolean' });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update identity status
    user.identityStatus = identityApproved ? 'provided' : 'declined';
    await user.save();

    res.status(200).json({ message: `Identity ${identityApproved ? 'provided' : 'declined'} successfully`, identityStatus: user.identityStatus });
  } catch (error) {
    console.error('Error updating identity status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);
  
  // Store user connection
  connectedUsers.set(socket.id, { 
    userId: socket.id, 
    socketId: socket.id, 
    isOnline: true,
    roomId: null 
  });

  // Join room
  socket.on('join-room', ({ roomId, userId, userName }) => {
    console.log(`👥 User ${userId} joining room: ${roomId}`);
    
    socket.join(roomId);
    
    // Update user's room
    const user = connectedUsers.get(socket.id);
    if (user) {
      user.roomId = roomId;
      user.userName = userName;
    }
    
    // Get users in room
    const roomUsers = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    socket.emit('room-users', roomUsers);
    
    // Notify others in room
    socket.to(roomId).emit('user-connected', userId);
    
    console.log(`✅ User ${userId} joined room ${roomId}. Users in room: ${roomUsers.length}`);
  });

  // Handle call requests
  socket.on('call-user', ({ userToCall, signalData, from, name, roomId }) => {
    console.log(`📞 Call request from ${from} to ${userToCall}`);
    
    // Send incoming call notification to target user
    socket.to(userToCall).emit('incoming-call', {
      signal: signalData,
      from: from,
      name: name,
      roomId: roomId
    });
    
    console.log(`✅ Call request sent to ${userToCall}`);
  });

  // Handle call acceptance
  socket.on('answer-call', ({ signal, to, from }) => {
    console.log(`✅ Call answered by ${from} to ${to}`);
    
    // Send answer to caller
    socket.to(to).emit('call-accepted', {
      signal: signal,
      from: from
    });
    
    console.log(`✅ Call answer sent to ${to}`);
  });

  // Handle call rejection
  socket.on('reject-call', ({ to, from }) => {
    console.log(`❌ Call rejected by ${from} to ${to}`);
    
    // Send rejection to caller
    socket.to(to).emit('call-rejected', {
      from: from
    });
    
    console.log(`✅ Call rejection sent to ${to}`);
  });

  // Handle call ending
  socket.on('end-call', ({ to, from }) => {
    console.log(`📞 Call ended by ${from} to ${to}`);
    
    // Send end call notification
    socket.to(to).emit('call-ended', {
      from: from
    });
    
    console.log(`✅ Call end notification sent to ${to}`);
  });

  // WebRTC signaling - Offer
  socket.on('offer', ({ offer, to, from }) => {
    console.log(`📤 Offer from ${from} to ${to}`);
    
    socket.to(to).emit('offer', {
      offer: offer,
      from: from
    });
    
    console.log(`✅ Offer sent to ${to}`);
  });

  // WebRTC signaling - Answer
  socket.on('answer', ({ answer, to, from }) => {
    console.log(`📥 Answer from ${from} to ${to}`);
    
    socket.to(to).emit('answer', {
      answer: answer,
      from: from
    });
    
    console.log(`✅ Answer sent to ${to}`);
  });

  // WebRTC signaling - ICE candidates
  socket.on('ice-candidate', ({ candidate, to, from }) => {
    console.log(`🧊 ICE candidate from ${from} to ${to}`);
    
    socket.to(to).emit('ice-candidate', {
      candidate: candidate,
      from: from
    });
    
    console.log(`✅ ICE candidate sent to ${to}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
    
    // Remove user from connected users
    const user = connectedUsers.get(socket.id);
    if (user && user.roomId) {
      // Notify others in the room
      socket.to(user.roomId).emit('user-disconnected', socket.id);
    }
    
    connectedUsers.delete(socket.id);
    
    console.log(`✅ User ${socket.id} removed from connected users`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for WebRTC signaling`);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    connectedUsers: connectedUsers.size,
    rooms: rooms.size,
    timestamp: new Date().toISOString()
  });
});

module.exports = { app, server, io }; 