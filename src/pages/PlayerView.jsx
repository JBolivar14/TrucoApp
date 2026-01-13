import { useState, useEffect } from 'react'
import { Trophy, Calendar, DollarSign, LogOut, User } from 'lucide-react'
import { useToast } from '../hooks/useToast'
import { getTournaments } from '../services/databaseService'
import { signOut, getCurrentProfile } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import './PlayerView.css'

function PlayerView() {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [tournamentsData, { profile }] = await Promise.all([
        getTournaments().catch(() => []),
        getCurrentProfile()
      ])
      
      // Filtrar solo torneos activos y planificados
      const upcomingTournaments = tournamentsData.filter(t => 
        t.status === 'planned' || t.status === 'active'
      )
      
      setTournaments(upcomingTournaments.map(t => ({
        id: t.id,
        name: t.name,
        entryFee: parseFloat(t.entry_fee),
        prizePool: parseFloat(t.prize_pool),
        date: t.date,
        status: t.status
      })))
      
      setUserProfile(profile)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast.error('Error al cargar los torneos')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      toast.error('Error al cerrar sesión')
    }
  }

  const handleBuyTicket = (tournament) => {
    // Generar ticket ID
    const ticketId = `TRU-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    const paymentUrl = `/pagar/${ticketId}?tournament=${encodeURIComponent(tournament.name)}&tournamentId=${tournament.id}&amount=${tournament.entryFee}&playerId=${userProfile?.id || ''}&playerName=${encodeURIComponent(userProfile?.full_name || '')}&email=${encodeURIComponent(userProfile?.email || '')}`
    navigate(paymentUrl)
  }

  if (loading) {
    return (
      <div className="player-view">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando torneos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="player-view">
      <header className="player-header">
        <div className="header-content">
          <Trophy className="header-icon" />
          <h1>Torneo de Truco</h1>
          <p>Portal de Jugadores</p>
        </div>
        <div className="header-actions">
          <div className="user-info">
            <User size={20} />
            <span>{userProfile?.full_name || userProfile?.email || 'Jugador'}</span>
          </div>
          <button className="btn-logout" onClick={handleSignOut}>
            <LogOut size={20} />
            Salir
          </button>
        </div>
      </header>

      <main className="player-main">
        <div className="player-section">
          <h2>Torneos Disponibles</h2>
          <p className="section-subtitle">Inscríbete a los torneos próximos</p>

          {tournaments.length === 0 ? (
            <div className="empty-state">
              <Trophy size={48} />
              <p>No hay torneos disponibles en este momento</p>
              <p className="empty-subtitle">Vuelve más tarde para ver nuevos torneos</p>
            </div>
          ) : (
            <div className="tournaments-grid">
              {tournaments.map(tournament => (
                <div key={tournament.id} className="tournament-card">
                  <div className="tournament-header">
                    <h3>{tournament.name}</h3>
                    <span className={`status-badge status-${tournament.status}`}>
                      {tournament.status === 'planned' && 'Planificado'}
                      {tournament.status === 'active' && 'En Curso'}
                    </span>
                  </div>
                  <div className="tournament-body">
                    <div className="tournament-info">
                      <div className="info-item">
                        <Calendar size={18} />
                        <span>{new Date(tournament.date).toLocaleDateString('es-AR')}</span>
                      </div>
                      <div className="info-item">
                        <DollarSign size={18} />
                        <span>Entrada: ${tournament.entryFee.toLocaleString('es-AR')}</span>
                      </div>
                      <div className="info-item">
                        <Trophy size={18} />
                        <span>Premio: ${tournament.prizePool.toLocaleString('es-AR')}</span>
                      </div>
                    </div>
                    <button 
                      className="btn-buy-ticket"
                      onClick={() => handleBuyTicket(tournament)}
                    >
                      <DollarSign size={20} />
                      Comprar Entrada
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default PlayerView
