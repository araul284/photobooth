import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"

import CameraView from "../components/CameraView"
import { captureFrame } from "../utils/captureFrame"
import { generateSharedStrip } from "../utils/generateSharedStrip"

import DoodleFrame from "../components/DoodleFrame"
import PolaroidPhoto from "../components/PolaroidPhoto"

import socket from "../hooks/useSocket"

import BoothCurtain from "../components/BoothCurtain"

function BoothRoom() {

  const { roomId } = useParams()

  const videoRef = useRef(null)

  const [photo, setPhoto] = useState(null)
  const [photos, setPhotos] = useState([])
  const [partnerPhotos, setPartnerPhotos] = useState([])

  const [countdown, setCountdown] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const [photostrip, setPhotostrip] = useState(null)

  const [partnerJoined, setPartnerJoined] = useState(false)

  const inviteLink = `${window.location.origin}/booth/${roomId}`

  /* ---------------------------
     JOIN ROOM
  --------------------------- */

  useEffect(() => {

    socket.emit("join-room", roomId)

    socket.on("partner-joined", () => {
      setPartnerJoined(true)
    })

    socket.on("partner-photo", (photo) => {

      setPartnerPhotos((prev) => [...prev, photo])

    })

    return () => {
      socket.off("partner-joined")
      socket.off("partner-photo")
    }

  }, [roomId])

  /* ---------------------------
     COPY LINK
  --------------------------- */

  const copyLink = () => {

    navigator.clipboard.writeText(inviteLink)

    alert("Invite link copied!")

  }

  /* ---------------------------
     COUNTDOWN
  --------------------------- */

  const runCountdown = () => {

    return new Promise((resolve) => {

      let count = 3

      setCountdown(count)

      const interval = setInterval(() => {

        count--

        if (count === 0) {

          clearInterval(interval)
          setCountdown(null)

          resolve()

        } else {

          setCountdown(count)

        }

      }, 1000)

    })

  }

  /* ---------------------------
     PHOTO SESSION
  --------------------------- */

  const startPhotoSession = async () => {

    if (isCapturing) return

    setIsCapturing(true)

    let captured = []

    for (let i = 0; i < 4; i++) {

      await runCountdown()

      const image = captureFrame(videoRef.current)

      setPhoto(image)

      captured.push(image)

      setPhotos([...captured])

      // SEND PHOTO TO PARTNER
      socket.emit("photo-captured", {

        roomId,
        photo: image

      })

      await new Promise((res) => setTimeout(res, 800))

    }

    setIsCapturing(false)

  }

  /* ---------------------------
     GENERATE FINAL STRIP
  --------------------------- */

  useEffect(() => {

    const generateStrip = async () => {

      if (photos.length === 4 && partnerPhotos.length === 4) {

        const strip = await generateSharedStrip(
          photos,
          partnerPhotos
        )

        setPhotostrip(strip)

      }

    }

    generateStrip()

  }, [photos, partnerPhotos])

  //download photostrip when ready
  const downloadStrip = () => {

  const link = document.createElement("a")

  link.href = photostrip

  link.download = "parallel-polaroid.png"

  link.click()

}

  // share photostrip
  const shareStrip = async () => {

    if (!navigator.share) {
      alert("Sharing not supported on this device")
      return
    }

    const response = await fetch(photostrip)
    const blob = await response.blob()

    const file = new File(
      [blob],
      "photostrip.png",
      { type: "image/png" }
    )

    await navigator.share({
      title: "Our Photobooth Memory",
      text: "We took this together 💕",
      files: [file]
    })

  }

  const retakePhotos = () => {

    setPhotos([])
    setPartnerPhotos([])
    setPhotostrip(null)

  }

  //wrap the entire booth UI in the curtain component
  <BoothCurtain>

    {/* Your entire booth UI here */}

  </BoothCurtain>

  return (

    <div className="h-screen bg-[#fff7f2] flex flex-col items-center justify-center">

      <h2 className="text-2xl mb-6">
        Photobooth Room
      </h2>

      {/* Invite link */}

      <div className="mt-6 text-center">

        <p className="text-sm">
          Share this link with your partner:
        </p>

        <input
          value={inviteLink}
          readOnly
          className="bg-white p-3 rounded-lg shadow"
        />

        <button
          onClick={copyLink}
          className="mt-3 bg-pink-400 text-white px-4 py-2 rounded-lg"
        >
          Copy Invite Link
        </button>

      </div>

      {/* Countdown */}

      {countdown && (

        <div className="absolute text-6xl font-bold text-white">

          {countdown}

        </div>

      )}

      {/* Camera section */}

      <div className="flex gap-8 mt-8">

        <DoodleFrame>

          <CameraView videoRef={videoRef} />

        </DoodleFrame>

        <div className="relative w-64 h-64 bg-gray-200 rounded-[30px] border-4 border-dashed border-pink-300 flex items-center justify-center">

          {partnerPhotos.length === 0
            ? "Partner Camera"
            : (
              <img
                src={partnerPhotos[partnerPhotos.length - 1]}
                className="w-full h-full object-cover rounded-[20px]"
              />
            )}

        </div>

      </div>

      {/* Start session */}

      <button
        onClick={startPhotoSession}
        className="mt-8 bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-xl"
      >
        Start Photo Session
      </button>

      <p className="mt-4 text-gray-600">

        {partnerJoined
          ? "Your partner joined the booth <3"
          : "Waiting for your partner..."}

      </p>

      {/* Preview photos */}

      {photos.length > 0 && (

        <div className="mt-10 flex flex-wrap gap-6 justify-center">

          {photos.map((p, index) => (

            <PolaroidPhoto
              key={index}
              src={p}
            />

          ))}

        </div>

      )}

      {/* Final photostrip */}

      {photostrip && (

        <div className="mt-10 flex flex-col items-center">

          <h2 className="text-xl mb-4">
            Your Photostrip
          </h2>

          <img
            src={photostrip}
            className="rounded-lg shadow-lg"
          />

        </div>

      )}

      <button
        onClick={downloadStrip}
        className="mt-4 bg-pink-400 text-white px-5 py-2 rounded-lg"
        >
        Download Photostrip
      </button>

      <button
        onClick={shareStrip}
        className="mt-3 bg-purple-400 text-white px-5 py-2 rounded-lg"
        >
        Share Photostrip
      </button>

      <button
        onClick={retakePhotos}
        className="mt-3 bg-gray-400 text-white px-5 py-2 rounded-lg"
        >
        Take Another
      </button>

    </div>

  )

}

export default BoothRoom