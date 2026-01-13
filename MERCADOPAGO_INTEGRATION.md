# Guía de Integración con Mercado Pago - Entorno de Pruebas

Esta guía te mostrará cómo integrar Mercado Pago en tu aplicación y cómo realizar pruebas en el entorno sandbox (pruebas).

## 📋 Tabla de Contenidos

1. [Registro y Configuración](#registro-y-configuración)
2. [Obtener Credenciales de Prueba](#obtener-credenciales-de-prueba)
3. [Tarjetas de Prueba](#tarjetas-de-prueba)
4. [Integración con React](#integración-con-react)
5. [Implementación en la Aplicación](#implementación-en-la-aplicación)
6. [Pruebas del Flujo Completo](#pruebas-del-flujo-completo)
7. [Recursos Adicionales](#recursos-adicionales)

---

## 🔐 Registro y Configuración

### Paso 1: Crear Cuenta en Mercado Pago

1. Ve a [https://www.mercadopago.com.ar/](https://www.mercadopago.com.ar/)
2. Haz clic en **"Crear cuenta"** o **"Registrarse"**
3. Completa el formulario con tus datos:
   - Email
   - Contraseña
   - Datos personales (DNI, nombre, teléfono)
   - Dirección

### Paso 2: Acceder al Panel de Desarrolladores

1. Una vez registrado, ve a: [https://www.mercadopago.com.ar/developers/panel](https://www.mercadopago.com.ar/developers/panel)
2. Inicia sesión con tu cuenta
3. En el panel, verás dos secciones:
   - **Producción**: Para pagos reales (requiere validación de identidad)
   - **Pruebas**: Para desarrollo y testing (NO requiere validación)

### Paso 3: Crear una Aplicación

1. En el panel de desarrolladores, haz clic en **"Crear aplicación"**
2. Completa los datos:
   - **Nombre de la aplicación**: "Truco Tournament App" (o el nombre que prefieras)
   - **Tipo de integración**: "API"
   - **Categoría**: "Otros"
   - **Plataforma**: "Web"
   - **URL de producción**: `https://trucoapp.vercel.app` (tu URL de Vercel)
   - **URL de desarrollo**: `http://localhost:5173` (tu URL local)
3. Haz clic en **"Crear aplicación"**

---

## 🔑 Obtener Credenciales de Prueba

### Credenciales de Prueba (Sandbox)

1. En el panel de desarrolladores, selecciona tu aplicación
2. Ve a la pestaña **"Credenciales de prueba"**
3. Aquí encontrarás:
   - **Public Key (Clave Pública)**: Comienza con `TEST-...`
   - **Access Token (Token de Acceso)**: Comienza con `TEST-...`

⚠️ **IMPORTANTE**: 
- Las credenciales de prueba solo funcionan en el entorno sandbox
- NO uses estas credenciales en producción
- Las credenciales de prueba son públicas y seguras para compartir en código

### Ejemplo de Credenciales de Prueba:

```
Public Key: TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Access Token: TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxx
```

---

## 💳 Tarjetas de Prueba

Mercado Pago proporciona tarjetas de prueba para simular diferentes escenarios. **IMPORTANTE**: El comportamiento del pago depende del **nombre del titular de la tarjeta**, no del número.

### Tarjetas de Prueba para Argentina

**Tarjetas de Crédito:**
- **Visa**: `4509 9535 6623 3704`
- **Mastercard**: `5031 7557 3453 0604`
- **American Express**: `3711 803032 57522`

**Tarjetas de Débito:**
- **Visa**: `4002 7686 9439 5619`
- **Mastercard**: `5287 3383 1025 3304`

**Datos comunes para todas:**
- CVV: `123`
- Fecha de vencimiento: `11/30` (o cualquier fecha futura)
- DNI: `12345678`

### Simular Estados de Pago con el Nombre del Titular

El comportamiento del pago se controla mediante el **nombre y apellido del titular**:

- **`APRO`**: Pago aprobado (ejemplo: "APRO" o "APRO APRO")
- **`OTHE`**: Rechazado por error general
- **`CONT`**: Pendiente de pago
- **`CALL`**: Rechazado con validación para autorizar
- **`FUND`**: Rechazado por importe insuficiente
- **`SECU`**: Rechazado por código de seguridad inválido
- **`EXPI`**: Rechazado por fecha de vencimiento
- **`FORM`**: Rechazado por error de formulario

**Ejemplo práctico:**
- Para aprobar: Usa cualquier tarjeta de arriba con nombre "APRO"
- Para rechazar: Usa cualquier tarjeta con nombre "OTHE"
- Para pendiente: Usa cualquier tarjeta con nombre "CONT"

### Cuentas de Prueba (Test Users)

Para crear cuentas de prueba (compradores):

1. Ve a: [https://www.mercadopago.com.ar/developers/panel/test-users](https://www.mercadopago.com.ar/developers/panel/test-users)
2. Haz clic en **"Crear usuario de prueba"**
3. Selecciona el país: **Argentina**
4. El sistema generará automáticamente un email de prueba (ej: `test_user_12345678@testuser.com`)
5. Puedes crear múltiples usuarios de prueba

**Importante**: 
- Los usuarios de prueba NO pueden recibir dinero real
- Sirven solo para simular compradores
- Puedes usar estos emails en tu aplicación de registro

---

## 💻 Integración Técnica

### Importante: Checkout Pro vs Checkout Bricks

**Checkout Pro** (Recomendado para empezar):
- Redirección a Mercado Pago
- NO necesita SDK de React en el frontend
- Solo necesitas el SDK de Node.js en el backend (o usar la API directamente)
- Más simple y seguro

**Checkout Bricks** (Integración avanzada):
- Integrado en tu sitio
- SÍ necesita `@mercadopago/sdk-react` en el frontend
- Más complejo de implementar

**Para esta aplicación, recomendamos Checkout Pro** ya que es más simple y seguro.

### Opción A: Checkout Pro (Recomendado)

#### Backend: Crear Preferencia

⚠️ **IMPORTANTE**: El Access Token debe usarse SOLO en el backend (nunca en el frontend).

Para Checkout Pro, tienes dos opciones:

**Opción 1: Usando el SDK de Node.js (recomendado)**

```bash
npm install mercadopago
```

**Opción 2: Usar la API directamente (sin SDK)**

Puedes hacer llamadas HTTP a la API de Mercado Pago.

#### Ejemplo de Backend (usando Supabase Edge Functions o un endpoint)

```javascript
// Ejemplo para Supabase Edge Function o backend API
const mercadopago = require('mercadopago');

// Configurar credenciales
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN // Desde variables de entorno
});

// Crear preferencia
export async function createPaymentPreference(paymentData) {
  try {
    const preference = {
      items: [
        {
          title: paymentData.tournamentName,
          quantity: 1,
          unit_price: paymentData.amount,
          currency_id: 'ARS',
        }
      ],
      payer: {
        name: paymentData.playerName,
        email: paymentData.email,
        phone: {
          area_code: paymentData.phone?.substring(0, 2) || '11',
          number: paymentData.phone?.substring(2) || ''
        }
      },
      back_urls: {
        success: `${paymentData.baseUrl}/pago/exitoso`,
        failure: `${paymentData.baseUrl}/pago/fallido`,
        pending: `${paymentData.baseUrl}/pago/pendiente`
      },
      auto_return: 'approved',
      notification_url: `${paymentData.baseUrl}/api/webhook/mercadopago`, // Para webhooks
      external_reference: paymentData.ticketId, // ID de tu ticket
      statement_descriptor: 'TORNEO TRUCO'
    };

    const response = await mercadopago.preferences.create(preference);
    return response.body;
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    throw error;
  }
}
```

#### Frontend: Redirigir a Mercado Pago

```javascript
// En tu componente React
async function handlePayment() {
  try {
    // Llamar a tu backend para crear la preferencia
    const response = await fetch('/api/create-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tournamentName: 'Torneo de Truco',
        amount: 1000,
        playerName: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '1123456789',
        ticketId: 'TRU-123456',
        baseUrl: window.location.origin
      })
    });
    
    const { init_point } = await response.json();
    
    // Redirigir a Mercado Pago
    window.location.href = init_point;
  } catch (error) {
    console.error('Error al procesar pago:', error);
  }
}
```

### Configurar Variables de Entorno

⚠️ **IMPORTANTE**: El Access Token debe estar SOLO en el backend.

**Backend (.env o variables de entorno en Supabase/Vercel):**
```env
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxx
```

**Frontend (solo si usas Checkout Bricks):**
```env
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## 🏗️ Flujo de Checkout Pro

### Diagrama del Flujo

```
1. Usuario completa formulario de pago
   ↓
2. Frontend envía datos al backend
   ↓
3. Backend crea preferencia en Mercado Pago
   ↓
4. Backend devuelve init_point (URL de pago)
   ↓
5. Frontend redirige a Mercado Pago (init_point)
   ↓
6. Usuario paga en Mercado Pago
   ↓
7. Mercado Pago redirige a back_urls (success/failure/pending)
   ↓
8. Backend verifica el pago (usando webhook o consultando API)
   ↓
9. Backend actualiza estado en base de datos
```

### Arquitectura Recomendada

Para una aplicación React con Supabase, tienes estas opciones:

**Opción 1: Supabase Edge Functions (Recomendado)**
- Crear una Edge Function que crea la preferencia
- Llamar desde el frontend
- Más seguro (credenciales en el backend)

**Opción 2: API Route en Vercel (Si usas Vercel)**
- Crear una API route en `/api/`
- Similar a Edge Functions

**Opción 3: Backend separado**
- Servidor Node.js dedicado
- Más control pero más complejo

**Nota importante**: Para Checkout Pro, el modal fue descontinuado en diciembre 2023. Solo usar redirección.

---

## 🧪 Pruebas del Flujo Completo

### Escenario 1: Pago Aprobado

1. Usuario completa el formulario de registro/pago
2. En Mercado Pago, usa una tarjeta de prueba:
   - **Cualquier tarjeta**: `4509 9535 6623 3704` (Visa) o `5031 7557 3453 0604` (Mastercard)
   - CVV: `123`
   - Fecha: `11/30`
   - **Nombre del titular**: `APRO` (¡IMPORTANTE! Esto hace que se apruebe)
   - DNI: `12345678`
3. El pago debería aprobarse inmediatamente
4. El usuario es redirigido a la página de éxito

### Escenario 2: Pago Rechazado

1. Usuario completa el formulario
2. En Mercado Pago, usa:
   - **Cualquier tarjeta**: `4509 9535 6623 3704` o `5031 7557 3453 0604`
   - CVV: `123`
   - Fecha: `11/30`
   - **Nombre del titular**: `OTHE` (esto hace que se rechace)
   - DNI: `12345678`
3. El pago debería rechazarse
4. El usuario es redirigido a la página de error

### Escenario 3: Pago Pendiente

1. Usuario completa el formulario
2. En Mercado Pago, usa:
   - **Cualquier tarjeta**: `4509 9535 6623 3704` o `5031 7557 3453 0604`
   - CVV: `123`
   - Fecha: `11/30`
   - **Nombre del titular**: `CONT` (esto hace que quede pendiente)
   - DNI: `12345678`
3. El pago queda pendiente
4. El usuario es redirigido a la página de pendiente

### Verificar Pagos en el Dashboard

1. Ve al panel de Mercado Pago: [https://www.mercadopago.com.ar/developers/panel](https://www.mercadopago.com.ar/developers/panel)
2. Selecciona tu aplicación
3. Ve a **"Actividad"** o **"Pagos"**
4. Verás todos los pagos de prueba realizados
5. Puedes ver detalles de cada pago (monto, estado, tarjeta usada, etc.)

---

## 🔒 Seguridad y Mejores Prácticas

### ✅ Hacer

- ✅ Usa siempre HTTPS en producción
- ✅ Guarda el Access Token SOLO en el backend (variables de entorno)
- ✅ Valida los pagos usando webhooks o consultando el estado después del redirect
- ✅ Usa el `external_reference` para asociar pagos con tus registros (ticketId)
- ✅ Verifica el estado del pago antes de considerarlo exitoso
- ✅ Implementa timeouts y manejo de errores
- ✅ Loggea eventos importantes (sin datos sensibles)
- ✅ Para Checkout Pro, usa solo redirección (el modal fue descontinuado)

### ❌ No Hacer

- ❌ NO expongas el Access Token en el frontend (nunca)
- ❌ NO confíes solo en los datos que vienen del redirect (verifica con API)
- ❌ NO uses credenciales de prueba (TEST-...) en producción
- ❌ NO almacenes datos de tarjetas en tu base de datos
- ❌ NO proceses pagos sin verificar el estado con la API
- ❌ NO uses el modal de Checkout Pro (fue descontinuado en 2023)

---

## 📚 Recursos Adicionales

### Documentación Oficial

- **Documentación Principal**: [https://www.mercadopago.com.ar/developers/es/docs](https://www.mercadopago.com.ar/developers/es/docs)
- **Checkout Pro**: [https://www.mercadopago.com.ar/developers/es/docs/checkout-pro](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro)
- **Checkout Bricks**: [https://www.mercadopago.com.ar/developers/es/docs/checkout-bricks](https://www.mercadopago.com.ar/developers/es/docs/checkout-bricks)
- **API Reference**: [https://www.mercadopago.com.ar/developers/es/reference](https://www.mercadopago.com.ar/developers/es/reference)

### Tarjetas de Prueba

- **Lista Completa**: [https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/test-cards](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/test-cards)

### SDKs y Librerías

- **Node.js SDK (Backend)**: [https://github.com/mercadopago/sdk-nodejs](https://github.com/mercadopago/sdk-nodejs)
  - Para Checkout Pro: `npm install mercadopago`
  - Usar solo en el backend
  
- **React SDK (Frontend - Solo para Bricks)**: [https://github.com/mercadopago/sdk-react](https://github.com/mercadopago/sdk-react)
  - Para Checkout Bricks: `npm install @mercadopago/sdk-react`
  - NO necesario para Checkout Pro

### Soporte

- **Comunidad**: [https://www.mercadopago.com.ar/developers/es/support](https://www.mercadopago.com.ar/developers/es/support)
- **FAQ**: [https://www.mercadopago.com.ar/developers/es/support/faqs](https://www.mercadopago.com.ar/developers/es/support/faqs)

### Noticias Importantes

- **Modal descontinuado**: El modal de Checkout Pro fue descontinuado en diciembre 2023. Solo usar redirección.
- **Actualización SDKs**: En abril 2024, Mercado Pago reestructuró la documentación de SDKs.

---

## 🚀 Pasos Siguientes para Implementar

1. **Crear cuenta en Mercado Pago** (si no la tienes)
2. **Obtener credenciales de prueba** del panel de desarrolladores
   - Public Key: `TEST-...` (solo necesaria si usas Bricks)
   - Access Token: `TEST-...` (necesaria en el backend)
3. **Configurar backend** (Supabase Edge Function o API Route)
   - Instalar: `npm install mercadopago`
   - Configurar Access Token en variables de entorno
   - Crear función para generar preferencias
4. **Implementar frontend**
   - Llamar al backend para crear preferencia
   - Redirigir a `init_point` recibido
5. **Crear páginas de retorno** (success/failure/pending)
6. **Probar con tarjetas de prueba** (usar nombre "APRO" para aprobar)
7. **Verificar pagos en el dashboard** de Mercado Pago
8. **Implementar webhooks** para recibir notificaciones (recomendado para producción)
9. **Probar el flujo completo** desde registro hasta confirmación
10. **Cuando esté listo**, cambiar a credenciales de producción (`APP_USR-...`)

---

## 📝 Notas Importantes

- **Sandbox vs Producción**: Asegúrate de estar usando credenciales de prueba durante el desarrollo
- **Webhooks**: En producción, configura webhooks para recibir notificaciones de pagos
- **Validación**: Siempre valida el estado del pago en tu backend antes de considerar un pago como exitoso
- **Rate Limits**: Mercado Pago tiene límites de requests por segundo, tenlo en cuenta
- **Monedas**: Asegúrate de usar la moneda correcta (`ARS` para Argentina)

---

¿Necesitas ayuda con algún paso específico? Revisa la documentación oficial o crea una pregunta en la comunidad de Mercado Pago.
