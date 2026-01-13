-- ============================================
-- Agregar tournament_id y player_id a payment_records
-- ============================================

-- Agregar columna tournament_id (opcional, puede ser NULL para registros antiguos)
ALTER TABLE payment_records
ADD COLUMN IF NOT EXISTS tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL;

-- Agregar columna player_id (opcional, puede ser NULL para registros públicos)
ALTER TABLE payment_records
ADD COLUMN IF NOT EXISTS player_id UUID REFERENCES players(id) ON DELETE SET NULL;

-- Crear índices para mejorar las consultas
CREATE INDEX IF NOT EXISTS idx_payment_records_tournament_id ON payment_records(tournament_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_player_id ON payment_records(player_id);
