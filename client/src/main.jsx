import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import './index.css'

import Register from './Pages/auth/Register.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/register" />} />

        <Route path="/auth/register" element={<Register />} />

      </Routes>
    </Router>
  </StrictMode>
)
