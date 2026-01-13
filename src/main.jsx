import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import PaymentForm from './PaymentForm'
import Login from './pages/Login'
import Register from './pages/Register'
import PlayerView from './pages/PlayerView'
import { ProtectedRoute } from './components/ProtectedRoute'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jugador"
          element={
            <ProtectedRoute>
              <PlayerView />
            </ProtectedRoute>
          }
        />
        <Route path="/pagar/:ticketId" element={<PaymentForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
