-- ============================================
-- Configurar cuenta maestra como administrador
-- ============================================

-- Asignar rol de administrador a la cuenta maestra
UPDATE profiles
SET role = 'admin'
WHERE email = 'jeboi994@gmail.com';

-- Verificar que se actualizó correctamente
SELECT id, email, full_name, role 
FROM profiles 
WHERE email = 'jeboi994@gmail.com';
