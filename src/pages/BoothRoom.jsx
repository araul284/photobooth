import { useParams } from "react-router-dom"
import { useRef, useState } from "react"
import CameraView from "../components/CameraView"
import { captureFrame } from "../utils/captureFrame"
import { generatePhotostrip } from "../utils/generatePhotostrip"
import DoodleFrame from "../components/DoodleFrame"
import PolaroidPhoto from "../components/PolaroidPhoto"

function BoothRoom() {

  const { roomId } = useParams()

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Link copied!")
  }

  //create camera reference 
  const videoRef = useRef(null)

  const [photo] = useState(null)
  const [photos, setPhotos] = useState([])
  const [countdown, setCountdown] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const [photostrip, setPhotostrip] = useState(null)

  const takePhoto = () => {
    const image = captureFrame(videoRef.current)
    setPhoto(image)
  }

  //countdown function
  const runCountdown = () => {
    return new Promise((resolve) => {

      let count = 3

      setCountdown(count)

      const interval = setInterval(() => {

        count--

        if(count === 0) {

          clearInterval(interval)
          setCountdown(null)

          resolve()

        } else {
          setCountdown(count)
        }

      }, 1000)

    })

  }

  //multi photo capture 
  const startPhotoSession = async () => {
    
    if (isCapturing) return

    setIsCapturing(true)

    let captured = []

    for (let i = 0; i < 4; i++) {

      await runCountdown()

      const image = captureFrame(videoRef.current)

      captured.push(image)

      await new Promise((res) => setTimeout(res, 800))

    }

    setPhotos(captured)

    const strip = await generatePhotostrip(captured)

    setPhotostrip(strip)

    setIsCapturing(false)

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

      {countdown && (

        <div className="absolute text-6xl font-bold text-white">

          {countdown}

        </div>

      )}

      <div className="flex gap">

        <div className="flex gap-8 mt-8">

          <DoodleFrame>
            <CameraView videoRef={videoRef} />
          </DoodleFrame>

          <div className="relative w-64 h-64 bg-gray-200 rounded-[30px] border-4 border-dashed border-pink-300 flex items-center justify-center">
            Partner Camera
          </div>

        </div>

      </div>

      <button 
        onClick={startPhotoSession}
        className="mt-8 bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-xl">
        Start Photo Session
      </button>

    {photo && (
      <div className="mt-6">

        <p className="mb-2">Captured Photo:</p>

        <img
         src={photo}
         className="w-64 rounded-xl border scale-x-[-1]"
        />
      
     </div>
    )}

    {photos.length > 0 && (

      <div className="mt-10 flex flex-wrap gap-6 justify-center">

          {photos.map((photo, index) => (

            <PolaroidPhoto 
              key={index}
              src={photo}
            />
            
          ))}

       </div>

    )}

      {photostrip && (

        <div className="mt-10 felx flex-col items-center">

          <h2 className="text-xl mb-4">
            Your Photostrip
          </h2>

          <img
            src={photostrip}
            className="rounded-lg shadow-lg"
          />

        </div>

      )}

      <p className="mt-6 text-gray-500">
        Waiting for your partner to join...
      </p>

    </div>
  )
}

export default BoothRoom