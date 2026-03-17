import { useEffect, useState } from "react"
import { io } from "socket.io-client"

let socket = null

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Initialize socket only once
    if (!socket) {
      socket = io("https://photobooth-production-d79b.up.railway.app", {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      })

      socket.on("connect", () => {
        console.log("✅ Socket Connected:", socket.id)
        setIsConnected(true)
        setError(null)
      })

      socket.on("disconnect", () => {
        console.log("❌ Socket Disconnected")
        setIsConnected(false)
      })

      socket.on("connect_error", (err) => {
        console.error("❌ Socket Connection Error:", err)
        setError("Failed to connect to server")
        setIsConnected(false)
      })

      socket.on("error", (err) => {
        console.error("❌ Socket Error:", err)
        setError("Socket error occurred")
      })
    }

    return () => {
      // Don't disconnect on unmount (socket persists across pages)
    }
  }, [])

  return { socket, isConnected, error }
}

// Export raw socket for backward compatibility with emit/on
export default socket