import { BrowserRouter, Routes, Route } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import BoothRoom from "./pages/BoothRoom"
import ResultPage from "./pages/ResultPage"
import JoinRoom from "./pages/JoinRoom"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/booth/:roomId" element={<BoothRoom />} />

        <Route path="/result" element={<ResultPage />} />

        <Route path="/join" element={<JoinRoom />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App