import { useEffect } from "react"
import { useSocket } from "../hooks/useSocket"

function CameraView({ videoRef, roomId }) {

  const { socket, isConnected } = useSocket()

  useEffect(() => {

    const startCamera = async () => {

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" }
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          console.log("📹 Camera started")
        }
      } catch (err) {
        console.error("❌ Camera error:", err)
      }

    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop())
        console.log("🛑 Camera stopped")
      }
    }

  }, [videoRef])

  useEffect(() => {

    if (!isConnected || !socket) return

    const interval = setInterval(() => {

      if (!videoRef.current) return

      const canvas = document.createElement("canvas")

      canvas.width = 200
      canvas.height = 150

      const ctx = canvas.getContext("2d")

      ctx.drawImage(videoRef.current, 0, 0, 200, 150)

      const frame = canvas.toDataURL("image/jpeg", 0.3)

      socket.emit("camera-frame", {
        roomId,
        frame
      })

    }, 500)

    return () => {
      clearInterval(interval)
      console.log("🧹 Camera stream cleanup")
    }

  }, [roomId, socket, isConnected, videoRef])

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{ 
        width: "100%", 
        height: "100%", 
        objectFit: "cover",
        transform: "scaleX(-1)"
      }}
    />
  )

}

export default CameraView