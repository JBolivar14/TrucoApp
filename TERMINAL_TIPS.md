# Tips para Terminal/PowerShell

## 🔧 Problemas Comunes y Soluciones

### Problema: `&&` no funciona en PowerShell

**Error típico:**
```
The token '&&' is not a valid statement separator
```

**Solución:**
En PowerShell (Windows), usa `;` en lugar de `&&`:

```powershell
# ❌ NO funciona en PowerShell
npm install && npm run dev

# ✅ Funciona en PowerShell
npm install; npm run dev

# O ejecuta comandos por separado
npm install
npm run dev
```

### Problema: Comandos con `&&` fallan

**Solución:**
Si necesitas ejecutar múltiples comandos en PowerShell:

```powershell
# Opción 1: Usar punto y coma
cd "ruta"; npm install; npm run dev

# Opción 2: Ejecutar por separado
cd "ruta"
npm install
npm run dev

# Opción 3: Usar -and (en algunos casos)
if (Test-Path "archivo") { npm run dev }
```

### Problema: Rutas con espacios

**Error típico:**
```
The system cannot find the path specified
```

**Solución:**
Usa comillas dobles en las rutas:

```powershell
# ❌ Puede fallar
cd C:\Users\jesus\OneDrive\Documentos\TrucoApp

# ✅ Funciona
cd "C:\Users\jesus\OneDrive\Documentos\TrucoApp"
```

### Problema: Variables de entorno no se cargan

**Solución:**
Asegúrate de que el archivo `.env` esté en la raíz del proyecto:

```powershell
# Verificar que existe
Test-Path .env

# Ver contenido (sin mostrar valores completos)
Get-Content .env
```

### Problema: npm install falla

**Solución:**
```powershell
# Limpiar cache
npm cache clean --force

# Eliminar node_modules y reinstalar
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Problema: Puerto ya en uso

**Error típico:**
```
Port 5173 is already in use
```

**Solución:**
```powershell
# Ver qué proceso usa el puerto
netstat -ano | findstr :5173

# O cambiar el puerto en vite.config.js
# O matar el proceso (cuidado con esto)
```

### Problema: Permisos de ejecución

**Error típico:**
```
cannot be loaded because running scripts is disabled
```

**Solución:**
Ejecuta PowerShell como administrador y ejecuta:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 💡 Comandos Útiles en PowerShell

### Navegación
```powershell
# Cambiar directorio
cd "ruta"

# Volver atrás
cd ..

# Ir a raíz del proyecto
cd $PSScriptRoot
```

### Ver archivos
```powershell
# Listar archivos
ls
dir
Get-ChildItem

# Ver contenido de archivo
Get-Content archivo.txt
cat archivo.txt

# Ver últimas líneas
Get-Content archivo.txt -Tail 20
```

### Git
```powershell
# Inicializar repositorio
git init

# Ver estado
git status

# Agregar archivos
git add .

# Commit
git commit -m "mensaje"

# Ver ramas
git branch

# Push
git push
```

### NPM
```powershell
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Ver scripts disponibles
npm run

# Ver versión
npm --version
node --version
```

### Variables de entorno
```powershell
# Ver variable de entorno
$env:NODE_ENV

# Establecer temporalmente
$env:VITE_SUPABASE_URL = "https://xxx.supabase.co"

# Ver todas las variables VITE
Get-ChildItem env: | Where-Object { $_.Name -like "VITE_*" }
```

## 🚀 Comandos Específicos del Proyecto

### Desarrollo
```powershell
# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

### Supabase
```powershell
# Verificar que .env existe
Test-Path .env

# Ver contenido (sin valores completos)
Get-Content .env | Select-String "VITE_"
```

### Git + Deploy
```powershell
# Inicializar git
git init

# Agregar todo
git add .

# Commit inicial
git commit -m "Initial commit"

# Agregar remote (reemplaza con tu URL)
git remote add origin https://github.com/USUARIO/repo.git

# Push
git branch -M main
git push -u origin main
```

## 🔍 Depuración

### Ver errores detallados
```powershell
# Ver último error
$Error[0] | Format-List -Force

# Ver historial de errores
$Error | Select-Object -First 5
```

### Verificar instalación
```powershell
# Node.js
node --version

# npm
npm --version

# Git
git --version

# Verificar directorio actual
pwd
Get-Location
```

### Limpiar proyecto
```powershell
# Eliminar node_modules
Remove-Item -Recurse -Force node_modules

# Eliminar dist (build)
Remove-Item -Recurse -Force dist

# Reinstalar
npm install
```

## 📝 Notas Importantes

1. **PowerShell vs CMD**: PowerShell es más moderno, pero algunos comandos son diferentes
2. **Rutas**: Siempre usa comillas en rutas con espacios
3. **Separadores**: Usa `;` en lugar de `&&` en PowerShell
4. **Variables**: PowerShell usa `$env:` para variables de entorno
5. **Comandos largos**: Puedes usar backtick ` para continuar en siguiente línea

## 🆘 Si algo no funciona

1. Verifica que estás en el directorio correcto: `pwd`
2. Verifica que Node.js está instalado: `node --version`
3. Verifica que npm está instalado: `npm --version`
4. Limpia node_modules y reinstala: `Remove-Item node_modules -Recurse; npm install`
5. Revisa los logs de error específicos
6. Verifica que el puerto no está en uso
7. Verifica que las variables de entorno están configuradas
