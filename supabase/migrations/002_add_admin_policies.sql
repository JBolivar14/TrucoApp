-- ============================================
-- Políticas para Administradores
-- Los administradores pueden ver y gestionar todo
-- ============================================

-- Función helper para verificar si es administrador
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Actualizar políticas para tournaments
-- ============================================

-- Administradores pueden ver todos los torneos
DROP POLICY IF EXISTS "Users can view own tournaments" ON tournaments;
CREATE POLICY "Users can view own tournaments"
  ON tournaments FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

-- ============================================
-- Actualizar políticas para players
-- ============================================

-- Administradores pueden ver todos los jugadores
DROP POLICY IF EXISTS "Users can view own players" ON players;
CREATE POLICY "Users can view own players"
  ON players FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

-- Administradores pueden crear jugadores
DROP POLICY IF EXISTS "Users can create own players" ON players;
CREATE POLICY "Users can create own players"
  ON players FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_admin());

-- Administradores pueden actualizar jugadores
DROP POLICY IF EXISTS "Users can update own players" ON players;
CREATE POLICY "Users can update own players"
  ON players FOR UPDATE
  USING (auth.uid() = user_id OR is_admin());

-- Administradores pueden eliminar jugadores
DROP POLICY IF EXISTS "Users can delete own players" ON players;
CREATE POLICY "Users can delete own players"
  ON players FOR DELETE
  USING (auth.uid() = user_id OR is_admin());

-- ============================================
-- Actualizar políticas para matches
-- ============================================

-- Administradores pueden ver todas las partidas
DROP POLICY IF EXISTS "Users can view own matches" ON matches;
CREATE POLICY "Users can view own matches"
  ON matches FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

-- ============================================
-- Actualizar políticas para payments
-- ============================================

-- Administradores pueden ver todos los pagos
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

-- ============================================
-- Actualizar políticas para payment_records
-- ============================================

-- Administradores pueden ver todos los registros
DROP POLICY IF EXISTS "Users can view own payment records" ON payment_records;
CREATE POLICY "Users can view own payment records"
  ON payment_records FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL OR is_admin());

-- Administradores pueden actualizar todos los registros
DROP POLICY IF EXISTS "Users can update own payment records" ON payment_records;
CREATE POLICY "Users can update own payment records"
  ON payment_records FOR UPDATE
  USING (auth.uid() = user_id OR is_admin());

-- ============================================
-- Políticas para jugadores (solo lectura de torneos)
-- ============================================

-- Los jugadores pueden ver torneos activos y planificados
DROP POLICY IF EXISTS "Players can view upcoming tournaments" ON tournaments;
CREATE POLICY "Players can view upcoming tournaments"
  ON tournaments FOR SELECT
  USING (
    status IN ('planned', 'active')
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'player'
    )
  );

-- ============================================
-- Actualizar políticas para profiles (usuarios)
-- ============================================

-- Administradores pueden ver todos los perfiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR is_admin());

-- Administradores pueden actualizar todos los perfiles
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR is_admin());
