CREATE TABLE preferencias_habitos (
    id INT GENERATED ALWAYS AS IDENTITY,
    tipo_acompanhamento VARCHAR(30),
    meta_semanal VARCHAR(20),
    habitos_selecionados TEXT,
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT UK_preferencias_habitos_usuario UNIQUE (usuario_id),
    CONSTRAINT FK_preferencias_habitos_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id)
        ON DELETE CASCADE
);