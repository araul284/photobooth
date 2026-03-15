import { useState, useEffect } from "react"

function PolaroidPhoto({ src }) {

    const [visible, setVisible] = useState(false)

    useEffect(() => {

        const timer = setTimeout(() => {
            setVisible(true)
        }, 1000)

        return () => clearTimeout(timer)

    }, [])

    return (
        <div className="bg-white p-3 shadow-lg rounded-md w-48">

            <div className="bg-gray-100 h-40 flexx items-center justify-center overflow-hidden">

                <img
                    src={src}
                    className={`transition-opacity duration-[3000ms] ${
                        visible ? "opacity-100" : "opacity-0"
                    }`}
                />

            </div>

            <div className="h-6"></div>

        </div>

    )
    
}

export default PolaroidPhoto