import { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { CheckCircle, Trophy, ArrowLeft, Home } from 'lucide-react'
import './PaymentReturn.css'

function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const ticketId = searchParams.get('ticketId')
  const tournamentId = searchParams.get('tournamentId')
  const playerId = searchParams.get('playerId')

  return (
    <div className="payment-return-page">
      <div className="payment-return-container">
        <div className="payment-return-icon success">
          <CheckCircle size={80} />
        </div>
        <h1>¡Pago Exitoso!</h1>
        <p className="payment-return-message">
          Tu pago ha sido procesado correctamente. Tu inscripción está siendo procesada.
        </p>
        
        <div className="payment-return-info">
          <div className="info-item">
            <span className="info-label">Estado del pago:</span>
            <span className="info-value success">Aprobado</span>
          </div>
          {ticketId && (
            <div className="info-item">
              <span className="info-label">ID de transacción:</span>
              <span className="info-value">#{ticketId.slice(-8)}</span>
            </div>
          )}
        </div>

        <div className="payment-return-actions">
          <Link to="/" className="btn-primary">
            <Home size={20} />
            Volver al inicio
          </Link>
          <Link to="/login" className="btn-secondary">
            <ArrowLeft size={20} />
            Ir al panel
          </Link>
        </div>

        <p className="payment-return-note">
          Recibirás un email de confirmación con los detalles de tu inscripción.
        </p>
      </div>
    </div>
  )
}

export default PaymentSuccess
