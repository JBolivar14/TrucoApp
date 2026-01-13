/**
 * Servicio para manejar integraciones de pagos
 * Preparado para integrar Mercado Pago, PayPal, etc.
 */

// Configuración de proveedores de pago
export const PAYMENT_PROVIDERS = {
  MERCADOPAGO: 'mercadopago',
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
  MANUAL: 'manual'
}

/**
 * Inicializa un pago con Mercado Pago Checkout Pro
 * @param {Object} paymentData - Datos del pago
 * @returns {Promise<Object>} - URL de pago (init_point)
 */
export async function initMercadoPagoPayment(paymentData) {
  try {
    const baseUrl = window.location.origin;
    
    const response = await fetch('/api/create-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tournamentName: paymentData.tournamentName || paymentData.description,
        amount: paymentData.amount,
        playerName: paymentData.playerName,
        email: paymentData.email,
        phone: paymentData.phone,
        ticketId: paymentData.ticketId,
        tournamentId: paymentData.tournamentId,
        playerId: paymentData.playerId,
        baseUrl: baseUrl
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear preferencia de pago');
    }

    const data = await response.json();
    return {
      paymentUrl: data.init_point,
      preferenceId: data.preference_id,
      provider: PAYMENT_PROVIDERS.MERCADOPAGO,
      status: 'pending'
    };
  } catch (error) {
    console.error('Error al inicializar pago con Mercado Pago:', error);
    throw error;
  }
}

/**
 * Inicializa un pago con PayPal
 * @param {Object} paymentData - Datos del pago
 * @returns {Promise<Object>} - URL de pago
 */
export async function initPayPalPayment(paymentData) {
  // TODO: Integrar PayPal SDK
  // Por ahora retorna un mock
  return {
    paymentUrl: `https://paypal.com/checkout/${paymentData.id}`,
    provider: PAYMENT_PROVIDERS.PAYPAL,
    status: 'pending'
  }
}

/**
 * Verifica el estado de un pago
 * @param {string} paymentId - ID del pago
 * @param {string} provider - Proveedor de pago
 * @returns {Promise<Object>} - Estado del pago
 */
export async function checkPaymentStatus(paymentId, provider) {
  // TODO: Implementar verificación según el proveedor
  // Por ahora retorna un mock
  return {
    id: paymentId,
    status: 'completed',
    provider,
    verifiedAt: new Date().toISOString()
  }
}

/**
 * Procesa un pago manual (efectivo, transferencia, etc.)
 * @param {Object} paymentData - Datos del pago
 * @returns {Promise<Object>} - Confirmación del pago
 */
export async function processManualPayment(paymentData) {
  // Para pagos manuales, solo registramos la información
  return {
    id: paymentData.id,
    status: 'pending_confirmation',
    provider: PAYMENT_PROVIDERS.MANUAL,
    method: paymentData.method,
    createdAt: new Date().toISOString()
  }
}

/**
 * Obtiene la configuración de pagos disponibles
 * @returns {Object} - Configuración de pagos
 */
export function getPaymentConfig() {
  return {
    enabledProviders: [
      PAYMENT_PROVIDERS.MERCADOPAGO,
      PAYMENT_PROVIDERS.PAYPAL,
      PAYMENT_PROVIDERS.MANUAL
    ],
    defaultCurrency: 'ARS',
    supportedCurrencies: ['ARS', 'USD'],
    minAmount: 100,
    maxAmount: 100000
  }
}

/**
 * Valida los datos de un pago antes de procesarlo
 * @param {Object} paymentData - Datos del pago a validar
 * @returns {Object} - Resultado de la validación
 */
export function validatePaymentData(paymentData) {
  const errors = []
  
  if (!paymentData.amount || paymentData.amount <= 0) {
    errors.push('El monto debe ser mayor a 0')
  }
  
  if (!paymentData.description) {
    errors.push('Se requiere una descripción del pago')
  }
  
  if (!paymentData.provider) {
    errors.push('Se debe seleccionar un método de pago')
  }
  
  const config = getPaymentConfig()
  if (paymentData.amount < config.minAmount) {
    errors.push(`El monto mínimo es $${config.minAmount}`)
  }
  
  if (paymentData.amount > config.maxAmount) {
    errors.push(`El monto máximo es $${config.maxAmount}`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

