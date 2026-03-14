import { BrowserRouter, Routes, Route } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import BoothRoom from "./pages/BoothRoom"
import ResultPage from "./pages/ResultPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/booth/:roomId" element={<BoothRoom />} />

        <Route path="/result" element={<ResultPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App