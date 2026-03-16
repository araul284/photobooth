import { Server } from "socket.io"

const io = new Server(3001, {
  cors: {
    origin: "*"
  }
})

io.on("connection", (socket) => {

  console.log("User connected")

  socket.on("join-room", (roomId) => {

    socket.join(roomId)

    console.log("Joined room:", roomId)

  })

  socket.on("send-photo", ({ roomId, photo }) => {

    socket.to(roomId).emit("receive-photo", photo)

  })

})