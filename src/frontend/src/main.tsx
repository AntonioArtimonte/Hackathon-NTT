import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Landing from './pages/LandingPage'
import Predict from './pages/Predict'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/main" element={<App />} />
        <Route path="/predict" element={<Predict />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)