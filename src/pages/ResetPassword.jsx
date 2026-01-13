import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Trophy, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { updatePassword } from '../services/authService'
import { useToast } from '../hooks/useToast'
import './Login.css'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    // Verificar si hay un token de recuperación en la URL
    // Supabase maneja esto automáticamente, pero podemos verificar
    const hash = window.location.hash
    if (!hash.includes('type=recovery')) {
      // Si no hay token de recuperación, redirigir al login
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.password || !formData.confirmPassword) {
        setError('Por favor completa todos los campos')
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

      const { error: updateError } = await updatePassword(formData.password)
      
      if (updateError) {
        setError(updateError.message || 'Error al actualizar la contraseña')
        setLoading(false)
        return
      }

      setSuccess(true)
      toast.success('¡Contraseña actualizada exitosamente!')
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login')
      }, 2000)
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

  if (success) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <Trophy className="login-icon" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <CheckCircle size={64} style={{ color: '#10b981' }} />
            </div>
            <h2 style={{ color: '#333', marginBottom: '1rem' }}>¡Contraseña Actualizada!</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Tu contraseña ha sido actualizada exitosamente. Serás redirigido al login...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Trophy className="login-icon" />
          <h1>Nueva Contraseña</h1>
          <p>Ingresa tu nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label>
              <Lock size={18} />
              Nueva Contraseña *
            </label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                disabled={loading}
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

          <div className="form-group">
            <label>
              <Lock size={18} />
              Confirmar Nueva Contraseña *
            </label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirma tu nueva contraseña"
                required
                disabled={loading}
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

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
