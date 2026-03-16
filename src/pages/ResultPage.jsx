import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { generateSharedStrip } from "../utils/generateSharedStrip"

function ResultPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const photos = state?.photos
  const partnerPhotos = state?.partnerPhotos
  const roomId = state?.roomId

  const [photostrip, setPhotostrip] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (!photos || !partnerPhotos) return
    if (photos.length !== 4 || partnerPhotos.length !== 4) return

    const run = async () => {
      setIsGenerating(true)
      const strip = await generateSharedStrip(photos, partnerPhotos)
      setPhotostrip(strip)
      setIsGenerating(false)
    }

    const timer = setTimeout(run, 0)
    return () => clearTimeout(timer)
  }, [photos, partnerPhotos])

  const downloadStrip = () => {
    if (!photostrip) return

    const link = document.createElement("a")
    link.href = photostrip
    link.download = "parallel-polaroid.png"
    link.click()
  }

  const shareStrip = async () => {
    if (!photostrip) return

    if (!navigator.share) {
      alert("Sharing not supported on this device")
      return
    }

    const response = await fetch(photostrip)
    const blob = await response.blob()

    const file = new File([blob], "photostrip.png", { type: "image/png" })

    await navigator.share({
      title: "Our Photobooth Memory",
      text: "We took this together 💕",
      files: [file]
    })
  }

  const retake = () => {
    if (roomId) {
      navigate(`/booth/${roomId}`)
    } else {
      navigate("/")
    }
  }

  return (
    <div className="h-screen bg-[#fff7f2] flex flex-col items-center justify-center px-6 text-center">
      <h2 className="text-3xl font-bold mb-6">Your Photostrip</h2>

      {(!photos || !partnerPhotos) && (
        <div className="space-y-4">
          <p className="text-lg text-gray-600">
            No photostrip found yet. Head back to the booth and take photos to generate one.
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-xl"
          >
            Back to Home
          </button>
        </div>
      )}

      {photos && partnerPhotos && (isGenerating ? (
        <div className="space-y-4">
          <p className="text-lg text-gray-600">Generating your photostrip…</p>
          <p className="text-sm text-gray-500">Hang tight while we stitch your photo strip together.</p>
        </div>
      ) : (
        photostrip && (
          <div className="space-y-6">
            <img
              src={photostrip}
              className="rounded-lg shadow-lg max-w-full w-[360px]"
            />

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={downloadStrip}
                className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-xl"
              >
                Download
              </button>

              <button
                onClick={shareStrip}
                className="bg-purple-400 hover:bg-purple-500 text-white px-6 py-3 rounded-xl"
              >
                Share
              </button>

              <button
                onClick={retake}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-xl"
              >
                Retake
              </button>
            </div>
          </div>
        )
      ))}
    </div>
  )
}

export default ResultPage