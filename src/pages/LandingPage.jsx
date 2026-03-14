import { useNavigate } from "react-router-dom"

function LandingPage() {

  const navigate = useNavigate()

  const createRoom = () => {
    const roomId = Math.random().toString(36).substring(2, 8)
    navigate(`/booth/${roomId}`)
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-pink-50">

      <h1 className="text-4xl font-bold mb-4">
        Parallel Polaroid
      </h1>

      <p className="mb-6">
        Take photos together even when you're miles apart
      </p>

      <button
        onClick={createRoom}
        className="bg-pink-500 text-white px-6 py-3 rounded-lg"
      >
        Start Booth
      </button>

    </div>
  )
}

export default LandingPage