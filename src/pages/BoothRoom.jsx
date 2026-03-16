import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"

import CameraView from "../components/CameraView"
import { captureFrame } from "../utils/captureFrame"

import DoodleFrame from "../components/DoodleFrame"
import PolaroidPhoto from "../components/PolaroidPhoto"

import socket from "../hooks/useSocket"

import BoothCurtain from "../components/BoothCurtain"

function BoothRoom() {

  const { roomId } = useParams()

  const videoRef = useRef(null)

  const [photos, setPhotos] = useState([])
  const [partnerPhotos, setPartnerPhotos] = useState([])

  const [countdown, setCountdown] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const [partnerJoined, setPartnerJoined] = useState(false)

  const inviteLink = `${window.location.origin}/booth/${roomId}`

  const [partnerFrame, setPartnerFrame] = useState(null)

  const navigate = useNavigate()
  const hasNavigatedRef = useRef(false)

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

    socket.on("partner-frame", (frame) => {
      setPartnerFrame(frame)
    })

    return () => {
      socket.off("partner-joined")
      socket.off("partner-photo")
      socket.off("partner-frame")
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

  useEffect(() => {
    if (photos.length === 4 && partnerPhotos.length === 4 && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true
      navigate("/result", {
        state: { photos, partnerPhotos, roomId }
      })
    }
  }, [photos, partnerPhotos, navigate, roomId])

  return (
    <BoothCurtain>

    <div className="h-screen bg-[#fff7f2] flex flex-col items-center justify-center">

      <h2 className="text-2xl mb-6">
        Photobooth Room
      </h2>

      {/* Invite link */}

      <div className="mt-6 text-center">

        <p className="text-xl font-bold">
        Room Code: {roomId}
        </p>

        <button
          onClick={() => navigator.clipboard.writeText(roomId)}
          className="bg-pink-400 text-white px-4 py-2 rounded"
        >
        Copy Code
        </button>

      </div>

      {/* Countdown */}

      {countdown && (

        <div className="absolute text-7xl font-bold text-pink-500 animate-pulse">
          {countdown}

        </div>

      )}

      {/* Camera section */}

      <div className="flex gap-8 mt-8">

        <DoodleFrame>

          <CameraView videoRef={videoRef} />

        </DoodleFrame>

        <div className="relative w-64 h-64 bg-gray-200 rounded-[30px] border-4 border-dashed border-pink-300 flex items-center justify-center">

          {partnerFrame ? (
            <img
              src={partnerFrame}
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            "Partner Camera"
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

    </div>

    </BoothCurtain>

  )

}

export default BoothRoom