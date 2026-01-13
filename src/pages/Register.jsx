import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Trophy, User, Mail, Phone, CheckCircle, AlertCircle, ArrowRight, Contact } from 'lucide-react'
import { signUpWithRole } from '../services/authService'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/Toast'
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
  const [tournamentAmount, setTournamentAmount] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const [contactPickerAvailable, setContactPickerAvailable] = useState(false)

  useEffect(() => {
    const initialize = async () => {
      try {
        setInitializing(true)
        setError('')
        
        // Obtener datos del QR/URL
        const tId = searchParams.get('tournamentId')
        const tName = searchParams.get('tournamentName')
        const tAmount = searchParams.get('amount')
        
        if (tId) {
          setTournamentId(tId)
        }
        
        if (tName) {
          try {
            // Decodificar correctamente, manejando tanto %20 como +
            const decodedName = decodeURIComponent(tName.replace(/\+/g, ' '))
            setTournamentName(decodedName)
          } catch (decodeErr) {
            // Si falla decodeURIComponent, usar el valor original
            setTournamentName(tName.replace(/\+/g, ' '))
          }
        }

        if (tAmount) {
          const amount = parseFloat(tAmount)
          if (!isNaN(amount)) {
            setTournamentAmount(amount)
          }
        }

        // Verificar si la Contact Picker API está disponible (Chrome en Android principalmente)
        if (navigator.contacts && window.ContactsManager) {
          try {
            const contactsManager = new window.ContactsManager()
            const supported = await contactsManager.getProperties()
            if (supported && supported.length > 0) {
              setContactPickerAvailable(true)
            }
          } catch (err) {
            // API no disponible o no soportada
            console.log('Contact Picker API no disponible:', err)
          }
        }
      } catch (err) {
        console.error('Error al procesar parámetros de URL:', err)
        setError('Error al cargar los datos del torneo. Por favor, intenta nuevamente.')
      } finally {
        setInitializing(false)
      }
    }

    initialize()
  }, [searchParams])

  const handleFillFromContacts = async () => {
    try {
      // Intentar usar Contact Picker API si está disponible (Chrome en Android)
      if (navigator.contacts && window.ContactsManager) {
        const contactsManager = new window.ContactsManager()
        const contacts = await contactsManager.select(['name', 'email', 'tel'], { multiple: false })
        
        if (contacts && contacts.length > 0) {
          const contact = contacts[0]
          setFormData(prev => ({
            ...prev,
            fullName: contact.name?.[0] || prev.fullName,
            email: contact.email?.[0] || prev.email,
            phone: contact.tel?.[0] || prev.phone
          }))
          toast.success('Datos cargados desde contactos')
        }
      } else {
        // Si no está disponible, sugerir usar el autocompletado del navegador
        toast.info('Usa el autocompletado del navegador para llenar los campos automáticamente')
      }
    } catch (err) {
      // El usuario canceló o hubo un error
      if (err.name !== 'AbortError' && err.name !== 'NotSupportedError') {
        console.error('Error al acceder a contactos:', err)
        toast.error('No se pudieron cargar los contactos. Usa el autocompletado del navegador.')
      }
    }
  }

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
        // Asegurarse de que siempre se pase el amount (incluso si es 0)
        const amount = tournamentAmount !== null && tournamentAmount !== undefined ? tournamentAmount : 0
        const paymentUrl = `/pagar/${ticketId}?tournament=${encodeURIComponent(tournamentName || 'Torneo de Truco')}&tournamentId=${tournamentId}&amount=${amount}&playerId=${data.user?.id || ''}&playerName=${encodeURIComponent(formData.fullName)}&phone=${encodeURIComponent(formData.phone)}&email=${encodeURIComponent(formData.email)}`
        
        // Esperar un momento para que se cree el perfil en Supabase
        setTimeout(() => {
          navigate(paymentUrl)
        }, 1500)
      } else {
        // Si no hay torneo, redirigir al login
        setTimeout(() => {
          navigate('/login')
        }, 1000)
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

  // Mostrar estado de carga solo si hay parámetros en la URL
  if (initializing && (searchParams.get('tournamentId') || searchParams.get('tournamentName'))) {
    return (
      <div className="register-page">
        <div className="register-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando información del torneo...</p>
          </div>
        </div>
      </div>
    )
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
          {/* Botón para llenar desde contactos (solo en móvil) */}
          {contactPickerAvailable && (
            <button
              type="button"
              onClick={handleFillFromContacts}
              className="fill-from-contacts-btn"
            >
              <Contact size={18} />
              Llenar desde mis contactos
            </button>
          )}

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
              autoFocus={typeof window !== 'undefined' && window.innerWidth > 768}
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
              inputMode="tel"
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
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  )
}

export default Register
