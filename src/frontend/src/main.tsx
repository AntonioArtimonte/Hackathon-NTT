import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Landing from './pages/LandingPage'
import Predict from './pages/Predict'
import PredictVideo from './pages/PredictVideo'
import Gallery from './pages/Gallery'
import './index.css'
import DetectSounds from './pages/DetectSounds'
import GenerateRoutes from './pages/GenerateRoutes'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/main" element={<App />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/predict-video" element={<PredictVideo/>} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/detect-sound" element={<DetectSounds/>} />
        <Route path="/generate-routes" element={<GenerateRoutes/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)