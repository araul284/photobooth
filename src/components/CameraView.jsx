import { useEffect, useRef,} from "react"

function CameraView({ videoRef }) {

    useEffect(() => {

        const startCamera = async () => {

            const stream = await navigator.mediaDevices.getUserMedia({
                    video: true
                })

                videoRef.current.srcObject = stream

        }

        startCamera()

    }, [])

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