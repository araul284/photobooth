import { useState } from "react"
import { useNavigate } from "react-router-dom"

function JoinRoom() {

  const [roomCode, setRoomCode] = useState("")
  const navigate = useNavigate()

  const joinRoom = () => {
    if (!roomCode) return
    navigate(`/booth/${roomCode}`)
  }

  return (

    <div className="h-screen flex flex-col items-center justify-center">

      <h2 className="text-3xl mb-6">
        Join Photobooth
      </h2>

      <input
        value={roomCode}
        onChange={(e)=>setRoomCode(e.target.value)}
        placeholder="Enter 6 digit room code"
        className="p-3 border rounded-lg"
      />

      <button
        onClick={joinRoom}
        className="mt-4 bg-pink-400 text-white px-6 py-3 rounded-xl"
      >
        Join Room
      </button>

    </div>

  )

}

export default JoinRoom