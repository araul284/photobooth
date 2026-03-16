import { generateRoomId } from "../utils/generateRoomId"
import { useNavigate } from "react-router-dom"
import BoothCurtain from "../components/BoothCurtain"

function LandingPage() {

  const navigate = useNavigate()

  const createRoom = () => {
    const roomId = generateRoomId()
    navigate(`/booth/${roomId}`)
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

        <button
          onClick={createRoom}
          className="bg-pink-400 hover:bg-pink-500 text-white px-8 py-3 rounded-xl shadow-md"
        >
          Start Photobooth
        </button>

      </div>
    </BoothCurtain>
  )
}

export default LandingPage