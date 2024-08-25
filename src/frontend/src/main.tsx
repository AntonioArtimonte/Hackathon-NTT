import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Landing from './pages/LandingPage'
import './index.css'
import DetectSounds from './pages/DetectSounds/DetectSounds'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/main" element={<App />} />
        <Route path="/detect-sound" element={<DetectSounds/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)