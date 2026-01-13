# ✅ Checklist de Migración a Supabase

## 📋 Estado Actual vs Estado Deseado

### Estado Actual (localStorage)
- ❌ Datos locales al navegador
- ❌ No hay autenticación
- ❌ No persiste entre dispositivos
- ❌ No funciona correctamente en producción

### Estado Deseado (Supabase)
- ✅ Datos en la nube
- ✅ Autenticación por usuario
- ✅ Persiste entre dispositivos
- ✅ Funciona en producción

---

## ✅ Checklist de Migración

### Fase 1: Configuración de Supabase

- [ ] Proyecto creado en Supabase
- [ ] Script SQL ejecutado (`supabase/migrations/001_initial_schema.sql`)
- [ ] Credenciales obtenidas (URL y anon key)
- [ ] Archivo `.env` creado localmente con:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Variables de entorno configuradas en Vercel:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] URLs configuradas en Supabase:
  - [ ] Site URL: URL de Vercel
  - [ ] Redirect URLs: URLs de producción y desarrollo

### Fase 2: Migración de Código

#### Jugadores
- [ ] Reemplazar `localStorage.getItem('trucoPlayers')` con `getPlayers()`
- [ ] Reemplazar `localStorage.setItem('trucoPlayers')` con `createPlayer()`
- [ ] Actualizar función `handleSubmit` en PlayersTab
- [ ] Actualizar función `handleEdit` en PlayersTab
- [ ] Actualizar función `handleDelete` en PlayersTab
- [ ] Probar crear jugador
- [ ] Probar editar jugador
- [ ] Probar eliminar jugador
- [ ] Probar búsqueda

#### Torneos
- [ ] Reemplazar `localStorage.getItem('trucoTournaments')` con `getTournaments()`
- [ ] Reemplazar `localStorage.setItem('trucoTournaments')` con `createTournament()`
- [ ] Actualizar función `handleSubmit` en TournamentsTab
- [ ] Actualizar función `handleEdit` en TournamentsTab
- [ ] Actualizar función `handleDelete` en TournamentsTab
- [ ] Actualizar función `addParticipant` para usar `addTournamentPlayer()`
- [ ] Actualizar función `removeParticipant` para usar `removeTournamentPlayer()`
- [ ] Probar crear torneo
- [ ] Probar editar torneo
- [ ] Probar eliminar torneo
- [ ] Probar agregar participante
- [ ] Probar remover participante

#### Partidas
- [ ] Reemplazar `localStorage.getItem('trucoMatches')` con `getMatches()`
- [ ] Reemplazar `localStorage.setItem('trucoMatches')` con `createMatch()`
- [ ] Actualizar función `handleSubmit` en MatchesTab
- [ ] Actualizar función `handleEdit` en MatchesTab
- [ ] Actualizar función `handleDelete` en MatchesTab
- [ ] Probar crear partida
- [ ] Probar editar partida
- [ ] Probar eliminar partida

#### Pagos
- [ ] Reemplazar `localStorage.getItem('trucoPayments')` con `getPayments()`
- [ ] Reemplazar `localStorage.setItem('trucoPayments')` con `createPayment()`
- [ ] Actualizar función `handleSubmit` en PaymentsTab
- [ ] Actualizar función `handleEdit` en PaymentsTab
- [ ] Actualizar función `handleDelete` en PaymentsTab
- [ ] Probar crear pago
- [ ] Probar editar pago
- [ ] Probar eliminar pago

#### Registros QR
- [ ] Reemplazar `localStorage.getItem('trucoPaymentRecords')` con `getPaymentRecords()`
- [ ] Actualizar `PaymentForm.jsx` para usar `createPaymentRecord()`
- [ ] Actualizar función `handleConfirmQRRecord` para usar servicios
- [ ] Probar crear registro desde QR
- [ ] Probar confirmar registro

#### Dashboard
- [ ] Actualizar carga de datos para usar Supabase
- [ ] Verificar que las estadísticas se calculan correctamente
- [ ] Probar exportar datos

### Fase 3: Autenticación

- [ ] Verificar que `ProtectedRoute` funciona
- [ ] Probar login en producción
- [ ] Probar registro en producción
- [ ] Verificar que los datos se filtran por usuario
- [ ] Probar cerrar sesión

### Fase 4: Pruebas

- [ ] Probar crear jugador
- [ ] Probar crear torneo
- [ ] Probar crear partida
- [ ] Probar crear pago
- [ ] Probar generar QR
- [ ] Probar completar formulario desde QR
- [ ] Probar confirmar registro QR
- [ ] Probar búsqueda
- [ ] Probar filtros
- [ ] Probar exportar
- [ ] Probar importar
- [ ] Verificar que los datos persisten al recargar
- [ ] Verificar que los datos son por usuario

### Fase 5: Producción

- [ ] Variables de entorno configuradas en Vercel
- [ ] URLs configuradas en Supabase
- [ ] Probar en producción
- [ ] Verificar que funciona en diferentes navegadores
- [ ] Verificar que funciona en móviles

---

## 🎯 Orden Recomendado

1. **Configurar Supabase** (30 min)
2. **Migrar Jugadores** (30 min) - Más simple, buen punto de partida
3. **Migrar Torneos** (45 min)
4. **Migrar Partidas** (30 min)
5. **Migrar Pagos** (45 min)
6. **Migrar Registros QR** (30 min)
7. **Probar todo** (1 hora)
8. **Deploy y verificar** (30 min)

**Tiempo total estimado**: 4-5 horas

---

## 🆘 Si algo falla

- ✅ Revisa la consola del navegador
- ✅ Revisa los logs en Supabase
- ✅ Verifica las variables de entorno
- ✅ Verifica las políticas RLS en Supabase
- ✅ Verifica que el usuario esté autenticado

---

**¿Listo para empezar?** Sigue `MIGRACION_SUPABASE.md` para los detalles.
