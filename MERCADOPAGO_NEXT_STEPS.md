# Siguientes Pasos para Integrar Mercado Pago Checkout Pro

Esta guía te llevará paso a paso para integrar Mercado Pago Checkout Pro en tu aplicación TrucoApp.

## 📋 Checklist de Requisitos Previos

Antes de comenzar, asegúrate de tener:

- [x] ✅ Aplicación creada en Mercado Pago (ya lo hiciste)
- [ ] ⏳ Access Token de prueba (obtenerlo del panel de Mercado Pago)
- [x] ✅ SDK de Mercado Pago instalado (`mercadopago` ya está en package.json)
- [x] ✅ Aplicación desplegada en Vercel (https://trucoapp.vercel.app)

---

## 🎯 Paso 1: Obtener Credenciales de Prueba

1. **Ve al Panel de Desarrolladores de Mercado Pago**
   - URL: https://www.mercadopago.com.ar/developers/panel
   - Inicia sesión con tu cuenta

2. **Selecciona tu aplicación "TrucoApp"**

3. **Ve a "Credenciales de prueba"**
   - En el menú lateral: "Pruebas" → "Credenciales de prueba"
   - O busca directamente "Credenciales de prueba"

4. **Copia tu Access Token**
   - Busca el campo **"Access Token"**
   - Debe comenzar con `TEST-...`
   - **¡IMPORTANTE!** Guarda este token de forma segura

   Ejemplo:
   ```
   TEST-1234567890123456789012345678901234567890-123456-1234567890123456789012345678901234567890-123456
   ```

5. **Anota tu Public Key (opcional para Checkout Pro)**
   - Comienza con `TEST-...`
   - Solo la necesitas si usarás Checkout Bricks (no es tu caso)

---

## 🔐 Paso 2: Configurar Variables de Entorno

### 2.1 En Vercel (Producción)

1. **Ve a tu proyecto en Vercel**
   - URL: https://vercel.com/dashboard
   - Selecciona tu proyecto "TrucoApp"

2. **Ve a Settings → Environment Variables**

3. **Agrega la variable de entorno:**
   - **Nombre**: `MERCADOPAGO_ACCESS_TOKEN`
   - **Valor**: Tu Access Token de prueba (el que copiaste)
   - **Environment**: Selecciona "Production", "Preview", y "Development"

4. **Guarda los cambios**

⚠️ **IMPORTANTE**: El Access Token NUNCA debe estar en el código frontend. Solo en variables de entorno del backend.

### 2.2 En Local (Opcional - para desarrollo local)

Si quieres probar localmente, crea un archivo `.env.local` en la raíz del proyecto:

```env
MERCADOPAGO_ACCESS_TOKEN=TEST-tu-access-token-aqui
```

⚠️ **No commitees este archivo** - agrégalo a `.gitignore`

---

## 🏗️ Paso 3: Crear API Route para Crear Preferencias

Vercel usa funciones serverless en la carpeta `/api`. Vamos a crear una API route para crear preferencias de pago.

### 3.1 Crear la estructura de carpetas

```
TrucoApp/
  ├── api/
  │   └── create-preference.js  ← Nuevo archivo
  ├── src/
  └── ...
```

### 3.2 Crear el archivo de API

Crea el archivo `api/create-preference.js` con el siguiente código:

```javascript
import mercadopago from 'mercadopago';

export default async function handler(req, res) {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Configurar credenciales
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
    });

    // Obtener datos del pago del body
    const {
      tournamentName,
      amount,
      playerName,
      email,
      phone,
      ticketId,
      tournamentId,
      playerId,
      baseUrl
    } = req.body;

    // Validar datos requeridos
    if (!tournamentName || !amount || !playerName || !email) {
      return res.status(400).json({
        error: 'Faltan datos requeridos: tournamentName, amount, playerName, email'
      });
    }

    // Preparar teléfono (extraer código de área y número)
    const phoneNumber = phone || '';
    const areaCode = phoneNumber.substring(0, 2) || '11';
    const number = phoneNumber.substring(2) || '';

    // Crear preferencia de pago
    const preference = {
      items: [
        {
          title: tournamentName,
          quantity: 1,
          unit_price: parseFloat(amount),
          currency_id: 'ARS'
        }
      ],
      payer: {
        name: playerName,
        email: email,
        phone: {
          area_code: areaCode,
          number: number
        }
      },
      back_urls: {
        success: `${baseUrl || 'https://trucoapp.vercel.app'}/pago/exitoso?ticketId=${ticketId || ''}&tournamentId=${tournamentId || ''}&playerId=${playerId || ''}`,
        failure: `${baseUrl || 'https://trucoapp.vercel.app'}/pago/fallido?ticketId=${ticketId || ''}`,
        pending: `${baseUrl || 'https://trucoapp.vercel.app'}/pago/pendiente?ticketId=${ticketId || ''}`
      },
      auto_return: 'approved',
      external_reference: ticketId || `ticket-${Date.now()}`,
      statement_descriptor: 'TORNEO TRUCO',
      notification_url: `${baseUrl || 'https://trucoapp.vercel.app'}/api/webhook/mercadopago` // Para webhooks (opcional)
    };

    // Crear la preferencia en Mercado Pago
    const response = await mercadopago.preferences.create(preference);

    // Devolver la URL de pago (init_point)
    return res.status(200).json({
      init_point: response.body.init_point,
      preference_id: response.body.id
    });

  } catch (error) {
    console.error('Error al crear preferencia de Mercado Pago:', error);
    return res.status(500).json({
      error: 'Error al crear preferencia de pago',
      message: error.message
    });
  }
}
```

⚠️ **NOTA**: Este código usa el SDK de Node.js de Mercado Pago. Asegúrate de que `mercadopago` esté instalado (ya lo está en tu package.json).

---

## 🔧 Paso 4: Actualizar PaymentService

Ahora necesitamos actualizar `src/services/paymentService.js` para llamar a nuestra API.

El archivo debe quedar así:

```javascript
/**
 * Servicio para manejar integraciones de pagos
 * Integrado con Mercado Pago Checkout Pro
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

// ... (el resto del código queda igual)
```

---

## 📝 Paso 5: Integrar en PaymentForm

Necesitamos modificar `src/PaymentForm.jsx` para integrar Mercado Pago cuando el usuario seleccione ese método de pago.

### Cambios necesarios:

1. **Importar el servicio de pagos:**
   ```javascript
   import { initMercadoPagoPayment } from './services/paymentService'
   ```

2. **Modificar el handleSubmit para procesar pagos de Mercado Pago:**
   - Si el método es "mercadopago", crear la preferencia y redirigir
   - Si es otro método, guardar como antes

---

## 📄 Paso 6: Crear Páginas de Retorno

Necesitamos crear páginas para manejar las redirecciones de Mercado Pago:
- `/pago/exitoso` - Pago aprobado
- `/pago/fallido` - Pago rechazado
- `/pago/pendiente` - Pago pendiente

Estas páginas deben:
- Mostrar el estado del pago
- Actualizar el registro en la base de datos si es necesario
- Redirigir al usuario después de unos segundos

---

## 🧪 Paso 7: Probar la Integración

### 7.1 En Local (Opcional)

1. **Configura las variables de entorno** (crea `.env.local`)
2. **Ejecuta el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
3. **Prueba el flujo completo**

⚠️ **NOTA**: Las API routes de Vercel funcionan diferente en local. Para probar completamente, necesitas desplegar a Vercel.

### 7.2 En Vercel (Recomendado)

1. **Despliega los cambios a Vercel:**
   ```bash
   git add .
   git commit -m "feat: Integrar Mercado Pago Checkout Pro"
   git push origin main
   ```

2. **Espera a que Vercel despliegue automáticamente**

3. **Prueba el flujo completo:**
   - Ve a tu aplicación en Vercel
   - Completa un formulario de pago
   - Selecciona "Mercado Pago"
   - Deberías ser redirigido a Mercado Pago

4. **Prueba con tarjetas de prueba:**
   - Usa las tarjetas documentadas en `MERCADOPAGO_INTEGRATION.md`
   - Nombre del titular: "APRO" para pagos aprobados

---

## 📋 Resumen de Pasos

1. ✅ Obtener Access Token de Mercado Pago
2. ✅ Configurar variable de entorno en Vercel
3. ⏳ Crear API route (`/api/create-preference.js`)
4. ⏳ Actualizar `paymentService.js`
5. ⏳ Integrar en `PaymentForm.jsx`
6. ⏳ Crear páginas de retorno (success/failure/pending)
7. ⏳ Probar la integración

---

## 🚀 ¿Listo para Implementar?

¿Quieres que te ayude a implementar alguno de estos pasos? Puedo:

1. **Crear el archivo de API route** (`/api/create-preference.js`)
2. **Actualizar `paymentService.js`**
3. **Modificar `PaymentForm.jsx` para integrar Mercado Pago**
4. **Crear las páginas de retorno** (success/failure/pending)

¿Por cuál quieres empezar?

---

## 📚 Recursos Adicionales

- **Documentación Checkout Pro**: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro
- **API Reference**: https://www.mercadopago.com.ar/developers/es/reference
- **Tarjetas de Prueba**: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/test-cards
- **Guía de Integración**: Ver `MERCADOPAGO_INTEGRATION.md`

---

## ⚠️ Notas Importantes

1. **El Access Token NUNCA debe estar en el frontend**
   - Solo en variables de entorno del backend
   - Solo en la API route (`/api/create-preference.js`)

2. **Para desarrollo local**, las API routes de Vercel funcionan diferente
   - Puedes usar `vercel dev` para probar localmente
   - O probar directamente en Vercel (recomendado)

3. **Webhooks** (opcional pero recomendado)
   - Puedes configurar webhooks para recibir notificaciones de pagos
   - Esto asegura que los pagos se confirmen incluso si el usuario cierra el navegador

4. **Variables de entorno en Vercel**
   - Asegúrate de agregar la variable en todos los ambientes (Production, Preview, Development)
   - Vercel necesita reiniciar para aplicar cambios en variables de entorno
