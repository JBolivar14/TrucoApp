# Guía de Configuración de Aplicación en Mercado Pago

Esta guía te ayudará a completar el formulario de configuración básica de tu aplicación en Mercado Pago para usar Checkout Pro.

## 📋 Configuración Básica - Paso a Paso

### 1. Logo (Opcional)

- **¿Qué poner?**: Puedes subir el logo de tu aplicación si tienes uno
- **Formato**: JPG o PNG, máximo 1MB
- **Recomendación**: Si no tienes logo, puedes dejarlo en blanco por ahora
- **Puedes cambiarlo después**: Sí, siempre puedes actualizar el logo más tarde

### 2. Nombre de la aplicación

- **Valor sugerido**: `TrucoApp` (ya lo tienes bien)
- **Límite**: 50 caracteres
- **Recomendación**: Usa un nombre descriptivo y fácil de recordar

### 3. Nombre corto

- **Valor sugerido**: `TrucoApp`
- **Importante**: Este es obligatorio (*)
- **Usos**: Se usa en identificadores internos y URLs
- **Límite**: Generalmente 20-30 caracteres
- **Recomendación**: Manténlo corto, sin espacios ni caracteres especiales

### 4. Descripción de la aplicación

- **Valor sugerido**: 
  ```
  Aplicación para gestión de torneos de Truco. Permite organizar torneos, 
  gestionar participantes, registrar pagos de inscripciones y administrar 
  partidas.
  ```
- **Límite**: 150 caracteres
- **Recomendación**: Describe brevemente qué hace tu aplicación

### 5. Industria

- **Opciones comunes**:
  - Entretenimiento / Eventos
  - Deportes / Recreación
  - Servicios
  - Otros
- **Recomendación para TrucoApp**: 
  - **Primera opción**: `Entretenimiento / Eventos`
  - **Segunda opción**: `Deportes / Recreación`
  - **Si no encuentras**: `Otros`

### 6. URL del sitio en producción

- **Valor sugerido**: `https://trucoapp.vercel.app`
- **Opcional**: Sí, pero recomendado
- **Formato**: Debe comenzar con `https://`
- **Importante**: Esta es la URL donde estará tu aplicación en producción

### 7. ¿Qué tipo de solución de pago vas a integrar?

- **Selecciona**: `Pagos online` ✅
- **¿Por qué?**: Checkout Pro es para pagos online (web)
- **Pagos presenciales**: No es necesario seleccionar si solo vas a usar online

### 8. ¿Estás usando una plataforma de e-commerce?

- **Selecciona**: `No` ✅
- **¿Por qué?**: Estás desarrollando una aplicación propia (no usas Shopify, WooCommerce, etc.)
- **Si usaras plataforma**: Seleccionarías "Sí" y elegirías la plataforma

### 9. ¿Qué producto estás integrando?

- **Selecciona**: `Checkout Pro` o `Checkout API`
- **Opción recomendada**: `Checkout Pro` (más simple)
- **Alternativa**: Si ves "Checkout API", también es válido (es el nombre técnico)

### 10. ¿Qué API estás integrando?

- **Selecciona**: `API Pagos` ✅
- **¿Por qué?**: Checkout Pro usa la API de Pagos de Mercado Pago
- **Otras opciones**: Generalmente no son necesarias para Checkout Pro

### 11. Modelo de integración (Opcional)

- **Para Checkout Pro**: Puedes dejarlo en blanco o seleccionar "Web" si hay opciones
- **Opciones comunes**:
  - Web
  - Mobile Web
  - API
- **Recomendación**: Si hay opción "Web", selecciónala. Si no, déjala en blanco.

---

## ⚙️ Configuraciones Avanzadas

### URLs de redireccionamiento

- **¿Qué poner?**: **DÉJALO VACÍO** (solo es para OAuth)
- **¿Por qué?**: Checkout Pro NO usa OAuth, usa el Access Token directamente
- **Importante**: Solo llena este campo si estás usando OAuth (que no es tu caso)

### ¿Utilizar el flujo de código de autorización con PKCE?

- **Selecciona**: `No` ✅
- **¿Por qué?**: Checkout Pro no usa este flujo, usa Access Token directo
- **PKCE**: Solo necesario para OAuth, que no necesitas para Checkout Pro

### Permisos de la aplicación

- **Default**: Mercado Pago generalmente asigna los permisos necesarios automáticamente
- **Para Checkout Pro**: Los permisos básicos son suficientes
- **No necesitas cambiar nada**: Déjalo como está por defecto

---

## ✅ Resumen de Valores Recomendados

| Campo | Valor Recomendado | Tipo |
|-------|------------------|------|
| **Logo** | (Opcional - puedes dejarlo en blanco) | Opcional |
| **Nombre de la aplicación** | `TrucoApp` | Obligatorio |
| **Nombre corto** | `TrucoApp` | Obligatorio |
| **Descripción** | `Aplicación para gestión de torneos de Truco` | Opcional |
| **Industria** | `Entretenimiento / Eventos` o `Otros` | Obligatorio |
| **URL de producción** | `https://trucoapp.vercel.app` | Opcional |
| **Tipo de pago** | `Pagos online` ✅ | Obligatorio |
| **Plataforma e-commerce** | `No` ✅ | Obligatorio |
| **Producto** | `Checkout Pro` o `Checkout API` | Obligatorio |
| **API** | `API Pagos` ✅ | Obligatorio |
| **Modelo de integración** | `Web` (si hay opción) o vacío | Opcional |
| **URLs de redireccionamiento** | **(VACÍO)** | Opcional |
| **PKCE** | `No` ✅ | Opcional |

---

## 🎯 Valores Específicos para tu Aplicación

Aquí tienes los valores exactos que puedes copiar y pegar:

### Nombre de la aplicación
```
TrucoApp
```

### Nombre corto
```
TrucoApp
```

### Descripción de la aplicación
```
Aplicación para gestión de torneos de Truco. Permite organizar torneos, gestionar participantes, registrar pagos de inscripciones y administrar partidas.
```

### URL del sitio en producción
```
https://trucoapp.vercel.app
```

---

## 📝 Pasos Siguientes Después de Crear la Aplicación

Una vez que completes el formulario y crees la aplicación:

1. **Ve a "Credenciales de prueba"**
   - En el menú lateral de tu aplicación
   - Busca "Pruebas" → "Credenciales de prueba"

2. **Copia tus credenciales**
   - **Public Key**: `TEST-...` (solo necesaria si usas Bricks, no para Checkout Pro)
   - **Access Token**: `TEST-...` (esta SÍ la necesitas para el backend)

3. **Configura las variables de entorno**
   - Guarda el Access Token en variables de entorno
   - **NUNCA** lo expongas en el frontend

4. **Prueba con tarjetas de prueba**
   - Usa las tarjetas documentadas en `MERCADOPAGO_INTEGRATION.md`
   - Nombre del titular: "APRO" para pagos aprobados

---

## ⚠️ Preguntas Frecuentes

### ¿Puedo cambiar estos valores después?
**Sí**, la mayoría de valores se pueden editar después, excepto algunos como el nombre corto que pueden tener restricciones.

### ¿Qué pasa si no sé qué industria elegir?
Elige "Otros" - es una opción válida y no afecta la funcionalidad.

### ¿Es importante la URL de producción?
Es opcional, pero recomendada. Si cambias de dominio después, puedes actualizarla.

### ¿Necesito configurar URLs de redireccionamiento?
**NO** para Checkout Pro. Solo si usaras OAuth (que no es tu caso).

### ¿Los permisos se configuran automáticamente?
**Sí**, Mercado Pago asigna los permisos necesarios para Checkout Pro automáticamente.

---

## 🔗 Referencias

- **Panel de Desarrolladores**: [https://www.mercadopago.com.ar/developers/panel](https://www.mercadopago.com.ar/developers/panel)
- **Documentación Checkout Pro**: [https://www.mercadopago.com.ar/developers/es/docs/checkout-pro](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro)

---

## ✅ Checklist de Configuración

Usa esta lista para verificar que completaste todo:

- [ ] Nombre de la aplicación completado
- [ ] Nombre corto completado
- [ ] Descripción completada (opcional pero recomendado)
- [ ] Industria seleccionada
- [ ] URL de producción configurada (opcional)
- [ ] Tipo de pago: "Pagos online" seleccionado
- [ ] Plataforma e-commerce: "No" seleccionado
- [ ] Producto: "Checkout Pro" o "Checkout API" seleccionado
- [ ] API: "API Pagos" seleccionado
- [ ] URLs de redireccionamiento: **DEJADO VACÍO**
- [ ] PKCE: "No" seleccionado
- [ ] Aplicación creada exitosamente
- [ ] Credenciales de prueba obtenidas

---

¿Necesitas ayuda con algún campo específico? Consulta la documentación oficial o pregunta en la comunidad de Mercado Pago.
