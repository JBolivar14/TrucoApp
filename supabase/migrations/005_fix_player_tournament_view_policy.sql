-- ============================================
-- Corregir política RLS para que jugadores puedan ver torneos
-- ============================================

-- Eliminar la política restrictiva que requiere role = 'player'
-- La política actual falla porque el schema solo permite 'user' o 'admin' en el CHECK constraint
DROP POLICY IF EXISTS "Players can view upcoming tournaments" ON tournaments;

-- Crear una política más permisiva que permita a cualquier usuario autenticado
-- ver torneos con status 'planned' o 'active'
-- Esto funciona porque las políticas RLS se combinan con OR:
-- - Administradores pueden ver todos (policy "Users can view own tournaments" con is_admin())
-- - Usuarios pueden ver sus propios torneos (policy "Users can view own tournaments")
-- - Cualquier usuario autenticado puede ver torneos próximos (esta policy)
CREATE POLICY "Players can view upcoming tournaments"
  ON tournaments FOR SELECT
  USING (
    status IN ('planned', 'active')
    AND auth.uid() IS NOT NULL
  );
