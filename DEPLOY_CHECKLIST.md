# Checklist de Deploy a Vercel

## ⚠️ IMPORTANTE ANTES DEL DEPLOY

### Migración a Supabase
- ⚠️ **ACTUALMENTE**: La app usa `localStorage` (no funciona en producción)
- ✅ **NECESARIO**: Migrar a Supabase antes del deploy
- 📖 **Ver**: `MIGRACION_SUPABASE.md` para migrar
- ⚠️ **Opcional**: Puedes hacer deploy primero, pero la app solo funcionará con autenticación

### Estado Actual
- ✅ Build funciona (`npm run build`)
- ✅ Código listo
- ⚠️ Falta migrar de localStorage a Supabase
- ⚠️ Falta configurar Supabase (si no lo has hecho)

## 📋 Checklist Pre-Deploy

### 1. Configuración de Supabase
- [ ] Proyecto creado en Supabase
- [ ] Script SQL ejecutado (`supabase/migrations/001_initial_schema.sql`)
- [ ] Credenciales obtenidas (URL y anon key)
- [ ] Variables de entorno preparadas (crear `.env` localmente)

### 2. Migración (IMPORTANTE)
- [ ] App.jsx migrado a Supabase
- [ ] Ya no usa localStorage
- [ ] Pruebas localmente con Supabase
- [ ] Login/Registro funcionando

### 3. Preparación del Código
- [ ] Build funciona (`npm run build`)
- [ ] Todas las dependencias en `package.json`
- [ ] `.gitignore` incluye `.env`
- [ ] No hay errores en el código

### 4. GitHub
- [ ] Cuenta de GitHub
- [ ] Repositorio creado en GitHub
- [ ] Código subido a GitHub

### 5. Vercel
- [ ] Cuenta de Vercel
- [ ] Proyecto conectado a GitHub
- [ ] Variables de entorno configuradas en Vercel
- [ ] URLs configuradas en Supabase

## 🚀 Pasos para Deploy (si ya migraste a Supabase)

### Paso 1: Crear Repositorio en GitHub
1. Ve a github.com
2. New repository
3. Nombre: `truco-tournament-app`
4. Private o Public
5. NO marcar "Initialize with README"
6. Create repository

### Paso 2: Subir Código a GitHub
```bash
git init
git add .
git commit -m "Initial commit: Torneo de Truco app"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/truco-tournament-app.git
git push -u origin main
```

### Paso 3: Configurar Vercel
1. Ve a vercel.com
2. Sign up with GitHub
3. Import project
4. Selecciona tu repositorio
5. Configure project (Vite detectado automáticamente)
6. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Deploy

### Paso 4: Configurar Supabase para Producción
1. Ve a Supabase → Authentication → URL Configuration
2. Site URL: `https://tu-app.vercel.app`
3. Redirect URLs: 
   - `https://tu-app.vercel.app/**`
   - `https://*.vercel.app/**`
   - `http://localhost:5173/**`

## ⚠️ Opciones

### Opción A: Deploy Ahora (Con localStorage - NO recomendado)
- ✅ La app se desplegará
- ❌ No funcionará correctamente en producción
- ❌ Cada usuario tendría datos locales
- ❌ No hay autenticación real

### Opción B: Migrar Primero, Luego Deploy (Recomendado)
- ✅ Migrar a Supabase primero
- ✅ Probar localmente
- ✅ Luego hacer deploy
- ✅ Funcionará correctamente en producción

## 🎯 Recomendación

**Sigue este orden:**

1. **Configurar Supabase** (si no lo has hecho)
   - Ver `CONFIGURACION_COMPLETA.md`

2. **Migrar a Supabase** (IMPORTANTE)
   - Ver `MIGRACION_SUPABASE.md`
   - O pedir ayuda para migrar

3. **Probar localmente**
   - Verificar que todo funciona

4. **Hacer deploy**
   - Ver `DEPLOY_VERCEL.md`

## 💡 Si quieres deployar ahora mismo

Puedo ayudarte a:
1. ✅ Crear el repositorio en GitHub
2. ✅ Configurar Vercel
3. ⚠️ Pero la app no funcionará hasta migrar a Supabase

**¿Prefieres:**
- A) Migrar primero y luego deploy (recomendado)
- B) Deploy ahora y migrar después
- C) Solo preparar GitHub/Vercel y migrar después
