CREATE TABLE preferencias_saude_fisica (
    id INT GENERATED ALWAYS AS IDENTITY,
    pratica_atividade VARCHAR(20),
    frequencia_semanal VARCHAR(20),
    tipo_treino VARCHAR(30),
    registrar_dor_energia VARCHAR(20),
    limitacoes TEXT,
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT UK_preferencias_saude_fisica_usuario UNIQUE (usuario_id),
    CONSTRAINT FK_preferencias_saude_fisica_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id)
        ON DELETE CASCADE
);