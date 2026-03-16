import { useEffect } from "react"
import socket from "../hooks/useSocket"

function CameraView({ videoRef, roomId }) {

  useEffect(() => {

    const startCamera = async () => {

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      })

      videoRef.current.srcObject = stream

    }

    startCamera()

  }, [videoRef])

  useEffect(() => {

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

    return () => clearInterval(interval)

  }, [roomId])

  return (
    
    <CameraView
    videoRef={videoRef}
    roomId={roomId}
    />

  )

}

export default CameraView