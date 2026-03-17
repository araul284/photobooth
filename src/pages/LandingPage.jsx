import { generateRoomId } from "../utils/generateRoomId"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useSocket } from "../hooks/useSocket"
import BoothCurtain from "../components/BoothCurtain"

function LandingPage() {

  const navigate = useNavigate()
  const { isConnected, error } = useSocket()
  const [isLoading, setIsLoading] = useState(false)

  const createRoom = async () => {
    if (!isConnected) {
      alert("⏳ Server is connecting... Please wait a moment and try again.")
      return
    }

    if (isLoading) return

    console.log("🚀 Creating room...")
    setIsLoading(true)

    const roomId = generateRoomId()
    console.log("📍 Generated Room ID:", roomId)

    // Give socket a moment to be fully ready
    setTimeout(() => {
      console.log("🔀 Navigating to room:", `/booth/${roomId}`)
      navigate(`/booth/${roomId}`)
      setIsLoading(false)
    }, 300)
  }

  const handleJoinNavigation = () => {
    if (!isConnected) {
      alert("⏳ Server is connecting... Please wait a moment and try again.")
      return
    }
    navigate("/join")
  }

  return (
    <BoothCurtain>
      <div className="h-screen bg-[#F8F3E8] flex flex-col items-center justify-center text-center">

        <h1 className="text-5xl font-bold mb-4">
          Parallel Polaroid
        </h1>

        <p className="text-lg mb-8 max-w-md">
          Take photobooth pictures together even when you're miles apart.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-200 text-red-800 rounded">
            ⚠️ {error}. Make sure the server is running.
          </div>
        )}

        {!isConnected && (
          <div className="mb-4 p-3 bg-yellow-200 text-yellow-800 rounded">
            ⏳ Connecting to server...
          </div>
        )}

        <button 
          onClick={createRoom}
          disabled={!isConnected || isLoading}
          className={`${
            isConnected && !isLoading 
              ? "bg-blue-500 hover:bg-blue-600" 
              : "bg-gray-400 cursor-not-allowed"
          } text-white px-6 py-3 rounded-xl mb-4 transition`}
        >
          {isLoading ? "Creating..." : "Create Room"}
        </button>

        <button 
          onClick={handleJoinNavigation}
          disabled={!isConnected}
          className={`${
            isConnected 
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-gray-400 cursor-not-allowed"
          } text-white px-6 py-3 rounded-xl transition`}
        >
          Join Room
        </button>

      </div>
    </BoothCurtain>
  )
}

export default LandingPage