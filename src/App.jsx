import { useState, useEffect } from 'react'
import { Trophy, Users, DollarSign, Calendar, Plus, Edit2, Trash2, CheckCircle, XCircle, QrCode, Download, X, Share2, Printer, BarChart3, FileDown, FileUp, Search } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { ToastContainer } from './components/Toast'
import { ConfirmDialog } from './components/ConfirmDialog'
import { useToast } from './hooks/useToast'
import { exportToCSV, exportToJSON, exportAllData, importFromJSON } from './utils/exportData'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('players')
  const [players, setPlayers] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [payments, setPayments] = useState([])
  const [matches, setMatches] = useState([])
  const [paymentRecords, setPaymentRecords] = useState([])
  const toast = useToast()

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedPlayers = localStorage.getItem('trucoPlayers')
    const savedTournaments = localStorage.getItem('trucoTournaments')
    const savedPayments = localStorage.getItem('trucoPayments')
    const savedMatches = localStorage.getItem('trucoMatches')
    const savedPaymentRecords = localStorage.getItem('trucoPaymentRecords')

    if (savedPlayers) setPlayers(JSON.parse(savedPlayers))
    if (savedTournaments) setTournaments(JSON.parse(savedTournaments))
    if (savedPayments) setPayments(JSON.parse(savedPayments))
    if (savedMatches) setMatches(JSON.parse(savedMatches))
    if (savedPaymentRecords) setPaymentRecords(JSON.parse(savedPaymentRecords))
  }, [])

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('trucoPlayers', JSON.stringify(players))
  }, [players])

  useEffect(() => {
    localStorage.setItem('trucoTournaments', JSON.stringify(tournaments))
  }, [tournaments])

  useEffect(() => {
    localStorage.setItem('trucoPayments', JSON.stringify(payments))
  }, [payments])

  useEffect(() => {
    localStorage.setItem('trucoMatches', JSON.stringify(matches))
  }, [matches])

  useEffect(() => {
    localStorage.setItem('trucoPaymentRecords', JSON.stringify(paymentRecords))
  }, [paymentRecords])

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <Trophy className="header-icon" />
          <h1>Torneo de Truco</h1>
          <p>Gestión de Torneos y Pagos</p>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart3 size={20} />
          Dashboard
        </button>
        <button
          className={activeTab === 'players' ? 'active' : ''}
          onClick={() => setActiveTab('players')}
        >
          <Users size={20} />
          Jugadores
        </button>
        <button
          className={activeTab === 'tournaments' ? 'active' : ''}
          onClick={() => setActiveTab('tournaments')}
        >
          <Trophy size={20} />
          Torneos
        </button>
        <button
          className={activeTab === 'matches' ? 'active' : ''}
          onClick={() => setActiveTab('matches')}
        >
          <Calendar size={20} />
          Partidas
        </button>
        <button
          className={activeTab === 'payments' ? 'active' : ''}
          onClick={() => setActiveTab('payments')}
        >
          <DollarSign size={20} />
          Pagos
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'dashboard' && (
          <DashboardTab
            players={players}
            tournaments={tournaments}
            matches={matches}
            payments={payments}
            paymentRecords={paymentRecords}
            exportAllData={() => exportAllData({ players, tournaments, matches, payments, paymentRecords })}
            importData={(data) => {
              if (data.data) {
                if (data.data.players) setPlayers(data.data.players)
                if (data.data.tournaments) setTournaments(data.data.tournaments)
                if (data.data.matches) setMatches(data.data.matches)
                if (data.data.payments) setPayments(data.data.payments)
                if (data.data.paymentRecords) setPaymentRecords(data.data.paymentRecords)
                toast.success('Datos importados correctamente')
              }
            }}
            toast={toast}
          />
        )}
        {activeTab === 'players' && (
          <PlayersTab players={players} setPlayers={setPlayers} toast={toast} />
        )}
        {activeTab === 'tournaments' && (
          <TournamentsTab
            tournaments={tournaments}
            setTournaments={setTournaments}
            players={players}
            matches={matches}
            setMatches={setMatches}
            toast={toast}
          />
        )}
        {activeTab === 'matches' && (
          <MatchesTab
            matches={matches}
            setMatches={setMatches}
            players={players}
            tournaments={tournaments}
            toast={toast}
          />
        )}
        {activeTab === 'payments' && (
          <PaymentsTab
            payments={payments}
            setPayments={setPayments}
            players={players}
            tournaments={tournaments}
            paymentRecords={paymentRecords}
            setPaymentRecords={setPaymentRecords}
            toast={toast}
          />
        )}
      </main>
      
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  )
}

// Componente de Jugadores
function PlayersTab({ players, setPlayers, toast }) {
  const [showForm, setShowForm] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' })

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (player.phone && player.phone.includes(searchTerm)) ||
    (player.email && player.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validaciones
    if (!formData.name.trim()) {
      toast.error('El nombre es obligatorio')
      return
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('El email no es válido')
      return
    }

    if (editingPlayer) {
      setPlayers(players.map(p => p.id === editingPlayer.id ? { ...p, ...formData } : p))
      setEditingPlayer(null)
      toast.success('Jugador actualizado correctamente')
    } else {
      // Verificar si ya existe un jugador con el mismo nombre
      if (players.some(p => p.name.toLowerCase() === formData.name.toLowerCase())) {
        if (!window.confirm('Ya existe un jugador con ese nombre. ¿Deseas agregarlo de todas formas?')) {
          return
        }
      }

      const newPlayer = {
        id: Date.now(),
        ...formData,
        name: formData.name.trim(),
        registeredAt: new Date().toISOString()
      }
      setPlayers([...players, newPlayer])
      toast.success('Jugador agregado correctamente')
    }
    setFormData({ name: '', phone: '', email: '' })
    setShowForm(false)
  }

  const handleEdit = (player) => {
    setEditingPlayer(player)
    setFormData({ name: player.name, phone: player.phone || '', email: player.email || '' })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setConfirmDelete(id)
  }

  const confirmDeleteAction = () => {
    if (confirmDelete) {
      setPlayers(players.filter(p => p.id !== confirmDelete))
      toast.success('Jugador eliminado correctamente')
      setConfirmDelete(null)
    }
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Jugadores Registrados</h2>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => exportToCSV(players, 'jugadores')}>
            <Download size={18} />
            Exportar CSV
          </button>
          <button className="btn-primary" onClick={() => { setShowForm(true); setEditingPlayer(null); setFormData({ name: '', phone: '', email: '' }) }}>
            <Plus size={20} />
            Agregar Jugador
          </button>
        </div>
      </div>

      <div className="search-container">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar jugadores por nombre, teléfono o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDeleteAction}
        title="Eliminar Jugador"
        message="¿Estás seguro de eliminar este jugador? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      {showForm && (
        <div className="modal-overlay" onClick={() => { setShowForm(false); setEditingPlayer(null) }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingPlayer ? 'Editar Jugador' : 'Nuevo Jugador'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre completo"
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
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
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingPlayer ? 'Actualizar' : 'Agregar'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditingPlayer(null) }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="cards-grid">
        {filteredPlayers.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <p>{searchTerm ? 'No se encontraron jugadores' : 'No hay jugadores registrados'}</p>
            <p className="empty-subtitle">{searchTerm ? 'Intenta con otro término de búsqueda' : 'Agrega jugadores para comenzar'}</p>
          </div>
        ) : (
          filteredPlayers.map(player => (
            <div key={player.id} className="card">
              <div className="card-header">
                <h3>{player.name}</h3>
                <div className="card-actions">
                  <button className="icon-btn" onClick={() => handleEdit(player)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="icon-btn danger" onClick={() => handleDelete(player.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="card-body">
                {player.phone && <p><strong>Teléfono:</strong> {player.phone}</p>}
                {player.email && <p><strong>Email:</strong> {player.email}</p>}
                <p className="card-meta">Registrado: {new Date(player.registeredAt).toLocaleDateString('es-AR')}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Componente de Torneos
function TournamentsTab({ tournaments, setTournaments, players, matches, setMatches, toast }) {
  const [showForm, setShowForm] = useState(false)
  const [editingTournament, setEditingTournament] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    entryFee: '',
    prizePool: '',
    date: new Date().toISOString().split('T')[0],
    status: 'planned'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validaciones
    if (!formData.name.trim()) {
      toast.error('El nombre del torneo es obligatorio')
      return
    }

    const entryFee = parseFloat(formData.entryFee)
    const prizePool = parseFloat(formData.prizePool)

    if (isNaN(entryFee) || entryFee < 0) {
      toast.error('La entrada debe ser un número válido mayor o igual a 0')
      return
    }

    if (isNaN(prizePool) || prizePool < 0) {
      toast.error('El premio debe ser un número válido mayor o igual a 0')
      return
    }

    if (new Date(formData.date) < new Date().setHours(0, 0, 0, 0) && formData.status !== 'completed') {
      if (!window.confirm('La fecha del torneo es anterior a hoy. ¿Deseas continuar?')) {
        return
      }
    }

    if (editingTournament) {
      setTournaments(tournaments.map(t => t.id === editingTournament.id ? { ...t, ...formData, entryFee, prizePool } : t))
      setEditingTournament(null)
      toast.success('Torneo actualizado correctamente')
    } else {
      const newTournament = {
        id: Date.now(),
        ...formData,
        name: formData.name.trim(),
        entryFee,
        prizePool,
        createdAt: new Date().toISOString(),
        participants: []
      }
      setTournaments([...tournaments, newTournament])
      toast.success('Torneo creado correctamente')
    }
    setFormData({ name: '', entryFee: '', prizePool: '', date: new Date().toISOString().split('T')[0], status: 'planned' })
    setShowForm(false)
  }

  const handleEdit = (tournament) => {
    setEditingTournament(tournament)
    setFormData({
      name: tournament.name,
      entryFee: tournament.entryFee.toString(),
      prizePool: tournament.prizePool.toString(),
      date: tournament.date,
      status: tournament.status
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setConfirmDelete(id)
  }

  const confirmDeleteAction = () => {
    if (confirmDelete) {
      setTournaments(tournaments.filter(t => t.id !== confirmDelete))
      setMatches(matches.filter(m => m.tournamentId !== confirmDelete))
      toast.success('Torneo eliminado correctamente')
      setConfirmDelete(null)
    }
  }

  const addParticipant = (tournamentId, playerId) => {
    setTournaments(tournaments.map(t => {
      if (t.id === tournamentId && !t.participants.includes(playerId)) {
        toast.success('Participante agregado al torneo')
        return { ...t, participants: [...t.participants, playerId] }
      }
      return t
    }))
  }

  const removeParticipant = (tournamentId, playerId) => {
    setTournaments(tournaments.map(t => {
      if (t.id === tournamentId) {
        return { ...t, participants: t.participants.filter(p => p !== playerId) }
      }
      return t
    }))
  }

  const getTournamentStats = (tournament) => {
    const tournamentMatches = matches.filter(m => m.tournamentId === tournament.id)
    const completedMatches = tournamentMatches.filter(m => m.status === 'completed').length
    const totalRevenue = tournament.participants.length * tournament.entryFee
    return { completedMatches, totalMatches: tournamentMatches.length, totalRevenue }
  }

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || tournament.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Torneos</h2>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => exportToCSV(tournaments, 'torneos')}>
            <Download size={18} />
            Exportar CSV
          </button>
          <button className="btn-primary" onClick={() => { setShowForm(true); setEditingTournament(null); setFormData({ name: '', entryFee: '', prizePool: '', date: new Date().toISOString().split('T')[0], status: 'planned' }) }}>
            <Plus size={20} />
            Crear Torneo
          </button>
        </div>
      </div>

      <div className="search-container">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar torneos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-container">
          <button
            className={`filter-button ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            Todos
          </button>
          <button
            className={`filter-button ${statusFilter === 'planned' ? 'active' : ''}`}
            onClick={() => setStatusFilter('planned')}
          >
            Planificados
          </button>
          <button
            className={`filter-button ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            En Curso
          </button>
          <button
            className={`filter-button ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completados
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDeleteAction}
        title="Eliminar Torneo"
        message="¿Estás seguro de eliminar este torneo? También se eliminarán todas las partidas asociadas. Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      {showForm && (
        <div className="modal-overlay" onClick={() => { setShowForm(false); setEditingTournament(null) }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingTournament ? 'Editar Torneo' : 'Nuevo Torneo'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre del Torneo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Torneo de Truco 2024"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Entrada ($) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.entryFee}
                    onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                    placeholder="1000"
                  />
                </div>
                <div className="form-group">
                  <label>Premio Total ($) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.prizePool}
                    onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                    placeholder="5000"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Estado *</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="planned">Planificado</option>
                    <option value="active">En Curso</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingTournament ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditingTournament(null) }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="cards-grid">
        {filteredTournaments.length === 0 ? (
          <div className="empty-state">
            <Trophy size={48} />
            <p>{searchTerm || statusFilter !== 'all' ? 'No se encontraron torneos' : 'No hay torneos creados'}</p>
            <p className="empty-subtitle">{searchTerm || statusFilter !== 'all' ? 'Intenta con otros filtros' : 'Crea un torneo para comenzar'}</p>
          </div>
        ) : (
          filteredTournaments.map(tournament => {
            const stats = getTournamentStats(tournament)
            const availablePlayers = players.filter(p => !tournament.participants.includes(p.id))
            return (
              <div key={tournament.id} className="card tournament-card">
                <div className="card-header">
                  <div>
                    <h3>{tournament.name}</h3>
                    <span className={`status-badge status-${tournament.status}`}>
                      {tournament.status === 'planned' && 'Planificado'}
                      {tournament.status === 'active' && 'En Curso'}
                      {tournament.status === 'completed' && 'Completado'}
                      {tournament.status === 'cancelled' && 'Cancelado'}
                    </span>
                  </div>
                  <div className="card-actions">
                    <button className="icon-btn" onClick={() => handleEdit(tournament)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="icon-btn danger" onClick={() => handleDelete(tournament.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="stats-row">
                    <div className="stat">
                      <strong>Fecha:</strong> {new Date(tournament.date).toLocaleDateString('es-AR')}
                    </div>
                    <div className="stat">
                      <strong>Entrada:</strong> ${tournament.entryFee.toLocaleString('es-AR')}
                    </div>
                    <div className="stat">
                      <strong>Premio:</strong> ${tournament.prizePool.toLocaleString('es-AR')}
                    </div>
                  </div>
                  <div className="stats-row">
                    <div className="stat">
                      <strong>Participantes:</strong> {tournament.participants.length}
                    </div>
                    <div className="stat">
                      <strong>Partidas:</strong> {stats.completedMatches}/{stats.totalMatches}
                    </div>
                    <div className="stat">
                      <strong>Recaudado:</strong> ${stats.totalRevenue.toLocaleString('es-AR')}
                    </div>
                  </div>
                  
                  <div className="participants-section">
                    <h4>Participantes</h4>
                    {tournament.participants.length > 0 ? (
                      <div className="participants-list">
                        {tournament.participants.map(pid => {
                          const player = players.find(p => p.id === pid)
                          return player ? (
                            <div key={pid} className="participant-tag">
                              {player.name}
                              <button className="tag-remove" onClick={() => removeParticipant(tournament.id, pid)}>×</button>
                            </div>
                          ) : null
                        })}
                      </div>
                    ) : (
                      <p className="empty-participants">No hay participantes</p>
                    )}
                    
                    {availablePlayers.length > 0 && (
                      <select
                        className="add-participant-select"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            addParticipant(tournament.id, parseInt(e.target.value))
                            e.target.value = ""
                          }
                        }}
                      >
                        <option value="">Agregar participante...</option>
                        {availablePlayers.map(player => (
                          <option key={player.id} value={player.id}>{player.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// Componente de Partidas
function MatchesTab({ matches, setMatches, players, tournaments, toast }) {
  const [showForm, setShowForm] = useState(false)
  const [editingMatch, setEditingMatch] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [formData, setFormData] = useState({
    tournamentId: '',
    player1Id: '',
    player2Id: '',
    player1Score: '',
    player2Score: '',
    date: new Date().toISOString().split('T')[0],
    status: 'scheduled'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingMatch) {
      setMatches(matches.map(m => m.id === editingMatch.id ? {
        ...m,
        ...formData,
        player1Id: parseInt(formData.player1Id),
        player2Id: parseInt(formData.player2Id),
        player1Score: formData.player1Score ? parseInt(formData.player1Score) : null,
        player2Score: formData.player2Score ? parseInt(formData.player2Score) : null,
        tournamentId: parseInt(formData.tournamentId)
      } : m))
      setEditingMatch(null)
    } else {
      const newMatch = {
        id: Date.now(),
        tournamentId: parseInt(formData.tournamentId),
        player1Id: parseInt(formData.player1Id),
        player2Id: parseInt(formData.player2Id),
        player1Score: formData.player1Score ? parseInt(formData.player1Score) : null,
        player2Score: formData.player2Score ? parseInt(formData.player2Score) : null,
        date: formData.date,
        status: formData.status,
        createdAt: new Date().toISOString()
      }
      setMatches([...matches, newMatch])
    }
    setFormData({
      tournamentId: '',
      player1Id: '',
      player2Id: '',
      player1Score: '',
      player2Score: '',
      date: new Date().toISOString().split('T')[0],
      status: 'scheduled'
    })
    setShowForm(false)
  }

  const handleEdit = (match) => {
    setEditingMatch(match)
    setFormData({
      tournamentId: match.tournamentId.toString(),
      player1Id: match.player1Id.toString(),
      player2Id: match.player2Id.toString(),
      player1Score: match.player1Score?.toString() || '',
      player2Score: match.player2Score?.toString() || '',
      date: match.date,
      status: match.status
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setConfirmDelete(id)
  }

  const confirmDeleteAction = () => {
    if (confirmDelete) {
      setMatches(matches.filter(m => m.id !== confirmDelete))
      toast.success('Partida eliminada correctamente')
      setConfirmDelete(null)
    }
  }

  const getPlayerName = (id) => {
    const player = players.find(p => p.id === id)
    return player ? player.name : 'Desconocido'
  }

  const getTournamentName = (id) => {
    const tournament = tournaments.find(t => t.id === id)
    return tournament ? tournament.name : 'Sin torneo'
  }

  const getWinner = (match) => {
    if (match.status !== 'completed' || !match.player1Score || !match.player2Score) return null
    if (match.player1Score > match.player2Score) return match.player1Id
    if (match.player2Score > match.player1Score) return match.player2Id
    return 'draw'
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Partidas</h2>
        <button className="btn-primary" onClick={() => { setShowForm(true); setEditingMatch(null); setFormData({ tournamentId: '', player1Id: '', player2Id: '', player1Score: '', player2Score: '', date: new Date().toISOString().split('T')[0], status: 'scheduled' }) }}>
          <Plus size={20} />
          Nueva Partida
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => { setShowForm(false); setEditingMatch(null) }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingMatch ? 'Editar Partida' : 'Nueva Partida'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Torneo *</label>
                <select
                  required
                  value={formData.tournamentId}
                  onChange={(e) => setFormData({ ...formData, tournamentId: e.target.value })}
                >
                  <option value="">Seleccionar torneo...</option>
                  {tournaments.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Jugador 1 *</label>
                  <select
                    required
                    value={formData.player1Id}
                    onChange={(e) => setFormData({ ...formData, player1Id: e.target.value })}
                  >
                    <option value="">Seleccionar...</option>
                    {players.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Jugador 2 *</label>
                  <select
                    required
                    value={formData.player2Id}
                    onChange={(e) => setFormData({ ...formData, player2Id: e.target.value })}
                  >
                    <option value="">Seleccionar...</option>
                    {players.filter(p => p.id !== parseInt(formData.player1Id)).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Puntos Jugador 1</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.player1Score}
                    onChange={(e) => setFormData({ ...formData, player1Score: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Puntos Jugador 2</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.player2Score}
                    onChange={(e) => setFormData({ ...formData, player2Score: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Estado *</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="scheduled">Programada</option>
                    <option value="in-progress">En Curso</option>
                    <option value="completed">Completada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingMatch ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditingMatch(null) }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="matches-list">
        {matches.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <p>No hay partidas registradas</p>
            <p className="empty-subtitle">Crea una partida para comenzar</p>
          </div>
        ) : (
          matches.map(match => {
            const winner = getWinner(match)
            return (
              <div key={match.id} className="match-card">
                <div className="match-header">
                  <div>
                    <h3>{getTournamentName(match.tournamentId)}</h3>
                    <span className={`status-badge status-${match.status}`}>
                      {match.status === 'scheduled' && 'Programada'}
                      {match.status === 'in-progress' && 'En Curso'}
                      {match.status === 'completed' && 'Completada'}
                      {match.status === 'cancelled' && 'Cancelada'}
                    </span>
                  </div>
                  <div className="card-actions">
                    <button className="icon-btn" onClick={() => handleEdit(match)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="icon-btn danger" onClick={() => handleDelete(match.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="match-body">
                  <div className="match-players">
                    <div className={`match-player ${winner === match.player1Id ? 'winner' : ''}`}>
                      <span className="player-name">{getPlayerName(match.player1Id)}</span>
                      <span className="player-score">
                        {match.player1Score !== null ? match.player1Score : '-'}
                        {winner === match.player1Id && <CheckCircle size={16} className="winner-icon" />}
                      </span>
                    </div>
                    <div className="match-vs">VS</div>
                    <div className={`match-player ${winner === match.player2Id ? 'winner' : ''}`}>
                      <span className="player-name">{getPlayerName(match.player2Id)}</span>
                      <span className="player-score">
                        {match.player2Score !== null ? match.player2Score : '-'}
                        {winner === match.player2Id && <CheckCircle size={16} className="winner-icon" />}
                      </span>
                    </div>
                  </div>
                  <div className="match-meta">
                    <span>Fecha: {new Date(match.date).toLocaleDateString('es-AR')}</span>
                    {winner === 'draw' && <span className="draw-badge">Empate</span>}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// Componente de Pagos
function PaymentsTab({ payments, setPayments, players, tournaments, paymentRecords, setPaymentRecords, toast }) {
  const [showForm, setShowForm] = useState(false)
  const [editingPayment, setEditingPayment] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [showQRGenerator, setShowQRGenerator] = useState(false)
  const [generatedQR, setGeneratedQR] = useState(null)
  const [showQRRecords, setShowQRRecords] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [qrFormData, setQRFormData] = useState({
    tournamentId: '',
    amount: '',
    organizerName: ''
  })
  const [formData, setFormData] = useState({
    type: 'entry',
    playerId: '',
    tournamentId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingPayment) {
      setPayments(payments.map(p => p.id === editingPayment.id ? {
        ...p,
        ...formData,
        playerId: parseInt(formData.playerId),
        tournamentId: formData.tournamentId ? parseInt(formData.tournamentId) : null,
        amount: parseFloat(formData.amount)
      } : p))
      setEditingPayment(null)
    } else {
      const newPayment = {
        id: Date.now(),
        type: formData.type,
        playerId: parseInt(formData.playerId),
        tournamentId: formData.tournamentId ? parseInt(formData.tournamentId) : null,
        amount: parseFloat(formData.amount),
        date: formData.date,
        status: formData.status,
        notes: formData.notes,
        createdAt: new Date().toISOString()
      }
      setPayments([...payments, newPayment])
    }
    setFormData({
      type: 'entry',
      playerId: '',
      tournamentId: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: ''
    })
    setShowForm(false)
  }

  const handleEdit = (payment) => {
    setEditingPayment(payment)
    setFormData({
      type: payment.type,
      playerId: payment.playerId.toString(),
      tournamentId: payment.tournamentId?.toString() || '',
      amount: payment.amount.toString(),
      date: payment.date,
      status: payment.status,
      notes: payment.notes || ''
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setConfirmDelete(id)
  }

  const confirmDeleteAction = () => {
    if (confirmDelete) {
      setPayments(payments.filter(p => p.id !== confirmDelete))
      toast.success('Pago eliminado correctamente')
      setConfirmDelete(null)
    }
  }

  const getPlayerName = (id) => {
    const player = players.find(p => p.id === id)
    return player ? player.name : 'Desconocido'
  }

  const getTournamentName = (id) => {
    if (!id) return 'N/A'
    const tournament = tournaments.find(t => t.id === id)
    return tournament ? tournament.name : 'Desconocido'
  }

  const getTotalStats = () => {
    const totalRevenue = payments
      .filter(p => p.type === 'entry' && p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)
    const totalPrizes = payments
      .filter(p => p.type === 'prize' && p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)
    const pendingPayments = payments.filter(p => p.status === 'pending').length
    return { totalRevenue, totalPrizes, net: totalRevenue - totalPrizes, pendingPayments }
  }

  const stats = getTotalStats()

  const generatePaymentQR = (e) => {
    e.preventDefault()
    const tournament = tournaments.find(t => t.id === parseInt(qrFormData.tournamentId))
    const ticketId = `TRU-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    const baseUrl = window.location.origin
    const params = new URLSearchParams({
      tournament: tournament?.name || 'Torneo de Truco',
      amount: qrFormData.amount || tournament?.entryFee || '0',
      date: tournament?.date || new Date().toISOString().split('T')[0],
      organizer: qrFormData.organizerName
    })
    
    const paymentUrl = `${baseUrl}/pagar/${ticketId}?${params.toString()}`
    
    setGeneratedQR({
      ticketId,
      url: paymentUrl,
      tournamentName: tournament?.name || 'Torneo de Truco',
      amount: parseFloat(qrFormData.amount || tournament?.entryFee || 0),
      organizerName: qrFormData.organizerName
    })
  }

  const downloadQR = () => {
    const svg = document.getElementById('payment-qr-code')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width * 2
      canvas.height = img.height * 2
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      const link = document.createElement('a')
      link.download = `boleta-pago-${generatedQR.ticketId}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const printQR = () => {
    const printContent = document.getElementById('qr-ticket-content')
    const printWindow = window.open('', '', 'width=400,height=600')
    printWindow.document.write(`
      <html>
        <head>
          <title>Boleta de Pago - ${generatedQR.ticketId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
            .ticket { border: 2px dashed #333; padding: 20px; max-width: 300px; margin: 0 auto; }
            h2 { margin: 0 0 10px; }
            .qr-container { margin: 20px 0; }
            .info { text-align: left; margin: 15px 0; }
            .info p { margin: 5px 0; }
            .amount { font-size: 24px; font-weight: bold; color: #10b981; }
            .footer { font-size: 12px; color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const copyLink = () => {
    navigator.clipboard.writeText(generatedQR.url)
    toast.success('Link copiado al portapapeles')
  }

  const handleConfirmQRRecord = (record) => {
    // Convertir registro QR a pago registrado
    const player = players.find(p => p.name === record.playerName || p.phone === record.phone)
    const playerId = player ? player.id : null
    
    // Si no existe el jugador, crearlo
    let finalPlayerId = playerId
    if (!playerId && record.playerName) {
      const newPlayer = {
        id: Date.now(),
        name: record.playerName,
        phone: record.phone || '',
        email: record.email || '',
        registeredAt: new Date().toISOString()
      }
      setPlayers([...players, newPlayer])
      finalPlayerId = newPlayer.id
    }

    const tournament = tournaments.find(t => t.name === record.tournamentName)
    
    const newPayment = {
      id: Date.now(),
      type: 'entry',
      playerId: finalPlayerId,
      tournamentId: tournament?.id || null,
      amount: record.amount,
      date: record.date || new Date().toISOString().split('T')[0],
      status: 'completed',
      notes: `Registro desde QR - Ticket: ${record.ticketId}${record.teamName ? ` - Equipo: ${record.teamName}` : ''}${record.balnearioNumber ? ` - Balneario: ${record.balnearioNumber}` : ''}`,
      createdAt: record.submittedAt || new Date().toISOString(),
      source: 'qr',
      ticketId: record.ticketId
    }
    
    setPayments([...payments, newPayment])
    
    // Actualizar estado del registro
    setPaymentRecords(paymentRecords.map(r => 
      r.id === record.id ? { ...r, status: 'confirmed', confirmedAt: new Date().toISOString() } : r
    ))
    
    toast.success('Registro confirmado y convertido a pago')
    setSelectedRecord(null)
  }

  const handleRejectQRRecord = (recordId) => {
    setPaymentRecords(paymentRecords.map(r => 
      r.id === recordId ? { ...r, status: 'rejected', rejectedAt: new Date().toISOString() } : r
    ))
    toast.success('Registro rechazado')
    setSelectedRecord(null)
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Control de Pagos</h2>
        <div className="header-actions">
          <button className="btn-qr" onClick={() => { setShowQRGenerator(true); setGeneratedQR(null); setQRFormData({ tournamentId: '', amount: '', organizerName: '' }) }}>
            <QrCode size={20} />
            Generar Boleta QR
          </button>
          <button className="btn-secondary" onClick={() => { setShowQRRecords(true) }}>
            <Users size={20} />
            Registros QR ({paymentRecords.length})
          </button>
          <button className="btn-primary" onClick={() => { setShowForm(true); setEditingPayment(null); setFormData({ type: 'entry', playerId: '', tournamentId: '', amount: '', date: new Date().toISOString().split('T')[0], status: 'pending', notes: '' }) }}>
            <Plus size={20} />
            Registrar Pago
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDeleteAction}
        title="Eliminar Pago"
        message="¿Estás seguro de eliminar este pago? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-icon revenue">
            <DollarSign size={24} />
          </div>
          <div className="stat-card-content">
            <h3>Ingresos</h3>
            <p className="stat-value">${stats.totalRevenue.toLocaleString('es-AR')}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon expense">
            <Trophy size={24} />
          </div>
          <div className="stat-card-content">
            <h3>Premios</h3>
            <p className="stat-value">${stats.totalPrizes.toLocaleString('es-AR')}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon net">
            <DollarSign size={24} />
          </div>
          <div className="stat-card-content">
            <h3>Balance</h3>
            <p className="stat-value">${stats.net.toLocaleString('es-AR')}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon pending">
            <Calendar size={24} />
          </div>
          <div className="stat-card-content">
            <h3>Pendientes</h3>
            <p className="stat-value">{stats.pendingPayments}</p>
          </div>
        </div>
      </div>

      {/* Modal de Registros QR */}
      {showQRRecords && (
        <div className="modal-overlay" onClick={() => setShowQRRecords(false)}>
          <div className="modal qr-records-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowQRRecords(false)}>
              <X size={24} />
            </button>
            
            <h3><Users size={24} /> Registros de Pago desde QR</h3>
            <p className="modal-subtitle">Gestiona los registros de inscripción recibidos desde códigos QR</p>
            
            {paymentRecords.length === 0 ? (
              <div className="empty-state">
                <QrCode size={48} />
                <p>No hay registros de QR</p>
                <p className="empty-subtitle">Los registros aparecerán aquí cuando alguien complete el formulario desde un QR</p>
              </div>
            ) : (
              <div className="qr-records-list">
                {paymentRecords.map(record => (
                  <div key={record.id} className={`qr-record-card ${record.status === 'confirmed' ? 'confirmed' : record.status === 'rejected' ? 'rejected' : 'pending'}`}>
                    <div className="qr-record-header">
                      <div>
                        <h4>{record.playerName}</h4>
                        <span className="ticket-badge-small">#{record.ticketId?.slice(-8)}</span>
                        <span className={`status-badge status-${record.status === 'confirmed' ? 'completed' : record.status === 'rejected' ? 'cancelled' : 'pending'}`}>
                          {record.status === 'confirmed' && 'Confirmado'}
                          {record.status === 'rejected' && 'Rechazado'}
                          {record.status === 'pending_confirmation' && 'Pendiente'}
                        </span>
                      </div>
                      <div className="card-actions">
                        <button className="icon-btn" onClick={() => setSelectedRecord(record)}>
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="qr-record-body">
                      <div className="qr-record-info">
                        <p><strong>Torneo:</strong> {record.tournamentName}</p>
                        <p><strong>Equipo:</strong> {record.teamName || 'N/A'}</p>
                        <p><strong>Balneario:</strong> #{record.balnearioNumber || 'N/A'}</p>
                        <p><strong>Monto:</strong> ${record.amount?.toLocaleString('es-AR') || '0'}</p>
                        <p><strong>Método:</strong> {record.paymentMethod || 'N/A'}</p>
                        <p><strong>Teléfono:</strong> {record.phone || 'N/A'}</p>
                        <p><strong>Email:</strong> {record.email || 'N/A'}</p>
                        <p><strong>Fecha:</strong> {new Date(record.submittedAt).toLocaleString('es-AR')}</p>
                        {record.notes && <p><strong>Notas:</strong> {record.notes}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Detalle de Registro QR */}
      {selectedRecord && (
        <div className="modal-overlay" onClick={() => setSelectedRecord(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedRecord(null)}>
              <X size={24} />
            </button>
            
            <h3>Detalle del Registro</h3>
            
            <div className="record-detail">
              <div className="detail-section">
                <h4>Información del Jugador</h4>
                <p><strong>Nombre:</strong> {selectedRecord.playerName}</p>
                <p><strong>Teléfono:</strong> {selectedRecord.phone || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedRecord.email || 'N/A'}</p>
              </div>
              
              <div className="detail-section">
                <h4>Información del Torneo</h4>
                <p><strong>Torneo:</strong> {selectedRecord.tournamentName}</p>
                <p><strong>Equipo:</strong> {selectedRecord.teamName || 'N/A'}</p>
                <p><strong>Balneario:</strong> #{selectedRecord.balnearioNumber || 'N/A'}</p>
                <p><strong>Monto:</strong> ${selectedRecord.amount?.toLocaleString('es-AR') || '0'}</p>
              </div>
              
              <div className="detail-section">
                <h4>Método de Pago</h4>
                <p><strong>Método:</strong> {selectedRecord.paymentMethod || 'N/A'}</p>
                {selectedRecord.notes && <p><strong>Notas:</strong> {selectedRecord.notes}</p>}
              </div>
              
              <div className="detail-section">
                <h4>Información del Ticket</h4>
                <p><strong>Ticket ID:</strong> {selectedRecord.ticketId}</p>
                <p><strong>Fecha de registro:</strong> {new Date(selectedRecord.submittedAt).toLocaleString('es-AR')}</p>
                <p><strong>Estado:</strong> 
                  <span className={`status-badge status-${selectedRecord.status === 'confirmed' ? 'completed' : selectedRecord.status === 'rejected' ? 'cancelled' : 'pending'}`}>
                    {selectedRecord.status === 'confirmed' && 'Confirmado'}
                    {selectedRecord.status === 'rejected' && 'Rechazado'}
                    {selectedRecord.status === 'pending_confirmation' && 'Pendiente'}
                  </span>
                </p>
              </div>
            </div>
            
            {selectedRecord.status === 'pending_confirmation' && (
              <div className="form-actions">
                <button className="btn-secondary" onClick={() => handleRejectQRRecord(selectedRecord.id)}>
                  Rechazar
                </button>
                <button className="btn-primary" onClick={() => handleConfirmQRRecord(selectedRecord)}>
                  <CheckCircle size={20} />
                  Confirmar y Convertir a Pago
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Generador de QR */}
      {showQRGenerator && (
        <div className="modal-overlay" onClick={() => setShowQRGenerator(false)}>
          <div className="modal qr-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowQRGenerator(false)}>
              <X size={24} />
            </button>
            
            {!generatedQR ? (
              <>
                <h3><QrCode size={24} /> Generar Boleta de Pago QR</h3>
                <p className="modal-subtitle">Crea un código QR para que los jugadores se inscriban y paguen</p>
                
                <form onSubmit={generatePaymentQR}>
                  <div className="form-group">
                    <label>Torneo *</label>
                    <select
                      required
                      value={qrFormData.tournamentId}
                      onChange={(e) => {
                        const tournament = tournaments.find(t => t.id === parseInt(e.target.value))
                        setQRFormData({ 
                          ...qrFormData, 
                          tournamentId: e.target.value,
                          amount: tournament?.entryFee?.toString() || ''
                        })
                      }}
                    >
                      <option value="">Seleccionar torneo...</option>
                      {tournaments.map(t => (
                        <option key={t.id} value={t.id}>{t.name} - Entrada: ${t.entryFee}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Monto de Entrada ($) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      value={qrFormData.amount}
                      onChange={(e) => setQRFormData({ ...qrFormData, amount: e.target.value })}
                      placeholder="1000"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Nombre del Organizador *</label>
                    <input
                      type="text"
                      required
                      value={qrFormData.organizerName}
                      onChange={(e) => setQRFormData({ ...qrFormData, organizerName: e.target.value })}
                      placeholder="Tu nombre o nombre de la organización"
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      <QrCode size={20} />
                      Generar QR
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h3><QrCode size={24} /> Boleta de Pago Generada</h3>
                
                <div id="qr-ticket-content" className="qr-ticket">
                  <div className="qr-ticket-header">
                    <Trophy size={32} />
                    <h4>Torneo de Truco</h4>
                    <p className="ticket-id">#{generatedQR.ticketId}</p>
                  </div>
                  
                  <div className="qr-code-container">
                    <QRCodeSVG
                      id="payment-qr-code"
                      value={generatedQR.url}
                      size={200}
                      level="H"
                      includeMargin={true}
                      bgColor="#ffffff"
                      fgColor="#1a1a2e"
                    />
                  </div>
                  
                  <div className="qr-ticket-info">
                    <div className="info-row">
                      <span>Torneo:</span>
                      <strong>{generatedQR.tournamentName}</strong>
                    </div>
                    <div className="info-row">
                      <span>Entrada:</span>
                      <strong className="amount">${generatedQR.amount.toLocaleString('es-AR')}</strong>
                    </div>
                    <div className="info-row">
                      <span>Organizador:</span>
                      <strong>{generatedQR.organizerName}</strong>
                    </div>
                  </div>
                  
                  <p className="qr-instructions">
                    Escanea el código QR para inscribirte y pagar
                  </p>
                </div>
                
                <div className="qr-actions">
                  <button className="btn-action" onClick={downloadQR}>
                    <Download size={18} />
                    Descargar
                  </button>
                  <button className="btn-action" onClick={printQR}>
                    <Printer size={18} />
                    Imprimir
                  </button>
                  <button className="btn-action" onClick={copyLink}>
                    <Share2 size={18} />
                    Copiar Link
                  </button>
                </div>
                
                <div className="qr-url">
                  <label>Link de pago:</label>
                  <input type="text" readOnly value={generatedQR.url} onClick={(e) => e.target.select()} />
                </div>
                
                <button className="btn-secondary" onClick={() => setGeneratedQR(null)}>
                  Generar Otro QR
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => { setShowForm(false); setEditingPayment(null) }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingPayment ? 'Editar Pago' : 'Registrar Pago'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tipo de Pago *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="entry">Entrada a Torneo</option>
                  <option value="prize">Premio</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Jugador *</label>
                <select
                  required
                  value={formData.playerId}
                  onChange={(e) => setFormData({ ...formData, playerId: e.target.value })}
                >
                  <option value="">Seleccionar jugador...</option>
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              {formData.type === 'entry' && (
                <div className="form-group">
                  <label>Torneo *</label>
                  <select
                    required
                    value={formData.tournamentId}
                    onChange={(e) => setFormData({ ...formData, tournamentId: e.target.value })}
                  >
                    <option value="">Seleccionar torneo...</option>
                    {tournaments.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label>Monto ($) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="1000"
                  />
                </div>
                <div className="form-group">
                  <label>Estado *</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notas adicionales..."
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingPayment ? 'Actualizar' : 'Registrar'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditingPayment(null) }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="payments-list">
        {payments.length === 0 ? (
          <div className="empty-state">
            <DollarSign size={48} />
            <p>No hay pagos registrados</p>
            <p className="empty-subtitle">Registra un pago para comenzar</p>
          </div>
        ) : (
          payments.map(payment => (
            <div key={payment.id} className="payment-card">
              <div className="payment-header">
                <div>
                  <h3>{getPlayerName(payment.playerId)}</h3>
                  <span className={`payment-type payment-type-${payment.type}`}>
                    {payment.type === 'entry' && 'Entrada'}
                    {payment.type === 'prize' && 'Premio'}
                    {payment.type === 'other' && 'Otro'}
                  </span>
                  <span className={`status-badge status-${payment.status}`}>
                    {payment.status === 'pending' && 'Pendiente'}
                    {payment.status === 'completed' && 'Completado'}
                    {payment.status === 'cancelled' && 'Cancelado'}
                  </span>
                </div>
                <div className="card-actions">
                  <button className="icon-btn" onClick={() => handleEdit(payment)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="icon-btn danger" onClick={() => handleDelete(payment.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="payment-body">
                <div className="payment-amount">
                  <span className={payment.type === 'prize' ? 'expense' : 'revenue'}>
                    {payment.type === 'prize' ? '-' : '+'}${payment.amount.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="payment-details">
                  {payment.tournamentId && (
                    <p><strong>Torneo:</strong> {getTournamentName(payment.tournamentId)}</p>
                  )}
                  <p><strong>Fecha:</strong> {new Date(payment.date).toLocaleDateString('es-AR')}</p>
                  {payment.notes && <p><strong>Notas:</strong> {payment.notes}</p>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Componente Dashboard
function DashboardTab({ players, tournaments, matches, payments, paymentRecords, exportAllData, importData, toast }) {
  const [showImportDialog, setShowImportDialog] = useState(false)

  const handleFileImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const data = await importFromJSON(file)
      if (window.confirm('¿Estás seguro de importar estos datos? Se sobrescribirán los datos actuales.')) {
        importData(data)
        setShowImportDialog(false)
      }
    } catch (error) {
      toast.error('Error al importar el archivo: ' + error.message)
    }
    e.target.value = ''
  }

  const stats = {
    totalPlayers: players.length,
    totalTournaments: tournaments.length,
    activeTournaments: tournaments.filter(t => t.status === 'active').length,
    totalMatches: matches.length,
    completedMatches: matches.filter(m => m.status === 'completed').length,
    totalRevenue: payments.filter(p => p.type === 'entry' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    totalPrizes: payments.filter(p => p.type === 'prize' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    pendingQRRecords: paymentRecords.filter(r => r.status === 'pending_confirmation').length
  }

  const recentTournaments = tournaments
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 5)

  const recentMatches = matches
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 5)

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Dashboard</h2>
        <div className="header-actions">
          <button className="btn-secondary" onClick={exportAllData}>
            <FileDown size={20} />
            Exportar Todo
          </button>
          <label className="btn-secondary" style={{ cursor: 'pointer' }}>
            <FileUp size={20} />
            Importar
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-stat-card">
          <div className="stat-card-icon revenue">
            <Users size={24} />
          </div>
          <div className="stat-card-content">
            <h3>Jugadores</h3>
            <p className="stat-value">{stats.totalPlayers}</p>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-card-icon net">
            <Trophy size={24} />
          </div>
          <div className="stat-card-content">
            <h3>Torneos</h3>
            <p className="stat-value">{stats.totalTournaments}</p>
            <p className="stat-subtitle">{stats.activeTournaments} activos</p>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-card-icon pending">
            <Calendar size={24} />
          </div>
          <div className="stat-card-content">
            <h3>Partidas</h3>
            <p className="stat-value">{stats.completedMatches}/{stats.totalMatches}</p>
            <p className="stat-subtitle">completadas</p>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-card-icon revenue">
            <DollarSign size={24} />
          </div>
          <div className="stat-card-content">
            <h3>Ingresos</h3>
            <p className="stat-value">${stats.totalRevenue.toLocaleString('es-AR')}</p>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-card-icon expense">
            <Trophy size={24} />
          </div>
          <div className="stat-card-content">
            <h3>Premios</h3>
            <p className="stat-value">${stats.totalPrizes.toLocaleString('es-AR')}</p>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-card-icon net">
            <DollarSign size={24} />
          </div>
          <div className="stat-card-content">
            <h3>Balance</h3>
            <p className="stat-value">${(stats.totalRevenue - stats.totalPrizes).toLocaleString('es-AR')}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3>Torneos Recientes</h3>
          {recentTournaments.length === 0 ? (
            <div className="empty-state-small">
              <p>No hay torneos registrados</p>
            </div>
          ) : (
            <div className="dashboard-list">
              {recentTournaments.map(tournament => (
                <div key={tournament.id} className="dashboard-item">
                  <div>
                    <h4>{tournament.name}</h4>
                    <p>{new Date(tournament.date).toLocaleDateString('es-AR')} - {tournament.participants.length} participantes</p>
                  </div>
                  <span className={`status-badge status-${tournament.status}`}>
                    {tournament.status === 'planned' && 'Planificado'}
                    {tournament.status === 'active' && 'En Curso'}
                    {tournament.status === 'completed' && 'Completado'}
                    {tournament.status === 'cancelled' && 'Cancelado'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h3>Partidas Recientes</h3>
          {recentMatches.length === 0 ? (
            <div className="empty-state-small">
              <p>No hay partidas registradas</p>
            </div>
          ) : (
            <div className="dashboard-list">
              {recentMatches.map(match => {
                const player1 = players.find(p => p.id === match.player1Id)
                const player2 = players.find(p => p.id === match.player2Id)
                return (
                  <div key={match.id} className="dashboard-item">
                    <div>
                      <h4>{player1?.name || 'Jugador 1'} vs {player2?.name || 'Jugador 2'}</h4>
                      <p>{match.player1Score !== null ? match.player1Score : '-'} - {match.player2Score !== null ? match.player2Score : '-'}</p>
                    </div>
                    <span className={`status-badge status-${match.status}`}>
                      {match.status === 'scheduled' && 'Programada'}
                      {match.status === 'in-progress' && 'En Curso'}
                      {match.status === 'completed' && 'Completada'}
                      {match.status === 'cancelled' && 'Cancelada'}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {stats.pendingPayments > 0 || stats.pendingQRRecords > 0 ? (
        <div className="dashboard-alerts">
          <h3>Alertas</h3>
          {stats.pendingPayments > 0 && (
            <div className="alert-item">
              <DollarSign size={20} />
              <span>{stats.pendingPayments} pagos pendientes</span>
            </div>
          )}
          {stats.pendingQRRecords > 0 && (
            <div className="alert-item">
              <QrCode size={20} />
              <span>{stats.pendingQRRecords} registros QR pendientes</span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default App

