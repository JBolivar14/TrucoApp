# Guía Completa de Configuración - Supabase

Esta guía te llevará paso a paso para configurar Supabase en la aplicación de Torneo de Truco.

## 📋 Pasos Previos

1. Asegúrate de tener Node.js instalado (versión 16 o superior)
2. Tener una cuenta en Supabase (gratuita)

## 🔧 Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project" o "New Project"
3. Completa el formulario:
   - **Name**: `truco-tournament` (o el nombre que prefieras)
   - **Database Password**: Elige una contraseña segura ⚠️ **GUÁRDALA BIEN**
   - **Region**: Selecciona la más cercana (South America para Argentina)
   - **Pricing Plan**: Free tier es suficiente
4. Haz clic en "Create new project"
5. Espera 2-3 minutos a que se cree el proyecto

## 🔑 Paso 2: Obtener Credenciales

1. En el dashboard de Supabase, ve a **Settings** (⚙️) → **API**
2. En la sección **Project API keys**, copia:
   - **Project URL**: Algo como `https://xxxxx.supabase.co`
   - **anon public key**: Una clave larga que empieza con `eyJhbGc...`

## ⚙️ Paso 3: Configurar Variables de Entorno

1. En la raíz del proyecto, crea un archivo llamado `.env`
2. Agrega las siguientes variables:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

⚠️ **IMPORTANTE**: 
- Reemplaza `xxxxx` con tu Project URL real
- Reemplaza la clave con tu anon key real
- **NO** subas el archivo `.env` a GitHub (ya está en .gitignore)

## 📊 Paso 4: Crear Base de Datos

1. En el dashboard de Supabase, ve a **SQL Editor** (📝)
2. Haz clic en **New Query**
3. Abre el archivo `supabase/migrations/001_initial_schema.sql`
4. Copia TODO el contenido del archivo
5. Pégalo en el SQL Editor de Supabase
6. Haz clic en **Run** (o presiona Ctrl+Enter)
7. Espera a que termine la ejecución
8. Deberías ver un mensaje de éxito ✅

### ¿Qué se creó?

- ✅ 8 tablas principales
- ✅ Políticas de seguridad (RLS)
- ✅ Funciones y triggers
- ✅ Índices para mejorar rendimiento

## 🔐 Paso 5: Configurar Autenticación

1. Ve a **Authentication** → **Providers** en el dashboard
2. Asegúrate de que **Email** esté habilitado (ya viene por defecto)
3. Ve a **URL Configuration**:
   - **Site URL**: `http://localhost:5173` (para desarrollo)
   - **Redirect URLs**: Agrega `http://localhost:5173/**`

### Para Producción:
Cuando despliegues la aplicación, actualiza:
- **Site URL**: Tu dominio (ej: `https://tuapp.com`)
- **Redirect URLs**: `https://tuapp.com/**`

## 🧪 Paso 6: Probar la Configuración

1. Asegúrate de que el servidor de desarrollo esté corriendo:
   ```bash
   npm run dev
   ```

2. Abre tu navegador en `http://localhost:5173`
3. Deberías ver la página de login
4. Haz clic en "Registrarse"
5. Completa el formulario:
   - Nombre completo
   - Email
   - Contraseña (mínimo 6 caracteres)
6. Haz clic en "Crear Cuenta"
7. Verifica tu email (Supabase enviará un correo)
8. Vuelve a la aplicación e inicia sesión

## ✅ Paso 7: Verificar en Supabase

1. Ve a **Authentication** → **Users** en Supabase
2. Deberías ver tu usuario creado
3. Ve a **Table Editor** → **profiles**
4. Deberías ver tu perfil con la información que ingresaste

## 🎉 ¡Listo!

Tu aplicación ya está configurada con Supabase. Ahora puedes:

- ✅ Crear usuarios y autenticación
- ✅ Guardar datos en la base de datos
- ✅ Tener seguridad con RLS (Row Level Security)
- ✅ Escalar cuando lo necesites

## 🔄 Migración de Datos (Opcional)

Si ya tenías datos en localStorage y quieres migrarlos a Supabase:

1. Exporta tus datos desde la aplicación (opción "Exportar Todo")
2. Usa las funciones del servicio de base de datos para importarlos
3. O ejecuta scripts SQL personalizados

## 📚 Estructura de la Base de Datos

### Tablas Principales:

1. **profiles** - Perfiles de usuarios
2. **tournaments** - Torneos
3. **players** - Jugadores
4. **tournament_players** - Participantes de torneos
5. **matches** - Partidas
6. **payments** - Pagos
7. **payment_records** - Registros desde QR
8. **transactions** - Transacciones contables

### Relaciones:

- Cada usuario tiene sus propios torneos, jugadores, etc.
- Los datos están aislados por usuario (Row Level Security)
- Las relaciones están bien definidas con foreign keys

## 🛠️ Solución de Problemas

### Error: "Invalid API key"
- ✅ Verifica que `.env` tenga las credenciales correctas
- ✅ Reinicia el servidor de desarrollo
- ✅ Verifica que no haya espacios extra en las variables

### Error: "Email already registered"
- ✅ El usuario ya existe, intenta iniciar sesión
- ✅ O recupera tu contraseña

### Error: "Policy violation"
- ✅ Las políticas RLS están configuradas correctamente
- ✅ Asegúrate de estar autenticado
- ✅ Verifica que el usuario tenga permisos

### No se guardan los datos
- ✅ Verifica la conexión a Supabase
- ✅ Revisa la consola del navegador
- ✅ Verifica que las tablas se hayan creado correctamente

### No recibes el email de verificación
- ✅ Revisa la carpeta de spam
- ✅ En desarrollo, puedes verificar desde el dashboard de Supabase
- ✅ Verifica la configuración de email en Supabase

## 📞 Soporte

- Documentación de Supabase: [https://supabase.com/docs](https://supabase.com/docs)
- Discord de Supabase: [https://discord.supabase.com](https://discord.supabase.com)
