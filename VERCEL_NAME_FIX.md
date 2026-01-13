# Solución al Error de Nombre en Vercel

## ❌ Error

```
Project names can be up to 100 characters long and must be lowercase. 
They can include letters, digits, and the following characters: '.', '_', '-'. 
However, they cannot contain the sequence '---'.
```

## 🔍 Causa

Vercel requiere que los nombres de proyecto:
- ✅ Solo **minúsculas**
- ✅ Máximo 100 caracteres
- ✅ Solo letras, dígitos y los caracteres: `.`, `_`, `-`
- ❌ **NO** puede contener la secuencia `---`

## ✅ Solución

### Opción 1: Cambiar el Nombre del Proyecto en Vercel

Cuando configures el proyecto en Vercel:

1. En la página de configuración, verás el campo **"Project Name"**
2. Cambia el nombre a algo en minúsculas, por ejemplo:
   - `truco-tournament-app` ✅
   - `torneo-truco` ✅
   - `truco-app` ✅
   - `truco-tournament` ✅

3. **NO uses**:
   - `Truco-Tournament-App` ❌ (mayúsculas)
   - `Torneo de TRUCO` ❌ (mayúsculas y espacios)
   - `truco---app` ❌ (secuencia ---)

### Opción 2: Nombres Sugeridos

Algunos nombres válidos que puedes usar:

- `truco-tournament-app` (recomendado)
- `torneo-truco-app`
- `truco-tournament`
- `truco-app`
- `truco-torneo`
- `truco-gestion`
- `torneo-app`

### Opción 3: Si Ya Creaste el Proyecto

Si ya creaste el proyecto con un nombre incorrecto:

1. Ve a **Settings** → **General** en Vercel
2. Busca **"Project Name"**
3. Haz clic en **"Rename"**
4. Cambia el nombre a minúsculas
5. Guarda los cambios

## 📝 Pasos Correctos

1. En Vercel, cuando importes tu repositorio de GitHub
2. Verás un campo **"Project Name"**
3. **Cambia** el nombre a `truco-tournament-app` (o el que prefieras, en minúsculas)
4. Verifica que:
   - ✅ Todo en minúsculas
   - ✅ Sin espacios
   - ✅ Solo letras, números y guiones
   - ✅ No tenga `---`
5. Continúa con la configuración

## 💡 Nota

El nombre del proyecto en Vercel es **independiente** del nombre del repositorio en GitHub. Puedes usar:
- GitHub: `truco-tournament-app` o `Truco-Tournament-App` (cualquier cosa)
- Vercel: `truco-tournament-app` (solo minúsculas)

## ✅ Ejemplo Correcto

**Nombre en GitHub**: `Truco-Tournament-App` (puede tener mayúsculas)
**Nombre en Vercel**: `truco-tournament-app` (debe ser minúsculas)

Esto es perfecto y funcionará correctamente.

---

**¿Listo?** Intenta de nuevo con un nombre en minúsculas.
