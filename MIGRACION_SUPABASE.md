# Guía de Migración de localStorage a Supabase

Esta guía explica cómo migrar la aplicación de usar `localStorage` a usar Supabase como base de datos.

## ⚠️ Importante

**ANTES de hacer deploy a Vercel**, debemos migrar la aplicación para que use Supabase en lugar de localStorage.

## 🎯 Objetivo

Migrar `App.jsx` para que:
- ✅ Use los servicios de Supabase en lugar de localStorage
- ✅ Cargue datos desde Supabase al iniciar
- ✅ Guarde datos en Supabase en lugar de localStorage
- ✅ Funcione con autenticación de usuarios

## 📋 Estado Actual

Actualmente `App.jsx`:
- ❌ Usa `localStorage` para guardar datos
- ❌ No tiene autenticación
- ❌ Los datos son locales al navegador

Necesitamos que:
- ✅ Use Supabase para guardar datos
- ✅ Requiera autenticación
- ✅ Los datos sean por usuario

## 🔄 Proceso de Migración

### Paso 1: Revisar Servicios Disponibles

Ya tenemos:
- ✅ `src/services/databaseService.js` - Funciones para interactuar con Supabase
- ✅ `src/services/authService.js` - Funciones de autenticación
- ✅ `src/lib/supabase.js` - Cliente de Supabase

### Paso 2: Actualizar App.jsx

Necesitamos modificar `App.jsx` para:

1. **Cargar datos desde Supabase** en lugar de localStorage
2. **Guardar datos en Supabase** cuando cambien
3. **Usar el usuario autenticado** para filtrar datos
4. **Manejar estados de carga** mientras se cargan los datos

### Paso 3: Cambios Necesarios

#### 2.1 Reemplazar useEffect de localStorage

**Antes:**
```javascript
useEffect(() => {
  const savedPlayers = localStorage.getItem('trucoPlayers')
  if (savedPlayers) setPlayers(JSON.parse(savedPlayers))
}, [])
```

**Después:**
```javascript
useEffect(() => {
  loadData()
}, [])

async function loadData() {
  try {
    const playersData = await getPlayers()
    setPlayers(playersData)
    // ... cargar otros datos
  } catch (error) {
    console.error('Error loading data:', error)
  }
}
```

#### 2.2 Reemplazar guardado en localStorage

**Antes:**
```javascript
useEffect(() => {
  localStorage.setItem('trucoPlayers', JSON.stringify(players))
}, [players])
```

**Después:**
```javascript
// Ya no necesitamos useEffect, los datos se guardan directamente con las funciones
async function handleCreatePlayer(player) {
  try {
    const newPlayer = await createPlayer(player)
    setPlayers([...players, newPlayer])
  } catch (error) {
    console.error('Error creating player:', error)
  }
}
```

### Paso 4: Actualizar Funciones CRUD

Todas las funciones que crean/actualizan/eliminan deben usar los servicios de Supabase:

- `createPlayer()` → `databaseService.createPlayer()`
- `updatePlayer()` → `databaseService.updatePlayer()`
- `deletePlayer()` → `databaseService.deletePlayer()`
- Y así para todas las entidades...

### Paso 5: Manejar Estados de Carga

Agregar estados para:
- Loading mientras se cargan los datos
- Error si algo falla
- Empty state cuando no hay datos

### Paso 6: Migrar Datos Existentes (Opcional)

Si tienes datos en localStorage y quieres migrarlos:

1. Exporta los datos (ya tienes la función)
2. Crea un script de migración
3. Importa los datos usando los servicios de Supabase

## 📝 Ejemplo de Migración

### Componente de Jugadores

**Antes (localStorage):**
```javascript
const handleSubmit = (e) => {
  e.preventDefault()
  const newPlayer = {
    id: Date.now(),
    ...formData,
    registeredAt: new Date().toISOString()
  }
  setPlayers([...players, newPlayer])
  toast.success('Jugador agregado correctamente')
}
```

**Después (Supabase):**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const newPlayer = await createPlayer({
      name: formData.name,
      phone: formData.phone,
      email: formData.email
    })
    setPlayers([...players, newPlayer])
    toast.success('Jugador agregado correctamente')
  } catch (error) {
    toast.error('Error al agregar jugador: ' + error.message)
  }
}
```

## ⚠️ Consideraciones

### Diferencias entre localStorage y Supabase

1. **IDs**: Supabase usa UUIDs, localStorage usa timestamps
2. **Asíncrono**: Supabase es asíncrono, localStorage es síncrono
3. **Usuario**: Supabase filtra por usuario, localStorage es global
4. **Estructura**: La estructura de datos puede variar ligeramente

### Cambios en la Estructura

Algunos campos pueden tener nombres diferentes:
- `entryFee` → `entry_fee` (snake_case en DB)
- `prizePool` → `prize_pool`
- `playerId` → `player_id`
- etc.

Los servicios de `databaseService.js` ya manejan estas conversiones.

## 🚀 Próximos Pasos

1. ✅ Revisar los servicios disponibles
2. ✅ Actualizar App.jsx paso a paso
3. ✅ Probar cada funcionalidad
4. ✅ Migrar datos existentes (si los hay)
5. ✅ Hacer deploy a Vercel

## 📚 Recursos

- `src/services/databaseService.js` - Todas las funciones disponibles
- `src/services/authService.js` - Funciones de autenticación
- `CONFIGURACION_COMPLETA.md` - Configuración de Supabase

---

**Nota**: La migración puede hacerse gradualmente, función por función, probando cada una antes de continuar.
