import { supabase } from '../lib/supabase'

/**
 * Servicio para interactuar con la base de datos de Supabase
 */

// ============================================
// Torneos
// ============================================

export async function getTournaments() {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function createTournament(tournament) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  const { data, error } = await supabase
    .from('tournaments')
    .insert({
      user_id: user.id,
      name: tournament.name,
      entry_fee: tournament.entryFee,
      prize_pool: tournament.prizePool,
      date: tournament.date,
      status: tournament.status || 'planned'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTournament(id, updates) {
  const { data, error } = await supabase
    .from('tournaments')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTournament(id) {
  const { error } = await supabase
    .from('tournaments')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// Jugadores
// ============================================

export async function getPlayers() {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function createPlayer(player) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  const { data, error } = await supabase
    .from('players')
    .insert({
      user_id: user.id,
      name: player.name,
      phone: player.phone || null,
      email: player.email || null
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePlayer(id, updates) {
  const { data, error } = await supabase
    .from('players')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePlayer(id) {
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// Participantes de Torneos
// ============================================

export async function addTournamentPlayer(tournamentId, playerId) {
  const { data, error } = await supabase
    .from('tournament_players')
    .insert({
      tournament_id: tournamentId,
      player_id: playerId
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeTournamentPlayer(tournamentId, playerId) {
  const { error } = await supabase
    .from('tournament_players')
    .delete()
    .eq('tournament_id', tournamentId)
    .eq('player_id', playerId)

  if (error) throw error
}

export async function getTournamentPlayers(tournamentId) {
  const { data, error } = await supabase
    .from('tournament_players')
    .select('*, players(*)')
    .eq('tournament_id', tournamentId)
  
  if (error) throw error
  return data || []
}

// ============================================
// Partidas
// ============================================

export async function getMatches() {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function createMatch(match) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  const { data, error } = await supabase
    .from('matches')
    .insert({
      user_id: user.id,
      tournament_id: match.tournamentId,
      player1_id: match.player1Id,
      player2_id: match.player2Id,
      player1_score: match.player1Score || null,
      player2_score: match.player2Score || null,
      date: match.date,
      status: match.status || 'scheduled'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateMatch(id, updates) {
  const { data, error } = await supabase
    .from('matches')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteMatch(id) {
  const { error } = await supabase
    .from('matches')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// Pagos
// ============================================

export async function getPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function createPayment(payment) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  const { data, error } = await supabase
    .from('payments')
    .insert({
      user_id: user.id,
      type: payment.type,
      player_id: payment.playerId || null,
      tournament_id: payment.tournamentId || null,
      amount: payment.amount,
      date: payment.date,
      status: payment.status || 'pending',
      notes: payment.notes || null,
      source: payment.source || 'manual',
      ticket_id: payment.ticketId || null
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePayment(id, updates) {
  const { data, error } = await supabase
    .from('payments')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePayment(id) {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// Registros de Pago QR
// ============================================

export async function getPaymentRecords() {
  const { data, error } = await supabase
    .from('payment_records')
    .select('*')
    .order('submitted_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function createPaymentRecord(record) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  const { data, error } = await supabase
    .from('payment_records')
    .insert({
      user_id: user.id,
      ticket_id: record.ticketId,
      tournament_name: record.tournamentName,
      amount: record.amount,
      player_name: record.playerName,
      team_name: record.teamName || null,
      balneario_number: record.balnearioNumber || null,
      phone: record.phone || null,
      email: record.email || null,
      payment_method: record.paymentMethod || null,
      notes: record.notes || null,
      status: record.status || 'pending_confirmation'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePaymentRecord(id, updates) {
  const { data, error } = await supabase
    .from('payment_records')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================
// Transacciones Contables
// ============================================

export async function getTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function createTransaction(transaction) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      payment_id: transaction.paymentId || null,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description || null,
      date: transaction.date,
      payment_method: transaction.paymentMethod || null,
      reference: transaction.reference || null,
      status: transaction.status || 'pending'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTransaction(id, updates) {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTransaction(id) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)

  if (error) throw error
}
