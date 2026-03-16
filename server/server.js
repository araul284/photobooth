import { Server } from "socket.io"

const io = new Server(3001, {
  cors: {
    origin: "*"
  }
})

io.on("connection", (socket) => {

  socket.on("join-room", (roomId) => {

    socket.join(roomId)

    socket.to(roomId).emit("partner-joined")

  })

  socket.on("camera-frame", ({ roomId, frame }) => {

    socket.to(roomId).emit("partner-frame", frame)

  })

  socket.on("photo-captured", ({ roomId, photo }) => {

    socket.to(roomId).emit("partner-photo", photo)

  })

})