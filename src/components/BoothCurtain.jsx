import { useState } from "react"

function BoothCurtain({ children }) {

  const [open, setOpen] = useState(false)

  return (

    <div className="relative w-full h-screen overflow-hidden">

      {/* Booth Content */}

      <div className={`${open ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}>

        {children}

      </div>


      {/* Left Curtain */}

      <div
        className={`absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-red-600 to-red-400
        ${open ? "-translate-x-full" : "translate-x-0"}
        transition-transform duration-1000`}
      />


      {/* Right Curtain */}

      <div
        className={`absolute top-0 right-0 h-full w-1/2 bg-gradient-to-r from-red-600 to-red-400
        ${open ? "translate-x-full" : "translate-x-0"}
        transition-transform duration-1000`}
      />


      {/* Enter Button */}

      {!open && (

        <div className="absolute inset-0 flex items-center justify-center">

          <button
            onClick={() => setOpen(true)}
            className="bg-white px-6 py-3 rounded-xl shadow-lg"
          >
            Enter Photobooth
          </button>

        </div>

      )}

    </div>

  )

}

export default BoothCurtain