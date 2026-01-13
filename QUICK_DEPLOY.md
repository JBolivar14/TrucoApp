# Guía Rápida de Deploy a Vercel

## 🚀 Pasos Rápidos (Asumiendo que ya migraste a Supabase)

### 1. GitHub - Crear Repositorio

1. Ve a [github.com](https://github.com) y crea un nuevo repositorio
2. Nombre: `truco-tournament-app` (o el que prefieras)
3. Private o Public (tu elección)
4. **NO** marques "Initialize with README"
5. Haz clic en "Create repository"

### 2. GitHub - Subir Código

Ejecuta estos comandos en tu terminal (en el directorio del proyecto):

```bash
# Si no hay git inicializado
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit: Torneo de Truco app"

# Cambiar a rama main
git branch -M main

# Agregar remote (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/truco-tournament-app.git

# Subir código
git push -u origin main
```

**Nota**: Necesitarás autenticarte en GitHub (usuario y contraseña/token)

### 3. Vercel - Conectar Repositorio

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Sign Up" → "Continue with GitHub"
3. Autoriza a Vercel a acceder a tu GitHub
4. En el dashboard, haz clic en "Add New..." → "Project"
5. En "Import Git Repository", selecciona `truco-tournament-app`
6. Haz clic en "Import"

### 4. Vercel - Configurar Proyecto

Vercel detectará automáticamente que es Vite:

- **Framework Preset**: Vite (debería estar automático)
- **Root Directory**: `./` (por defecto)
- **Build Command**: `npm run build` (por defecto)
- **Output Directory**: `dist` (por defecto)
- **Install Command**: `npm install` (por defecto)

### 5. Vercel - Variables de Entorno

**ANTES de hacer Deploy**, haz clic en "Environment Variables" y agrega:

1. **Variable 1**:
   - Key: `VITE_SUPABASE_URL`
   - Value: Tu URL de Supabase (ej: `https://xxxxx.supabase.co`)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

2. **Variable 2**:
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: Tu anon key de Supabase
   - Environments: ✅ Production, ✅ Preview, ✅ Development

3. Haz clic en "Save" para cada una

### 6. Vercel - Deploy

1. Haz clic en "Deploy"
2. Espera 2-3 minutos
3. ¡Listo! Tu app estará en `https://tu-app.vercel.app`

### 7. Supabase - Configurar URLs de Producción

1. Ve a tu proyecto en Supabase
2. Ve a **Authentication** → **URL Configuration**
3. Actualiza:
   - **Site URL**: `https://tu-app.vercel.app` (la URL que te dio Vercel)
   - **Redirect URLs**: Agrega estas líneas:
     ```
     https://tu-app.vercel.app/**
     https://*.vercel.app/**
     http://localhost:5173/**
     ```
4. Haz clic en "Save"

## ✅ Verificar

1. Ve a la URL de tu app en Vercel
2. Prueba crear una cuenta
3. Prueba iniciar sesión
4. Verifica que los datos se guarden en Supabase

## 🔄 Deploy Automático

Después de configurar:
- ✅ Cada push a `main` → Deploy a producción
- ✅ Cada PR → Preview deployment automático
- ✅ Cada commit → Build y validación

## 🆘 Problemas Comunes

### Error: "Environment variables missing"
- ✅ Verifica que las variables estén en Vercel
- ✅ Asegúrate de que estén marcadas para Production

### Error: "Build failed"
- ✅ Verifica que `npm run build` funciona localmente
- ✅ Revisa los logs en Vercel

### Error: "Supabase connection failed"
- ✅ Verifica las variables de entorno en Vercel
- ✅ Verifica las URLs en Supabase
- ✅ Revisa la consola del navegador

## 📝 Notas

- ⚠️ **IMPORTANTE**: La app debe estar migrada a Supabase antes del deploy
- ✅ Vercel despliega automáticamente en cada push
- ✅ Preview deployments en cada PR
- ✅ HTTPS automático
- ✅ CDN global

---

**¿Necesitas ayuda?** Revisa `DEPLOY_VERCEL.md` para más detalles.
