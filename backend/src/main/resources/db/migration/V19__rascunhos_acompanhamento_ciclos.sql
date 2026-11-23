-- Identificações planejadas por visitante. NÃO concedem acesso a dados do titular.
CREATE TABLE ciclo_rascunhos_acompanhamento (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    visitante_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    apelido VARCHAR(60) NOT NULL,
    possui_fluir VARCHAR(10) NOT NULL DEFAULT 'nao-sei',
    sincronizacao_solicitada BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_ciclo_rascunho_possui_fluir CHECK (possui_fluir IN ('sim','nao','nao-sei'))
);
CREATE INDEX idx_ciclo_rascunhos_visitante ON ciclo_rascunhos_acompanhamento(visitante_id);
