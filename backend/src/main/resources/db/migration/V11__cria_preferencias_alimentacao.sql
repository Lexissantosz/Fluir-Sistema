CREATE TABLE preferencias_alimentacao (
    id INT GENERATED ALWAYS AS IDENTITY,
    altura VARCHAR(30),
    peso VARCHAR(30),
    objetivo_alimentar VARCHAR(40),
    refeicoes_por_dia VARCHAR(10),
    restricoes TEXT,
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT UK_preferencias_alimentacao_usuario UNIQUE (usuario_id),
    CONSTRAINT FK_preferencias_alimentacao_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id)
        ON DELETE CASCADE
);