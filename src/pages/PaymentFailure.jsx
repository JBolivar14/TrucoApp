import { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { XCircle, Trophy, ArrowLeft, RefreshCw } from 'lucide-react'
import './PaymentReturn.css'

function PaymentFailure() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const ticketId = searchParams.get('ticketId')

  return (
    <div className="payment-return-page">
      <div className="payment-return-container">
        <div className="payment-return-icon failure">
          <XCircle size={80} />
        </div>
        <h1>Pago No Procesado</h1>
        <p className="payment-return-message">
          El pago no pudo ser procesado. Por favor, intenta nuevamente o elige otro método de pago.
        </p>
        
        <div className="payment-return-info">
          <div className="info-item">
            <span className="info-label">Estado del pago:</span>
            <span className="info-value failure">Rechazado</span>
          </div>
          {ticketId && (
            <div className="info-item">
              <span className="info-label">ID de transacción:</span>
              <span className="info-value">#{ticketId.slice(-8)}</span>
            </div>
          )}
        </div>

        <div className="payment-return-actions">
          <button 
            onClick={() => navigate(-1)} 
            className="btn-primary"
          >
            <RefreshCw size={20} />
            Intentar Nuevamente
          </button>
          <Link to="/" className="btn-secondary">
            <ArrowLeft size={20} />
            Volver al inicio
          </Link>
        </div>

        <p className="payment-return-note">
          Si el problema persiste, contacta al organizador del torneo para más información.
        </p>
      </div>
    </div>
  )
}

export default PaymentFailure
