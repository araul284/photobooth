import { useParams } from "react-router-dom"

function BoothRoom() {

  const { roomId } = useParams()

  return (
    <div className="h-screen flex items-center justify-center">

      <h2 className="text-2xl">
        Booth Room: {roomId}
      </h2>

    </div>
  )
}

export default BoothRoom