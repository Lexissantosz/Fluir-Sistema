CREATE TABLE sessoes_login (
    token_hash VARCHAR(64) PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL,
    expira_em TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_sessoes_login_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_sessoes_login_usuario_id
    ON sessoes_login(usuario_id);

CREATE INDEX idx_sessoes_login_expira_em
    ON sessoes_login(expira_em);