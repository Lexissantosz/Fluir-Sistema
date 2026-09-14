CREATE TABLE preferencias_sono (
    id INT GENERATED ALWAYS AS IDENTITY,
    meta_sono VARCHAR(30),
    horario_dormir VARCHAR(10),
    horario_acordar VARCHAR(10),
    registrar_qualidade VARCHAR(20),
    dificuldade_dormir VARCHAR(30),
    lembrete_dormir VARCHAR(20),
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT UK_preferencias_sono_usuario UNIQUE (usuario_id),
    CONSTRAINT FK_preferencias_sono_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id)
        ON DELETE CASCADE
);