import { supabase } from '../lib/supabase'

/**
 * Servicio de autenticación
 */

/**
 * Registra un nuevo usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @param {string} fullName - Nombre completo
 * @returns {Promise<Object>}
 */
export async function signUp(email, password, fullName = '') {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Inicia sesión con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @returns {Promise<Object>}
 */
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Cierra sesión
 * @returns {Promise<Object>}
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error }
  }
}

/**
 * Obtiene el usuario actual
 * @returns {Promise<Object>}
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

/**
 * Obtiene el perfil del usuario actual
 * @returns {Promise<Object>}
 */
export async function getCurrentProfile() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) return { profile: null, error: null }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError

    return { profile, error: null }
  } catch (error) {
    return { profile: null, error }
  }
}

/**
 * Actualiza el perfil del usuario
 * @param {Object} updates - Campos a actualizar
 * @returns {Promise<Object>}
 */
export async function updateProfile(updates) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('No user found')

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Envía email de recuperación de contraseña
 * @param {string} email - Email del usuario
 * @returns {Promise<Object>}
 */
export async function resetPassword(email) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Escucha cambios en la sesión de autenticación
 * @param {Function} callback - Función a ejecutar cuando cambie la sesión
 * @returns {Function} Función para desuscribirse
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}

/**
 * Verifica si el usuario actual es administrador
 * @returns {Promise<boolean>}
 */
export async function isAdmin() {
  try {
    const { profile } = await getCurrentProfile()
    return profile?.role === 'admin'
  } catch (error) {
    return false
  }
}

/**
 * Obtiene el rol del usuario actual
 * @returns {Promise<string|null>}
 */
export async function getUserRole() {
  try {
    const { profile } = await getCurrentProfile()
    return profile?.role || 'player'
  } catch (error) {
    return null
  }
}

/**
 * Registra un nuevo usuario con rol específico
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @param {string} fullName - Nombre completo
 * @param {string} role - Rol del usuario ('admin' o 'player')
 * @returns {Promise<Object>}
 */
export async function signUpWithRole(email, password, fullName = '', role = 'player') {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role
        }
      }
    })

    if (error) throw error

    // Actualizar el perfil con el rol después de crear el usuario
    if (data.user) {
      await supabase
        .from('profiles')
        .update({ role: role })
        .eq('id', data.user.id)
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
