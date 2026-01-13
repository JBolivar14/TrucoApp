import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import PaymentForm from './PaymentForm'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Register from './pages/Register'
import PlayerView from './pages/PlayerView'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailure from './pages/PaymentFailure'
import PaymentPending from './pages/PaymentPending'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminProtectedRoute } from './components/AdminProtectedRoute'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/pago/exitoso" element={<PaymentSuccess />} />
        <Route path="/pago/fallido" element={<PaymentFailure />} />
        <Route path="/pago/pendiente" element={<PaymentPending />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminProtectedRoute>
                <App />
              </AdminProtectedRoute>
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
