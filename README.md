# Torneo de Truco - App de Gestión

Aplicación web moderna para gestionar torneos de Truco, controlar pagos y organizar partidas.

## Características

- 📊 **Dashboard**: Vista general con estadísticas y resumen de actividades
- 👥 **Gestión de Jugadores**: Registro y administración de jugadores con búsqueda
- 🏆 **Torneos**: Creación y gestión de torneos con entrada y premios
- 📅 **Partidas**: Registro de partidas con resultados y seguimiento
- 💰 **Control de Pagos**: Seguimiento de entradas, premios y balance general
- 📱 **Códigos QR**: Generación de códigos QR para inscripciones y pagos
- 📋 **Registros QR**: Panel de administración para gestionar registros desde QR
- 🔍 **Búsqueda y Filtros**: Búsqueda rápida y filtros en todas las secciones
- 📥 **Exportar Datos**: Exportación a CSV y JSON para respaldo
- 📤 **Importar Datos**: Restauración de datos desde archivos JSON
- 💾 **Almacenamiento Local**: Todos los datos se guardan automáticamente en el navegador
- 📱 **Diseño Responsive**: Optimizado para móviles, tablets y escritorio

## Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

3. Abre tu navegador en `http://localhost:5173`

## Construcción para Producción

```bash
npm run build
```

Los archivos estarán en la carpeta `dist/`.

## Uso

### Dashboard
- Vista general con estadísticas clave
- Resumen de torneos y partidas recientes
- Alertas de pagos y registros pendientes
- Exportar/Importar todos los datos

### Jugadores
- Agrega jugadores con su información de contacto
- Edita o elimina jugadores existentes
- Búsqueda por nombre, teléfono o email
- Exportar lista a CSV

### Torneos
- Crea torneos con entrada y premio
- Agrega participantes a los torneos
- Visualiza estadísticas de cada torneo
- Filtra por estado (Planificado, En Curso, Completado, Cancelado)
- Búsqueda de torneos
- Exportar lista a CSV

### Partidas
- Registra partidas entre jugadores
- Ingresa resultados y puntajes
- Marca el estado de cada partida
- Visualiza ganadores automáticamente

### Pagos
- Registra pagos de entrada a torneos
- Registra premios entregados
- Visualiza balance general (ingresos, gastos, neto)
- Genera códigos QR para inscripciones
- Gestiona registros de pago desde QR
- Convierte registros QR a pagos confirmados

## Tecnologías

- **React 18**: Framework principal
- **Vite**: Build tool y servidor de desarrollo
- **React Router**: Navegación entre páginas
- **Lucide React**: Iconos modernos
- **QRCode.react**: Generación de códigos QR
- **CSS3**: Diseño moderno y responsive con animaciones

## Funcionalidades Avanzadas

### Códigos QR para Pagos
1. Ve a la sección "Pagos"
2. Haz clic en "Generar Boleta QR"
3. Selecciona el torneo y completa la información
4. Descarga, imprime o comparte el código QR
5. Los jugadores escanean el QR y completan el formulario
6. Gestiona los registros en "Registros QR"

### Exportar/Importar Datos
- **Exportar**: Guarda todos los datos en formato JSON para respaldo
- **Importar**: Restaura datos desde un archivo JSON previamente exportado
- **Exportar CSV**: Exporta listas individuales (jugadores, torneos) a CSV

### Integración de Pagos
La aplicación está preparada para integrar proveedores de pago reales:
- Mercado Pago (recomendado para Argentina)
- PayPal
- Stripe
- Pagos manuales

Ver `PAYMENT_INTEGRATION.md` para instrucciones detalladas.

## 🚀 Deploy y Producción

### Configuración Actual

- ⚠️ **Estado**: La aplicación actualmente usa `localStorage` (desarrollo)
- ✅ **Migración a Supabase**: Preparada para migrar a Supabase
- 📖 **Ver**: `MIGRACION_SUPABASE.md` para migrar a Supabase
- 📖 **Ver**: `DEPLOY_VERCEL.md` para hacer deploy a Vercel

### Deploy Recomendado

**Vercel + GitHub + Supabase** es la configuración recomendada:
- ✅ Vercel: Hosting optimizado para React/Vite
- ✅ GitHub: Control de versiones y CI/CD
- ✅ Supabase: Base de datos y autenticación
- ✅ Deploy automático en cada push

📖 **Ver**: `README_DEPLOY.md` para el plan completo de migración y deploy

## Notas

- ⚠️ **Desarrollo**: Actualmente usa `localStorage` (cambiar a Supabase para producción)
- ✅ **Producción**: Configurar Supabase y hacer deploy a Vercel
- ✅ **Diseño responsive**: Optimizado para móviles, tablets y escritorio
- Validaciones de formularios integradas
- Búsqueda y filtros en tiempo real
- Exportación de datos para respaldo

## Próximas Mejoras

- [ ] Integración real con Mercado Pago
- [ ] Notificaciones por email
- [ ] Generación de reportes PDF
- [ ] Sistema de rankings
- [ ] Historial de cambios
- [ ] Modo oscuro

