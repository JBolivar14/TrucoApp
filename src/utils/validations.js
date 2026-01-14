/**
 * Utilidades de validación centralizadas
 */

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {Object} - { isValid: boolean, error?: string }
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'El email es requerido',
      code: 'EMAIL_REQUIRED'
    }
  }

  const trimmedEmail = email.trim()
  
  if (trimmedEmail.length === 0) {
    return {
      isValid: false,
      error: 'El email es requerido',
      code: 'EMAIL_REQUIRED'
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(trimmedEmail)) {
    return {
      isValid: false,
      error: 'El email no tiene un formato válido',
      code: 'EMAIL_INVALID_FORMAT'
    }
  }

  // Validación adicional: dominio válido
  const parts = trimmedEmail.split('@')
  if (parts.length !== 2 || parts[1].split('.').length < 2) {
    return {
      isValid: false,
      error: 'El email no tiene un formato válido',
      code: 'EMAIL_INVALID_FORMAT'
    }
  }

  return {
    isValid: true
  }
}

/**
 * Valida un teléfono argentino
 * Acepta formatos como:
 * - +54 9 11 1234-5678
 * - 54 9 11 1234-5678
 * - 011 1234-5678
 * - 11 1234-5678
 * - 1234-5678
 * @param {string} phone - Teléfono a validar
 * @returns {Object} - { isValid: boolean, error?: string, normalized?: string }
 */
export function validateArgentinePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return {
      isValid: false,
      error: 'El teléfono es requerido',
      code: 'PHONE_REQUIRED'
    }
  }

  const trimmedPhone = phone.trim()
  
  if (trimmedPhone.length === 0) {
    return {
      isValid: false,
      error: 'El teléfono es requerido',
      code: 'PHONE_REQUIRED'
    }
  }

  // Remover espacios, guiones, paréntesis y otros caracteres
  const cleaned = trimmedPhone.replace(/[\s\-\(\)]/g, '')
  
  // Validar que solo contenga números y opcionalmente el símbolo +
  if (!/^\+?[0-9]+$/.test(cleaned)) {
    return {
      isValid: false,
      error: 'El teléfono solo puede contener números',
      code: 'PHONE_INVALID_CHARACTERS'
    }
  }

  // Remover el + si está al inicio
  const numbersOnly = cleaned.replace(/^\+/, '')
  
  // Validar longitud mínima (al menos 8 dígitos para un número local)
  if (numbersOnly.length < 8) {
    return {
      isValid: false,
      error: 'El teléfono debe tener al menos 8 dígitos',
      code: 'PHONE_TOO_SHORT'
    }
  }

  // Validar longitud máxima (15 dígitos es el máximo internacional)
  if (numbersOnly.length > 15) {
    return {
      isValid: false,
      error: 'El teléfono no puede tener más de 15 dígitos',
      code: 'PHONE_TOO_LONG'
    }
  }

  // Validar formato argentino común
  // Formato esperado: +54 9 [área] [número]
  // O formato local: 0[área] [número] o [área] [número]
  const isArgentineFormat = (
    numbersOnly.startsWith('54') || // Formato internacional argentino
    numbersOnly.startsWith('0') ||  // Formato con 0 al inicio
    numbersOnly.length >= 8         // Formato local (al menos 8 dígitos)
  )

  if (!isArgentineFormat && numbersOnly.length < 10) {
    return {
      isValid: false,
      error: 'El formato del teléfono no es válido para Argentina',
      code: 'PHONE_INVALID_FORMAT'
    }
  }

  // Normalizar teléfono (agregar +54 si no tiene código de país)
  let normalized = trimmedPhone
  if (!numbersOnly.startsWith('54') && numbersOnly.length >= 10) {
    // Si tiene más de 10 dígitos y no empieza con 54, asumimos formato internacional sin +
    if (numbersOnly.startsWith('0')) {
      // Remover el 0 inicial y agregar +54
      normalized = `+54 ${numbersOnly.slice(1)}`
    }
  }

  return {
    isValid: true,
    normalized: normalized || trimmedPhone
  }
}

/**
 * Valida un teléfono de forma básica (sin formato específico)
 * @param {string} phone - Teléfono a validar
 * @param {number} minLength - Longitud mínima (default: 8)
 * @returns {Object} - { isValid: boolean, error?: string }
 */
export function validatePhone(phone, minLength = 8) {
  if (!phone || typeof phone !== 'string') {
    return {
      isValid: false,
      error: 'El teléfono es requerido',
      code: 'PHONE_REQUIRED'
    }
  }

  const trimmed = phone.trim()
  
  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'El teléfono es requerido',
      code: 'PHONE_REQUIRED'
    }
  }

  if (trimmed.length < minLength) {
    return {
      isValid: false,
      error: `El teléfono debe tener al menos ${minLength} dígitos`,
      code: 'PHONE_TOO_SHORT'
    }
  }

  return {
    isValid: true
  }
}
