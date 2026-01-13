import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Trophy, CreditCard, CheckCircle, User, Users, MapPin, Send, AlertCircle } from 'lucide-react'
import { createPaymentRecord } from './services/databaseService'
import './PaymentForm.css'

function PaymentForm() {
  const { ticketId } = useParams()
  const [searchParams] = useSearchParams()
  
  const [ticketData, setTicketData] = useState(null)
  const [formData, setFormData] = useState({
    playerName: '',
    teamName: '',
    balnearioNumber: '',
    phone: '',
    email: '',
    paymentMethod: '',
    notes: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Decodificar datos del ticket desde URL params
    try {
      const tournamentName = searchParams.get('tournament') || 'Torneo de Truco'
      const amount = searchParams.get('amount') || '0'
      const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
      const organizerName = searchParams.get('organizer') || 'Organizador'
      
      // Datos del jugador si vienen del registro
      const playerName = searchParams.get('playerName')
      const playerPhone = searchParams.get('phone')
      const playerEmail = searchParams.get('email')
      
      setTicketData({
        id: ticketId,
        tournamentName: decodeURIComponent(tournamentName),
        amount: parseFloat(amount),
        date,
        organizerName: decodeURIComponent(organizerName)
      })

      // Pre-llenar datos del jugador si vienen del registro
      if (playerName || playerPhone || playerEmail) {
        setFormData(prev => ({
          ...prev,
          playerName: playerName ? decodeURIComponent(playerName) : prev.playerName,
          phone: playerPhone ? decodeURIComponent(playerPhone) : prev.phone,
          email: playerEmail ? decodeURIComponent(playerEmail) : prev.email
        }))
      }
    } catch (err) {
      setError('Error al cargar los datos del ticket')
    }
  }, [ticketId, searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Guardar registro de pago en Supabase
      await createPaymentRecord({
        ticketId,
        tournamentName: ticketData.tournamentName,
        amount: ticketData.amount,
        playerName: formData.playerName,
        teamName: formData.teamName || null,
        balnearioNumber: formData.balnearioNumber || null,
        phone: formData.phone || null,
        email: formData.email || null,
        paymentMethod: formData.paymentMethod || null,
        notes: formData.notes || null,
        status: 'pending_confirmation'
      })
      
      setSubmitted(true)
    } catch (err) {
      console.error('Error al guardar registro:', err)
      setError('Error al enviar el formulario. Por favor, intenta nuevamente.')
      // Fallback a localStorage si Supabase falla
      try {
        const paymentRecords = JSON.parse(localStorage.getItem('trucoPaymentRecords') || '[]')
        const newRecord = {
          id: Date.now(),
          ticketId,
          ...ticketData,
          ...formData,
          submittedAt: new Date().toISOString(),
          status: 'pending_confirmation'
        }
        paymentRecords.push(newRecord)
        localStorage.setItem('trucoPaymentRecords', JSON.stringify(paymentRecords))
        setSubmitted(true)
        setError(null)
      } catch (localErr) {
        setError('Error al guardar el registro. Por favor, contacta al organizador.')
      }
    } finally {
      setLoading(false)
    }
  }

  const paymentMethods = [
    { id: 'mercadopago', name: 'Mercado Pago', icon: '💳' },
    { id: 'transferencia', name: 'Transferencia Bancaria', icon: '🏦' },
    { id: 'efectivo', name: 'Efectivo (en persona)', icon: '💵' },
    { id: 'paypal', name: 'PayPal', icon: '🌐' },
    { id: 'otro', name: 'Otro método', icon: '📱' }
  ]

  if (error) {
    return (
      <div className="payment-form-page">
        <div className="payment-container">
          <div className="error-state">
            <AlertCircle size={64} />
            <h2>Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!ticketData) {
    return (
      <div className="payment-form-page">
        <div className="payment-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando información del pago...</p>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="payment-form-page">
        <div className="payment-container">
          <div className="success-state">
            <div className="success-icon">
              <CheckCircle size={80} />
            </div>
            <h2>¡Registro Enviado!</h2>
            <p>Tu información ha sido registrada correctamente.</p>
            
            <div className="summary-card">
              <h3>Resumen del Registro</h3>
              <div className="summary-row">
                <span>Jugador:</span>
                <strong>{formData.playerName}</strong>
              </div>
              <div className="summary-row">
                <span>Equipo:</span>
                <strong>{formData.teamName}</strong>
              </div>
              <div className="summary-row">
                <span>Balneario:</span>
                <strong>#{formData.balnearioNumber}</strong>
              </div>
              <div className="summary-row">
                <span>Torneo:</span>
                <strong>{ticketData.tournamentName}</strong>
              </div>
              <div className="summary-row">
                <span>Monto a pagar:</span>
                <strong className="amount">${ticketData.amount.toLocaleString('es-AR')}</strong>
              </div>
              <div className="summary-row">
                <span>Método de pago:</span>
                <strong>{paymentMethods.find(m => m.id === formData.paymentMethod)?.name}</strong>
              </div>
            </div>

            <div className="next-steps">
              <h4>Próximos pasos:</h4>
              <ol>
                <li>Realiza el pago usando el método seleccionado</li>
                <li>El organizador confirmará tu inscripción</li>
                <li>Recibirás confirmación por email o teléfono</li>
              </ol>
            </div>

            <p className="contact-info">
              Si tienes dudas, contacta al organizador.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-form-page">
      <div className="payment-container">
        <header className="payment-header">
          <Trophy className="payment-icon" />
          <h1>Inscripción al Torneo</h1>
          <p>Completa tus datos para registrarte</p>
        </header>

        <div className="ticket-info">
          <div className="ticket-badge">
            <span className="ticket-label">Boleta de Pago</span>
            <span className="ticket-id">#{ticketId?.slice(-8)}</span>
          </div>
          <div className="ticket-details">
            <div className="ticket-row">
              <Trophy size={18} />
              <span>{ticketData.tournamentName}</span>
            </div>
            <div className="ticket-row">
              <CreditCard size={18} />
              <span className="ticket-amount">${ticketData.amount.toLocaleString('es-AR')}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message" style={{
            background: '#fee',
            color: '#c33',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-section">
            <h3><User size={20} /> Información Personal</h3>
            
            <div className="form-group">
              <label>Nombre Completo *</label>
              <input
                type="text"
                required
                value={formData.playerName}
                onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Teléfono *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+54 9 11 1234-5678"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3><Users size={20} /> Información del Equipo</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Nombre del Equipo *</label>
                <input
                  type="text"
                  required
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  placeholder="Los Campeones"
                />
              </div>
              <div className="form-group">
                <label><MapPin size={16} /> Número de Balneario *</label>
                <input
                  type="text"
                  required
                  value={formData.balnearioNumber}
                  onChange={(e) => setFormData({ ...formData, balnearioNumber: e.target.value })}
                  placeholder="Ej: 42"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3><CreditCard size={20} /> Método de Pago</h3>
            
            <div className="payment-methods">
              {paymentMethods.map(method => (
                <label
                  key={method.id}
                  className={`payment-method-option ${formData.paymentMethod === method.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={formData.paymentMethod === method.id}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    required
                  />
                  <span className="method-icon">{method.icon}</span>
                  <span className="method-name">{method.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label>Notas Adicionales</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Alguna información adicional que quieras agregar..."
                rows="3"
              />
            </div>
          </div>

          <div className="form-total">
            <div className="total-row">
              <span>Total a Pagar:</span>
              <span className="total-amount">${ticketData.amount.toLocaleString('es-AR')}</span>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            <Send size={20} />
            {loading ? 'Enviando...' : 'Enviar Inscripción'}
          </button>

          <p className="form-disclaimer">
            Al enviar este formulario, confirmas que los datos son correctos y te comprometes a realizar el pago.
          </p>
        </form>
      </div>
    </div>
  )
}

export default PaymentForm

