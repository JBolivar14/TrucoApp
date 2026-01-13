import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentProfile } from '../services/authService'

export function AdminProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const { profile } = await getCurrentProfile()
      const role = profile?.role || 'player'
      setIsAdmin(role === 'admin')
    } catch (error) {
      setIsAdmin(false)
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

  if (!isAdmin) {
    // Si no es admin, redirigir a la vista de jugador
    return <Navigate to="/jugador" replace />
  }

  return children
}
