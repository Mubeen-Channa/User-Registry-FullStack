import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

import ProtectedRoute from "./components/ProtectedRoute";

import Login from './Pages/auth/Login.jsx'
import Register from './Pages/auth/Register.jsx'

import Wall from "./Pages/wall/wall.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" />} />

        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* Protected Route*/}
        <Route
          path="/wall"
          element={
            <ProtectedRoute allowedRoles={["Male", "Female"]}>
              <Wall />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  </StrictMode>
)
