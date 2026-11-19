-- Identificador estável da conta Google. Não vincular por e-mail sem consentimento.
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS google_sub VARCHAR(255);
CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_google_sub ON usuarios(google_sub);
