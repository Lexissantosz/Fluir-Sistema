CREATE TABLE preferencias_financas (
    id INT GENERATED ALWAYS AS IDENTITY,
    renda_mensal NUMERIC(12,2),
    controlar_gastos VARCHAR(20),
    controlar_dividas VARCHAR(20),
    meta_financeira VARCHAR(255),
    categorias TEXT,
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT UK_preferencias_financas_usuario UNIQUE (usuario_id),
    CONSTRAINT FK_preferencias_financas_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id)
        ON DELETE CASCADE
);