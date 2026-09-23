CREATE TABLE preferencias_anexos (
    id INT GENERATED ALWAYS AS IDENTITY,
    tipos_arquivo TEXT,
    vincular_modulos TEXT,
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT UK_preferencias_anexos_usuario UNIQUE (usuario_id),
    CONSTRAINT FK_preferencias_anexos_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id)
        ON DELETE CASCADE
);