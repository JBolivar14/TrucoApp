# Guía de Deploy a Vercel

Esta guía te llevará paso a paso para desplegar la aplicación de Torneo de Truco en Vercel desde GitHub.

## 🎯 ¿Por qué Vercel + GitHub?

✅ **Excelente para React/Vite**: Optimizado para aplicaciones React  
✅ **Deploy automático**: Cada push a GitHub despliega automáticamente  
✅ **HTTPS gratuito**: Certificado SSL incluido  
✅ **CDN global**: Tu app se carga rápido en todo el mundo  
✅ **Variables de entorno**: Fácil configuración de secrets  
✅ **Preview deployments**: Cada PR genera un preview  
✅ **Gratis**: Plan gratuito generoso  
✅ **Integración perfecta con Supabase**: Funcionan muy bien juntos  

## 📋 Prerrequisitos

1. ✅ Cuenta en GitHub
2. ✅ Cuenta en Vercel (se puede crear con GitHub)
3. ✅ Proyecto en Supabase configurado
4. ✅ Aplicación migrada a Supabase (no localStorage)

## 🚀 Pasos para Deploy

### Paso 1: Migrar a Supabase

**IMPORTANTE**: Antes de hacer deploy, debemos migrar App.jsx de localStorage a Supabase.

Ver `MIGRACION_SUPABASE.md` para los detalles.

### Paso 2: Preparar el Código

1. Asegúrate de que todas las dependencias estén en `package.json`
2. Verifica que el build funciona:
   ```bash
   npm run build
   ```
3. Prueba que todo funciona localmente con Supabase

### Paso 3: Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com)
2. Haz clic en "New repository"
3. Completa el formulario:
   - **Repository name**: `truco-tournament-app` (o el nombre que prefieras)
   - **Description**: "Aplicación de gestión de torneos de Truco"
   - **Visibility**: Private (recomendado) o Public
   - ⚠️ **NO** marques "Initialize with README" (ya tenemos archivos)
4. Haz clic en "Create repository"

### Paso 4: Subir Código a GitHub

En la terminal del proyecto:

```bash
# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit: Torneo de Truco app"

# Agregar remote de GitHub
git remote add origin https://github.com/TU_USUARIO/truco-tournament-app.git

# Subir código
git branch -M main
git push -u origin main
```

⚠️ **IMPORTANTE**: Asegúrate de que `.env` esté en `.gitignore` (ya está configurado)

### Paso 5: Crear Cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Sign Up"
3. Selecciona "Continue with GitHub"
4. Autoriza a Vercel a acceder a tu GitHub

### Paso 6: Conectar Repositorio

1. En el dashboard de Vercel, haz clic en "Add New..." → "Project"
2. En "Import Git Repository", selecciona tu repositorio
3. Haz clic en "Import"

### Paso 7: Configurar Proyecto en Vercel

Vercel detectará automáticamente que es un proyecto Vite:

1. **Framework Preset**: Vite (debería detectarse automáticamente)
2. **Root Directory**: `./` (dejar por defecto)
3. **Build Command**: `npm run build` (debería estar por defecto)
4. **Output Directory**: `dist` (debería estar por defecto)
5. **Install Command**: `npm install` (debería estar por defecto)

### Paso 8: Configurar Variables de Entorno

1. En la configuración del proyecto, ve a **Environment Variables**
2. Agrega las siguientes variables:
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: Tu URL de Supabase (ej: `https://xxxxx.supabase.co`)
   - **Environments**: Production, Preview, Development (marcar los 3)
   
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Tu anon key de Supabase
   - **Environments**: Production, Preview, Development (marcar los 3)

3. Haz clic en "Save" para cada variable

### Paso 9: Configurar Supabase para Producción

1. Ve a tu proyecto en Supabase
2. Ve a **Authentication** → **URL Configuration**
3. Actualiza:
   - **Site URL**: La URL de Vercel (ej: `https://tu-app.vercel.app`)
   - **Redirect URLs**: Agrega:
     - `https://tu-app.vercel.app/**`
     - `https://*.vercel.app/**` (para previews)
     - `http://localhost:5173/**` (para desarrollo local)

### Paso 10: Deploy

1. En Vercel, haz clic en "Deploy"
2. Espera a que termine el deploy (2-3 minutos)
3. ¡Listo! Tu app estará disponible en `https://tu-app.vercel.app`

## 🔄 Deploy Automático

Una vez configurado:
- ✅ Cada push a `main` → Deploy a producción
- ✅ Cada PR → Preview deployment automático
- ✅ Cada commit → Build y validación

## 📝 Verificar Deploy

1. Ve a la URL de tu app (Vercel te la dará)
2. Prueba crear una cuenta
3. Prueba iniciar sesión
4. Verifica que los datos se guarden en Supabase

## 🎨 URLs Personalizadas (Opcional)

Si quieres un dominio personalizado:

1. Ve a **Settings** → **Domains** en Vercel
2. Agrega tu dominio
3. Configura los DNS según las instrucciones
4. Actualiza las URLs en Supabase

## 🔒 Seguridad

✅ Variables de entorno están encriptadas en Vercel  
✅ No se exponen en el código  
✅ HTTPS automático  
✅ Actualizar URLs en Supabase después del deploy  

## 🐛 Solución de Problemas

### Error: "Build failed"
- ✅ Verifica que el build funciona localmente (`npm run build`)
- ✅ Revisa los logs en Vercel
- ✅ Verifica que las dependencias estén en `package.json`

### Error: "Environment variables missing"
- ✅ Verifica que las variables estén configuradas en Vercel
- ✅ Asegúrate de que estén marcadas para el environment correcto
- ✅ Reinicia el deploy

### Error: "Supabase connection failed"
- ✅ Verifica las variables de entorno en Vercel
- ✅ Verifica que las URLs estén configuradas en Supabase
- ✅ Revisa los logs en Vercel

### La app no carga
- ✅ Revisa la consola del navegador
- ✅ Verifica que el build fue exitoso
- ✅ Revisa los logs en Vercel

## 📊 Monitoreo

Vercel incluye:
- ✅ Analytics de tráfico
- ✅ Logs de errores
- ✅ Métricas de rendimiento
- ✅ Información de builds

## 🎉 ¡Listo!

Tu aplicación estará:
- ✅ Desplegada en producción
- ✅ Con HTTPS
- ✅ Con deploy automático
- ✅ Con preview deployments
- ✅ Integrada con Supabase

## 🔄 Actualizaciones

Para actualizar la aplicación:

1. Haz cambios en tu código local
2. Haz commit y push a GitHub
3. Vercel desplegará automáticamente
4. En 2-3 minutos tu app estará actualizada

---

**Recomendación**: Antes de hacer deploy, completa la migración a Supabase. Ver `MIGRACION_SUPABASE.md`.
