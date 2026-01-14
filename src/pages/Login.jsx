import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { Trophy, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { signIn, signUp, signUpWithRole, getCurrentUser } from '../services/authService'
import { useToast } from '../hooks/useToast'
import './Login.css'

function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    // Verificar si ya está autenticado
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { user } = await getCurrentUser()
    if (user) {
      const redirectTo = searchParams.get('redirectTo')
      if (redirectTo) {
        navigate(decodeURIComponent(redirectTo))
      } else {
        navigate('/')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // Iniciar sesión
        if (!formData.email || !formData.password) {
          setError('Por favor completa todos los campos')
          setLoading(false)
          return
        }

        const { data, error: signInError } = await signIn(formData.email, formData.password)
        
        if (signInError) {
          setError(signInError.message || 'Error al iniciar sesión')
          setLoading(false)
          return
        }

        toast.success('¡Bienvenido de nuevo!')
        
        // Redirigir a la URL especificada o al dashboard por defecto
        const redirectTo = searchParams.get('redirectTo')
        if (redirectTo) {
          navigate(decodeURIComponent(redirectTo))
        } else {
          navigate('/')
        }
      } else {
        // Registro
        if (!formData.email || !formData.password || !formData.fullName) {
          setError('Por favor completa todos los campos obligatorios')
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

        // Registrar como jugador por defecto
        // Los administradores se asignan manualmente desde la cuenta maestra
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

        toast.success('¡Cuenta creada exitosamente! Por favor verifica tu email.')
        setIsLogin(true)
        setFormData({ email: formData.email, password: '', fullName: '', confirmPassword: '' })
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado')
    } finally {
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
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Trophy className="login-icon" />
          <h1>Torneo de Truco</h1>
          <p>Gestión de Torneos y Pagos</p>
        </div>

        <div className="login-tabs">
          <button
            className={`login-tab ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true)
              setError('')
              setFormData({ email: '', password: '', fullName: '', confirmPassword: '' })
            }}
          >
            Iniciar Sesión
          </button>
          <button
            className={`login-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false)
              setError('')
              setFormData({ email: '', password: '', fullName: '', confirmPassword: '' })
            }}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {!isLogin && (
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
                required={!isLogin}
              />
            </div>
          )}

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
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={18} />
              Contraseña *
            </label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isLogin ? "Tu contraseña" : "Mínimo 6 caracteres"}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>
                <Lock size={18} />
                Confirmar Contraseña *
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirma tu contraseña"
                  required={!isLogin}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>
        </form>

          {isLogin && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link
                to="/forgot-password"
                className="link-button"
                style={{ fontSize: '0.9rem' }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          )}

          <div className="login-footer">
          {isLogin ? (
            <p>
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => setIsLogin(false)}
              >
                Regístrate aquí
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => setIsLogin(true)}
              >
                Inicia sesión aquí
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
