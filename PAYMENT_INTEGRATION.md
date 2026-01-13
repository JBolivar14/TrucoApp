# Guía de Integración de Pagos

Este documento explica cómo integrar proveedores de pago reales en la aplicación de Torneo de Truco.

## Estructura Actual

La aplicación ya tiene preparada la estructura para integrar pagos. El servicio de pagos se encuentra en:
- `src/services/paymentService.js`

## Proveedores Soportados

La aplicación está preparada para integrar:
- **Mercado Pago** (Recomendado para Argentina)
- **PayPal**
- **Stripe**
- **Pagos Manuales** (Efectivo, Transferencia)

## Integración con Mercado Pago

### 1. Instalar el SDK

```bash
npm install mercadopago
```

### 2. Configurar Credenciales

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_MERCADOPAGO_PUBLIC_KEY=tu_public_key_aqui
VITE_MERCADOPAGO_ACCESS_TOKEN=tu_access_token_aqui
```

### 3. Actualizar el Servicio de Pagos

Edita `src/services/paymentService.js` y descomenta/actualiza la función `initMercadoPagoPayment`:

```javascript
import { MercadoPago } from 'mercadopago'

const mp = new MercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY)

export async function initMercadoPagoPayment(paymentData) {
  const preference = {
    items: [{
      title: paymentData.description || 'Inscripción al Torneo',
      quantity: 1,
      currency_id: 'ARS',
      unit_price: paymentData.amount
    }],
    back_urls: {
      success: `${window.location.origin}/pago-exitoso`,
      failure: `${window.location.origin}/pago-error`,
      pending: `${window.location.origin}/pago-pendiente`
    },
    auto_return: 'approved',
    notification_url: `${window.location.origin}/api/webhook/mercadopago`
  }
  
  const response = await mp.preferences.create(preference)
  return {
    paymentUrl: response.body.init_point,
    provider: PAYMENT_PROVIDERS.MERCADOPAGO,
    status: 'pending',
    preferenceId: response.body.id
  }
}
```

### 4. Integrar en el Formulario de Pago

En `src/PaymentForm.jsx`, cuando el usuario seleccione Mercado Pago, redirigir a la URL de pago:

```javascript
import { initMercadoPagoPayment } from '../services/paymentService'

const handleMercadoPagoPayment = async () => {
  const paymentData = {
    id: ticketId,
    amount: ticketData.amount,
    description: `Inscripción: ${ticketData.tournamentName}`
  }
  
  const result = await initMercadoPagoPayment(paymentData)
  window.location.href = result.paymentUrl
}
```

## Integración con PayPal

### 1. Instalar el SDK

```bash
npm install @paypal/react-paypal-js
```

### 2. Configurar Credenciales

```env
VITE_PAYPAL_CLIENT_ID=tu_client_id_aqui
```

### 3. Actualizar el Servicio

Similar a Mercado Pago, actualiza la función `initPayPalPayment` en `paymentService.js`.

## Webhooks y Notificaciones

Para recibir notificaciones de pagos completados, necesitarás:

1. **Backend API**: Un servidor que reciba las notificaciones
2. **Webhook Endpoints**: URLs que los proveedores llamarán cuando cambie el estado del pago

Ejemplo de estructura:
```
/api/webhook/mercadopago
/api/webhook/paypal
```

## Flujo de Pago Completo

1. Usuario completa el formulario de inscripción
2. Selecciona método de pago (Mercado Pago, PayPal, etc.)
3. Se redirige a la pasarela de pago
4. Usuario completa el pago
5. Webhook notifica el resultado
6. Se actualiza el estado en la base de datos
7. Usuario recibe confirmación

## Pruebas

### Mercado Pago Sandbox

Usa las credenciales de prueba de Mercado Pago:
- Tarjeta de prueba: 5031 7557 3453 0604
- CVV: 123
- Fecha: Cualquier fecha futura

### PayPal Sandbox

Usa la cuenta de sandbox de PayPal para pruebas.

## Seguridad

⚠️ **IMPORTANTE**: 
- Nunca expongas tus credenciales privadas en el frontend
- Usa variables de entorno para todas las credenciales
- Valida todos los pagos en el backend
- Implementa verificación de webhooks

## Próximos Pasos

1. Configurar variables de entorno
2. Implementar las funciones de pago reales
3. Crear endpoints de webhook
4. Agregar manejo de errores
5. Implementar reintentos para pagos fallidos
6. Agregar logs y monitoreo

## Recursos

- [Documentación de Mercado Pago](https://www.mercadopago.com.ar/developers/es/docs)
- [Documentación de PayPal](https://developer.paypal.com/docs/)
- [Documentación de Stripe](https://stripe.com/docs)

