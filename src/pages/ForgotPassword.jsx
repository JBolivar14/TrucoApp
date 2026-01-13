import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Trophy, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { resetPassword } from '../services/authService'
import { useToast } from '../hooks/useToast'
import './Login.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email) {
        setError('Por favor ingresa tu email')
        setLoading(false)
        return
      }

      const { error: resetError } = await resetPassword(email)
      
      if (resetError) {
        setError(resetError.message || 'Error al enviar el email de recuperación')
        setLoading(false)
        return
      }

      setSuccess(true)
      toast.success('Email de recuperación enviado. Revisa tu bandeja de entrada.')
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Trophy className="login-icon" />
          <h1>Recuperar Contraseña</h1>
          <p>Te enviaremos un enlace para restablecer tu contraseña</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <CheckCircle size={64} style={{ color: '#10b981' }} />
            </div>
            <h2 style={{ color: '#333', marginBottom: '1rem' }}>Email Enviado</h2>
            <p style={{ color: '#666', marginBottom: '2rem', lineHeight: '1.6' }}>
              Te hemos enviado un enlace de recuperación a <strong>{email}</strong>.
              Por favor revisa tu bandeja de entrada y sigue las instrucciones.
            </p>
            <Link to="/login" className="link-button" style={{
              display: 'inline-block',
              marginBottom: '1rem',
              textDecoration: 'none'
            }}>
              ← Volver al Login
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="login-error">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <div className="form-group">
                <label>
                  <Mail size={18} />
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Email de Recuperación'}
              </button>
            </form>

            <div className="login-footer">
              <Link to="/login" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>
                <ArrowLeft size={16} />
                Volver al Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
