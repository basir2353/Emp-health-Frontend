const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store connected users and their rooms
const connectedUsers = new Map();
const rooms = new Map();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    connectedUsers: connectedUsers.size,
    rooms: rooms.size,
    timestamp: new Date().toISOString()
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);
  
  // Store user connection
  connectedUsers.set(socket.id, { 
    socketId: socket.id, 
    isOnline: true,
    roomId: null,
    userName: null
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
      user.userId = userId;
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

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 WebRTC Signaling Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for WebRTC signaling`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = { app, server, io }; 