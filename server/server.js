const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling']
});

app.use(cors());
app.use(express.json());

// Middleware to log connections
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Photobooth server is running' });
});

// Track rooms and participants
const rooms = new Map();

io.on('connection', (socket) => {
  console.log(`\n✅ User connected: ${socket.id}`);

  /* ==========================================
     ROOM MANAGEMENT
  ========================================== */

  socket.on('join-room', (roomId) => {
    console.log(`\n🔗 User ${socket.id} joining room: ${roomId}`);

    // Get current room info
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        id: roomId,
        participants: [],
        createdAt: new Date()
      });
      console.log(`📝 Room created: ${roomId}`);
    }

    const room = rooms.get(roomId);
    const isFirstUser = room.participants.length === 0;

    // Add user to room
    room.participants.push(socket.id);
    socket.join(roomId);

    console.log(`👥 Room ${roomId} now has ${room.participants.length} participant(s)`);

    // Notify existing users that a new user joined
    if (!isFirstUser) {
      socket.to(roomId).emit('partner-joined');
      console.log(`📢 Notified existing users in ${roomId} that partner joined`);
    }

    // Send room info to joining user
    socket.emit('room-joined', {
      roomId,
      participantCount: room.participants.length
    });
  });

  /* ==========================================
     PHOTO CAPTURE & SHARING
  ========================================== */

  socket.on('camera-frame', (data) => {
    const { roomId, frame } = data;

    if (!roomId) {
      console.error('❌ Camera frame received but no roomId');
      return;
    }

    // Send frame to all users in the room EXCEPT sender
    socket.to(roomId).emit('partner-frame', frame);
  });

  socket.on('photo-captured', (data) => {
    const { roomId, photo } = data;

    if (!roomId) {
      console.error('❌ Photo captured but no roomId');
      return;
    }

    console.log(`📸 User ${socket.id} captured photo in room ${roomId}`);

    // Send photo to all other users in the room
    socket.to(roomId).emit('partner-photo', photo);
  });

  /* ==========================================
     CLEANUP ON DISCONNECT
  ========================================== */

  socket.on('disconnect', () => {
    console.log(`\n❌ User disconnected: ${socket.id}`);

    // Remove user from all rooms they were in
    for (const [roomId, room] of rooms.entries()) {
      const index = room.participants.indexOf(socket.id);
      if (index > -1) {
        room.participants.splice(index, 1);
        console.log(`👥 User removed from room ${roomId}. Remaining: ${room.participants.length}`);

        // Notify remaining users
        if (room.participants.length === 0) {
          rooms.delete(roomId);
          console.log(`🗑️ Room ${roomId} deleted (empty)`);
        } else {
          io.to(roomId).emit('partner-disconnected', {
            message: 'Your partner left the room'
          });
          console.log(`📢 Notified users in ${roomId} that partner disconnected`);
        }
      }
    }
  });

  /* ==========================================
     ERROR HANDLING
  ========================================== */

  socket.on('error', (error) => {
    console.error(`❌ Socket error for ${socket.id}:`, error);
  });
});

// Server error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 PHOTOBOOTH SERVER RUNNING`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🔌 Socket.io: Ready for connections`);
  console.log(`${'='.repeat(50)}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = { app, server, io };
