# Preparar Deploy - Pasos Inmediatos

## 🎯 Estado Actual

✅ **Git inicializado**  
✅ **Build funciona** (`npm run build`)  
✅ **Código listo**  
⚠️ **Falta**: Migrar de localStorage a Supabase  

## 🚀 Opción 1: Deploy Inmediato (Preview)

Puedes hacer deploy ahora para:
- ✅ Ver cómo se ve en producción
- ✅ Probar la infraestructura
- ⚠️ Pero la app no funcionará completamente (necesita Supabase)

## 🚀 Opción 2: Deploy Completo (Recomendado)

1. Primero migrar a Supabase
2. Luego hacer deploy
3. La app funcionará correctamente

## 📝 Pasos Inmediatos (para Opción 1)

### 1. Preparar Git

Ya tienes git inicializado. Puedo ayudarte a hacer el commit inicial.

### 2. Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com)
2. Clic en "New repository"
3. Nombre: `truco-tournament-app`
4. Private o Public
5. **NO** marcar "Initialize with README"
6. Clic en "Create repository"

### 3. Subir Código

Después de crear el repositorio, te daré los comandos exactos.

### 4. Configurar Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import project
4. Selecciona tu repositorio
5. Configure (Vite detectado automáticamente)

### 5. Variables de Entorno

Si ya tienes Supabase configurado, agrega las variables en Vercel.

---

## 💡 Mi Recomendación

**Haz el commit y sube a GitHub ahora** (para tener el código guardado), luego:
- Si quieres ver el deploy: Configura Vercel ahora (la app se verá, pero no funcionará completamente)
- Si quieres que funcione: Migra a Supabase primero, luego deploy

¿Qué prefieres hacer primero?
