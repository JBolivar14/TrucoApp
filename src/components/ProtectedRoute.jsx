import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../services/authService'
import { supabase } from '../lib/supabase'

export function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthenticated(!!session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAuth = async () => {
    try {
      const { user } = await getCurrentUser()
      setAuthenticated(!!user)
    } catch (error) {
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Agregar estilos de animación
const style = document.createElement('style')
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
document.head.appendChild(style)
