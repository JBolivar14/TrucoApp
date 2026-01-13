# Comandos para GitHub y Deploy

## 📦 Comandos Listos para Ejecutar

### Paso 1: Hacer Commit Inicial

Ya ejecuté `git add .`, ahora haz el commit:

```bash
git commit -m "Initial commit: Torneo de Truco app con Supabase y autenticación"
```

### Paso 2: Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com)
2. Haz clic en "New repository" (o el botón "+" arriba a la derecha)
3. Completa:
   - **Repository name**: `truco-tournament-app`
   - **Description**: (opcional) "Aplicación de gestión de torneos de Truco"
   - **Visibility**: Private (recomendado) o Public
   - ⚠️ **NO marques** "Initialize with README"
4. Haz clic en "Create repository"

### Paso 3: Conectar y Subir a GitHub

Después de crear el repositorio, GitHub te mostrará comandos. Ejecuta estos:

```bash
# Cambiar a rama main (si estás en master)
git branch -M main

# Agregar remote (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/truco-tournament-app.git

# Subir código
git push -u origin main
```

**Nota**: Necesitarás autenticarte en GitHub:
- Si usas HTTPS: Usuario y contraseña/token
- Si usas SSH: Configura tu clave SSH primero

### Paso 4: Configurar Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Sign Up"
3. Selecciona "Continue with GitHub"
4. Autoriza a Vercel a acceder a tu GitHub
5. En el dashboard, haz clic en "Add New..." → "Project"
6. En "Import Git Repository", busca y selecciona `truco-tournament-app`
7. Haz clic en "Import"

### Paso 5: Configurar Proyecto en Vercel

Vercel debería detectar automáticamente que es Vite:

- **Framework Preset**: Vite (debería estar automático)
- **Root Directory**: `./` (por defecto)
- **Build Command**: `npm run build` (por defecto)
- **Output Directory**: `dist` (por defecto)
- **Install Command**: `npm install` (por defecto)

### Paso 6: Variables de Entorno en Vercel

**ANTES de hacer Deploy**, haz clic en "Environment Variables" y agrega:

#### Variable 1:
- **Key**: `VITE_SUPABASE_URL`
- **Value**: Tu URL de Supabase (ej: `https://xxxxx.supabase.co`)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### Variable 2:
- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: Tu anon key de Supabase
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

Haz clic en "Save" para cada una.

### Paso 7: Deploy

1. Haz clic en "Deploy"
2. Espera 2-3 minutos
3. ¡Listo! Tu app estará disponible

### Paso 8: Configurar Supabase para Producción

1. Ve a tu proyecto en Supabase
2. Ve a **Authentication** → **URL Configuration**
3. Actualiza:
   - **Site URL**: La URL que te dio Vercel (ej: `https://tu-app.vercel.app`)
   - **Redirect URLs**: Agrega estas líneas (una por línea):
     ```
     https://tu-app.vercel.app/**
     https://*.vercel.app/**
     http://localhost:5173/**
     ```
4. Haz clic en "Save"

## ✅ Verificar

1. Ve a la URL de tu app en Vercel
2. Deberías ver la página de login
3. Prueba crear una cuenta (si ya migraste a Supabase)
4. Si no migraste, verás la app pero no funcionará completamente

## 🔄 Actualizaciones Futuras

Para actualizar la app:

```bash
# Hacer cambios
git add .
git commit -m "Descripción de los cambios"
git push
```

Vercel desplegará automáticamente en 2-3 minutos.

## 🆘 Si algo falla

### Error al hacer push
- Verifica que el repositorio existe en GitHub
- Verifica que la URL del remote sea correcta
- Verifica tu autenticación en GitHub

### Error en Vercel
- Revisa los logs en Vercel
- Verifica que el build funciona localmente (`npm run build`)
- Verifica las variables de entorno

### Error de autenticación
- Verifica las URLs en Supabase
- Verifica las variables de entorno en Vercel
- Revisa la consola del navegador

---

**¿Necesitas ayuda con algún paso específico?**
