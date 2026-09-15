CREATE TABLE preferencias_ciclo_menstrual (
    id INT GENERATED ALWAYS AS IDENTITY,
    menstrua_atualmente VARCHAR(30),
    ciclo_regular VARCHAR(30),
    data_ultima_menstruacao VARCHAR(10),
    duracao_ciclo VARCHAR(30),
    duracao_sangramento VARCHAR(30),
    colicas VARCHAR(20),
    gravida VARCHAR(30),
    amamentando VARCHAR(30),
    metodo_hormonal VARCHAR(30),
    lembretes VARCHAR(20),
    sintomas TEXT,
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT UK_preferencias_ciclo_menstrual_usuario UNIQUE (usuario_id),
    CONSTRAINT FK_preferencias_ciclo_menstrual_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id)
        ON DELETE CASCADE
);