CREATE TABLE preferencias_tarefas (
    id INT GENERATED ALWAYS AS IDENTITY,
    visualizacao_preferida VARCHAR(30),
    lembretes VARCHAR(20),
    categorias TEXT,
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT UK_preferencias_tarefas_usuario UNIQUE (usuario_id),
    CONSTRAINT FK_preferencias_tarefas_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id)
        ON DELETE CASCADE
);