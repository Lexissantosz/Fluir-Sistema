-- Registro de interesse comercial. Não é assinatura e NUNCA concede permissões pagas.
CREATE TABLE interesse_planos_onboarding (
 usuario_id INTEGER PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
 plano_sugerido VARCHAR(12) NOT NULL DEFAULT 'free',
 tem_interesse BOOLEAN NOT NULL DEFAULT FALSE,
 recursos_solicitados TEXT NOT NULL DEFAULT '',
 atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT plano_sugerido_valido CHECK (plano_sugerido IN ('free','personal','complete'))
);
