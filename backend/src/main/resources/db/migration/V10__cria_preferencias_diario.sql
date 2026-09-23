CREATE TABLE preferencias_diario (
    id INT GENERATED ALWAYS AS IDENTITY,
    frequencia VARCHAR(30),
    registrar_humor VARCHAR(20),
    perguntas_reflexivas VARCHAR(20),
    acompanhar_estresse VARCHAR(20),
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT UK_preferencias_diario_usuario UNIQUE (usuario_id),
    CONSTRAINT FK_preferencias_diario_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id)
        ON DELETE CASCADE
);