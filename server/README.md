# 🖥️ Photobooth Server

Real-time photobooth backend server using Express.js and Socket.io.

## 📋 Setup

### 1. **Install Dependencies**

```bash
cd photobooth/server
npm install
```

### 2. **Start the Server**

```bash
npm start
# or with auto-reload during development:
npm run dev
```

You should see:
```
==================================================
🚀 PHOTOBOOTH SERVER RUNNING
📍 Server: http://localhost:3001
🔌 Socket.io: Ready for connections
==================================================
```

### 3. **Health Check**

```bash
curl http://localhost:3001/health
# Response: { "status": "ok", "message": "..." }
```

---

## 🔌 Socket Events

### Client → Server

#### `join-room` (roomId)
User joins a photobooth room.
```javascript
socket.emit('join-room', 'ABC123')
```

#### `camera-frame` { roomId, frame }
Send live camera feed frame (called every ~500ms).
```javascript
socket.emit('camera-frame', {
  roomId: 'ABC123',
  frame: canvasDataURL
})
```

#### `photo-captured` { roomId, photo }
Send captured photo after countdown.
```javascript
socket.emit('photo-captured', {
  roomId: 'ABC123',
  photo: photoDataURL
})
```

### Server → Client

#### `room-joined` { roomId, participantCount }
Sent when user successfully joins a room.

#### `partner-joined`
Sent when partner joins your room.

#### `partner-frame` (frame)
Receive partner's live camera frame.

#### `partner-photo` (photo)
Receive partner's captured photo.

#### `partner-disconnected` { message }
Partner left the room.

---

## 📊 Room Management

- Each room can have **up to 2 participants**
- When first user joins → room is created
- When second user joins → both receive `partner-joined` notification
- When user leaves → room is cleaned up if empty

**Server tracks:**
- Room ID
- Participant list
- Creation timestamp

---

## 🔍 Console Logs

The server logs all events for debugging:

```
✅ User connected: socket-id
🔗 User joining room: ABC123
📝 Room created: ABC123
👥 Room ABC123 now has 2 participant(s)
📸 User captured photo in room ABC123
❌ User disconnected: socket-id
```

---

## ⚙️ Configuration

### Port
Default: `3001`

To change, set environment variable:
```bash
PORT=5000 npm start
```

### CORS
Server allows connections from any origin (`*`). For production, restrict to your domain:
```javascript
// In server.js:
cors: {
  origin: "https://yourdomain.com"
}
```

---

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
npx kill-port 3001
# Then restart server
npm start
```

### Client Can't Connect
1. Check server is running (`npm start`)
2. Check port is `3001` in client config
3. Check CORS is open (for development)
4. Check firewall isn't blocking socket.io

### Photos Not Syncing
1. Check console for `📸 User captured photo` log
2. Verify both users are in same room (check `Room ABC123 now has 2 participants`)
3. Check browser network tab for socket messages

---

## 📝 Notes for Development

- Uses `socket.io` for real-time bidirectional communication
- Socket.io handles reconnection automatically
- Server logs all activity to console
- No persistent database (runs in memory)

---

## 🎯 Next Steps

1. Start server: `npm start` (from `photobooth/server/` directory)
2. Start client: `npm run dev` (from `photobooth/` directory)
3. Open browser at suggested URL from client dev server
4. Test room creation and joining!

---

## 🏗️ Project Structure

```
photobooth/
├── server/              ← You are here
│   ├── server.js       ← Main server file
│   ├── package.json
│   └── .gitignore
├── src/                ← Frontend React code
│   ├── pages/
│   ├── components/
│   └── hooks/
└── ...
```

---

For issues, check browser console (F12) and server terminal for logs.
