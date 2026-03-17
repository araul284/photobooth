import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSocket } from "../hooks/useSocket"

function JoinRoom() {

  const [roomCode, setRoomCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { isConnected, error } = useSocket()

  const joinRoom = () => {
    if (!roomCode.trim()) {
      alert("Please enter a room code")
      return
    }

    if (!isConnected) {
      alert("⏳ Server is connecting... Please wait a moment and try again.")
      return
    }

    if (isLoading) return

    console.log("🔗 Joining room:", roomCode)
    setIsLoading(true)

    // Give socket a moment to be fully ready
    setTimeout(() => {
      console.log("🔀 Navigating to room:", `/booth/${roomCode}`)
      navigate(`/booth/${roomCode}`)
      setIsLoading(false)
    }, 300)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      joinRoom()
    }
  }

  return (

    <div className="h-screen flex flex-col items-center justify-center bg-[#F8F3E8]">

      <h2 className="text-3xl mb-6 font-bold">
        Join Photobooth
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-200 text-red-800 rounded max-w-md">
          ⚠️ {error}. Make sure the server is running.
        </div>
      )}

      {!isConnected && (
        <div className="mb-4 p-3 bg-yellow-200 text-yellow-800 rounded max-w-md">
          ⏳ Connecting to server...
        </div>
      )}

      <input
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
        onKeyPress={handleKeyPress}
        placeholder="Enter 6 digit room code"
        className="p-3 border-2 rounded-lg text-center text-lg"
        disabled={!isConnected}
        maxLength="6"
      />

      <button
        onClick={joinRoom}
        disabled={!isConnected || isLoading || !roomCode.trim()}
        className={`mt-4 ${
          isConnected && !isLoading && roomCode.trim()
            ? "bg-pink-400 hover:bg-pink-500"
            : "bg-gray-400 cursor-not-allowed"
        } text-white px-6 py-3 rounded-xl transition`}
      >
        {isLoading ? "Joining..." : "Join Room"}
      </button>

      <button
        onClick={() => navigate("/")}
        className="mt-4 text-blue-500 underline hover:text-blue-700"
      >
        Back to Home
      </button>

    </div>

  )

}

export default JoinRoom