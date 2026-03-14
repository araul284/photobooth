import { useParams } from "react-router-dom"
import CameraView from "../components/CameraView"

function BoothRoom() {

  const { roomId } = useParams()

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Link copied!")
  }

  return (
    <div className="h-screen bg-[#fff7f2] flex flex-col items-center justify-center">

      <h2 className="text-2xl mb-6">
        Photobooth Room
      </h2>

      <p className="mb-4">
        Share this link with your partner:
      </p>

      <div className="bg-white p-4 rounded-lg shadow">
        {window.location.href}
      </div>

      <button
        onClick={copyLink}
        className="mt-3 bg-pink-400 text-white px-4 py-2 rounded-lg"
        >
          Copy Invite Link
      </button>

      <div className="flex gap">

        <div className="flex gap-8 mt-8">

          <div className="w-64 h-64 rounded-[30px] border-4 border-dashed border-pink-300 overflow-hidden">
            <CameraView />
          </div>

          <div className="w-64 h-64 bg-gray-200 rounded-[30px] border-4 border-dashed border-pink-300 flex items-center justify-center">
            Partner Camera
          </div>

        </div>

      </div>

      <button className="mt-8 bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-xl">
        Start Photo Session
      </button>

      <p className="mt-6 text-gray-500">
        Waiting for your partner to join...
      </p>

    </div>
  )
}

export default BoothRoom