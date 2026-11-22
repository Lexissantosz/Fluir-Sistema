-- Cycle profiles are owned by authenticated users. No data is shared by possession of an invitation alone.
CREATE TABLE ciclo_perfis (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 usuario_id INT NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
 apelido VARCHAR(60),
 foto_data TEXT,
 menstrua_atualmente VARCHAR(20),
 modo_acompanhamento VARCHAR(15) NOT NULL DEFAULT 'later',
 CONSTRAINT ciclo_modo_valido CHECK (modo_acompanhamento IN ('self','other','both','later')),
 duracao_ciclo INT,
 duracao_menstruacao INT,
 ultima_menstruacao DATE,
 atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT ciclo_duracao_valida CHECK (duracao_ciclo IS NULL OR duracao_ciclo BETWEEN 15 AND 90),
 CONSTRAINT ciclo_menstruacao_valida CHECK (duracao_menstruacao IS NULL OR duracao_menstruacao BETWEEN 1 AND 20)
);
CREATE TABLE ciclo_convites (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 titular_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
 token_hash CHAR(64) NOT NULL UNIQUE,
 criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 expira_em TIMESTAMP NOT NULL,
 consumido_em TIMESTAMP,
 solicitante_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
 aprovado_em TIMESTAMP,
 rejeitado_em TIMESTAMP,
 ver_calendario BOOLEAN NOT NULL DEFAULT TRUE,
 ver_sintomas BOOLEAN NOT NULL DEFAULT FALSE,
 ver_notas BOOLEAN NOT NULL DEFAULT FALSE,
 sincronizar_perfil BOOLEAN NOT NULL DEFAULT FALSE,
 CONSTRAINT ciclo_convites_distintos CHECK (solicitante_id IS NULL OR solicitante_id <> titular_id)
);
CREATE INDEX idx_ciclo_convites_titular ON ciclo_convites(titular_id);
CREATE TABLE ciclo_permissoes (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 titular_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
 visitante_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
 apelido_local VARCHAR(60),
 ver_calendario BOOLEAN NOT NULL DEFAULT TRUE,
 ver_sintomas BOOLEAN NOT NULL DEFAULT FALSE,
 ver_notas BOOLEAN NOT NULL DEFAULT FALSE,
 sincronizar_perfil BOOLEAN NOT NULL DEFAULT FALSE,
 criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 revogado_em TIMESTAMP,
 CONSTRAINT ciclo_permissoes_distintos CHECK (titular_id <> visitante_id)
);
-- One owner and one viewer per free relationship (server enforced, including races).
CREATE UNIQUE INDEX uk_ciclo_permissao_ativa ON ciclo_permissoes(titular_id, visitante_id) WHERE revogado_em IS NULL;
CREATE UNIQUE INDEX uk_ciclo_unico_visitante_ativo ON ciclo_permissoes(visitante_id) WHERE revogado_em IS NULL;
CREATE UNIQUE INDEX uk_ciclo_unico_titular_ativo ON ciclo_permissoes(titular_id) WHERE revogado_em IS NULL;
CREATE INDEX idx_ciclo_permissoes_visitante ON ciclo_permissoes(visitante_id);
CREATE TABLE ciclo_registros (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 titular_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
 tipo VARCHAR(20) NOT NULL,
 intensidade VARCHAR(20),
 titulo VARCHAR(150) NOT NULL,
 nota VARCHAR(2000),
 data_registro DATE NOT NULL,
 criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT ciclo_tipo CHECK (tipo IN ('period','symptom','mood','other'))
);
CREATE INDEX idx_ciclo_registros_titular_data ON ciclo_registros(titular_id, data_registro DESC);
