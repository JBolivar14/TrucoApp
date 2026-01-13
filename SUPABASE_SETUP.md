# Guía de Configuración de Supabase

Esta guía te ayudará a configurar Supabase para la aplicación de Torneo de Truco.

## Paso 1: Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Completa el formulario:
   - **Name**: `truco-tournament` (o el nombre que prefieras)
   - **Database Password**: Elige una contraseña segura (guárdala)
   - **Region**: Selecciona la región más cercana (ej: South America para Argentina)
   - **Pricing Plan**: Free tier es suficiente para empezar
5. Espera a que se cree el proyecto (2-3 minutos)

## Paso 2: Obtener Credenciales

1. En el dashboard de Supabase, ve a **Settings** → **API**
2. Copia las siguientes credenciales:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`
   - **service_role key**: `eyJhbGc...` (mantén esto secreto)

## Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

⚠️ **IMPORTANTE**: No subas el archivo `.env` a GitHub. Ya está en `.gitignore`

## Paso 4: Ejecutar Scripts SQL en Supabase

Ve a **SQL Editor** en el dashboard de Supabase y ejecuta los scripts en `supabase/migrations/001_initial_schema.sql`

## Paso 5: Configurar Autenticación

1. Ve a **Authentication** → **Providers**
2. Habilita **Email** provider (ya está habilitado por defecto)
3. Opcional: Configura otros proveedores (Google, GitHub, etc.)
4. En **URL Configuration**, configura:
   - **Site URL**: `http://localhost:5173` (desarrollo)
   - **Redirect URLs**: `http://localhost:5173/**`

## Paso 6: Configurar Políticas de Seguridad (RLS)

Las políticas RLS (Row Level Security) están incluidas en el script SQL. Se configuran automáticamente.

## Paso 7: Verificar Configuración

1. Ejecuta `npm install` en el proyecto
2. Ejecuta `npm run dev`
3. Intenta crear una cuenta desde la aplicación
4. Verifica en Supabase que el usuario se haya creado en la tabla `profiles`

## Estructura de Base de Datos

### Tablas Principales:

1. **profiles** - Información de usuarios
2. **tournaments** - Torneos creados
3. **players** - Jugadores registrados
4. **matches** - Partidas jugadas
5. **payments** - Pagos registrados
6. **payment_records** - Registros desde códigos QR
7. **transactions** - Transacciones financieras (para control contable)

### Relaciones:

- `profiles` → `tournaments` (un usuario crea muchos torneos)
- `tournaments` → `players` (muchos a muchos a través de tournament_players)
- `tournaments` → `matches` (un torneo tiene muchas partidas)
- `tournaments` → `payments` (un torneo tiene muchos pagos)
- `payments` → `transactions` (cada pago genera una transacción)

## Próximos Pasos

1. Ejecutar los scripts SQL proporcionados
2. Configurar las variables de entorno
3. Probar el login/registro
4. Migrar datos existentes (si los hay)

## Solución de Problemas

### Error: "Invalid API key"
- Verifica que las variables de entorno estén correctas
- Reinicia el servidor de desarrollo

### Error: "Email already registered"
- El usuario ya existe, intenta iniciar sesión

### Error: "Policy violation"
- Verifica que las políticas RLS estén configuradas correctamente
- Revisa que el usuario esté autenticado

### Los datos no se guardan
- Verifica la conexión a Supabase
- Revisa la consola del navegador para errores
- Verifica que las políticas RLS permitan las operaciones
