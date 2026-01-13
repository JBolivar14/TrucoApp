import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Trophy, User, Mail, Phone, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { signUpWithRole } from '../services/authService'
import { useToast } from '../hooks/useToast'
import './Register.css'

function Register() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tournamentId, setTournamentId] = useState(null)
  const [tournamentName, setTournamentName] = useState('')

  useEffect(() => {
    // Obtener datos del QR/URL
    const tId = searchParams.get('tournamentId')
    const tName = searchParams.get('tournamentName')
    
    if (tId) setTournamentId(tId)
    if (tName) setTournamentName(decodeURIComponent(tName))

    // Intentar obtener datos del navegador si es móvil
    if (navigator.userAgent.match(/Mobile|Android|iPhone|iPad/i)) {
      // En móvil, intentar obtener datos del dispositivo si están disponibles
      // Esto es limitado por privacidad del navegador, pero podemos intentar
      if (navigator.contacts) {
        // API de contactos no está disponible en navegadores web por privacidad
        // Pero podemos sugerir al usuario que use autocompletado
      }
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validaciones
    if (!formData.fullName.trim()) {
      setError('El nombre completo es obligatorio')
      setLoading(false)
      return
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('El email no es válido')
      setLoading(false)
      return
    }

    if (!formData.phone || formData.phone.length < 8) {
      setError('El teléfono es obligatorio')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    try {
      // Registrar usuario como jugador
      const { data, error: signUpError } = await signUpWithRole(
        formData.email,
        formData.password,
        formData.fullName,
        'player'
      )

      if (signUpError) {
        setError(signUpError.message || 'Error al crear la cuenta')
        setLoading(false)
        return
      }

      toast.success('¡Cuenta creada exitosamente!')

      // Redirigir a la página de pago/inscripción
      if (tournamentId) {
        // Generar ticket ID para el pago
        const ticketId = `TRU-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        const paymentUrl = `/pagar/${ticketId}?tournament=${encodeURIComponent(tournamentName)}&tournamentId=${tournamentId}&playerId=${data.user?.id || ''}&playerName=${encodeURIComponent(formData.fullName)}&phone=${encodeURIComponent(formData.phone)}&email=${encodeURIComponent(formData.email)}`
        
        // Esperar un momento para que se cree el perfil
        setTimeout(() => {
          navigate(paymentUrl)
        }, 1000)
      } else {
        // Si no hay torneo, redirigir al login
        navigate('/login')
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado')
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <header className="register-header">
          <Trophy className="register-icon" />
          <h1>Registro de Jugador</h1>
          <p>Completa tus datos para participar en el torneo</p>
          {tournamentName && (
            <div className="tournament-badge">
              <Trophy size={18} />
              <span>{tournamentName}</span>
            </div>
          )}
        </header>

        {error && (
          <div className="register-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>
              <User size={18} />
              Nombre Completo *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label>
              <Mail size={18} />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>
              <Phone size={18} />
              Teléfono *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+54 9 11 1234-5678"
              required
              autoComplete="tel"
            />
          </div>

          <div className="form-group">
            <label>
              <User size={18} />
              Contraseña *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label>
              <User size={18} />
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirma tu contraseña"
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="register-submit"
            disabled={loading}
          >
            {loading ? 'Registrando...' : (
              <>
                Registrarse
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="link-button">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
