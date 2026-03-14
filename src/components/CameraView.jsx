import { useEffect, useRef, useState } from "react"

function CameraView() {

    const videoRef = useRef(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        const startCamera = async () => {
            try {

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true
                })

                videoRef.current.srcObject = stream

            } catch (error) {
                setError(true)
            }
        }

        startCamera()

    }, [])

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                Camera permission denied
            </div>
        )
    }

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover scale-x-[-1]"
        />
    )
}

export default CameraView