CREATE TABLE usuarios (
    id INT GENERATED ALWAYS AS IDENTITY,
    criado_em TIMESTAMP,
    email VARCHAR(120) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT UK_usuarios_email UNIQUE (email)
);

CREATE TABLE habitos (
    id INT GENERATED ALWAYS AS IDENTITY,
    categoria VARCHAR(100),
    criado_em TIMESTAMP,
    frequencia_semanal INT,
    melhor_horario VARCHAR(30),
    titulo VARCHAR(150) NOT NULL,
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_habitos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);

CREATE TABLE tarefas (
    id INT GENERATED ALWAYS AS IDENTITY,
    categoria VARCHAR(100),
    concluida BOOLEAN,
    criado_em TIMESTAMP,
    energia_gasta VARCHAR(20),
    tempo_estimado_minutos INT,
    titulo VARCHAR(150) NOT NULL,
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_tarefas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);

CREATE TABLE perfis_usuario (
    id INT GENERATED ALWAYS AS IDENTITY,
    altura INT,
    apelido VARCHAR(100),
    atualizado_em TIMESTAMP,
    criado_em TIMESTAMP,
    energia_atual VARCHAR(20),
    genero_nascimento VARCHAR(50),
    nome VARCHAR(100) NOT NULL,
    onboarding_concluido BOOLEAN,
    peso DOUBLE PRECISION,
    pronomes VARCHAR(50),
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT UK_perfis_usuario_usuario UNIQUE (usuario_id),
    CONSTRAINT FK_perfis_usuario_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);

CREATE TABLE modulos_usuario (
    id INT GENERATED ALWAYS AS IDENTITY,
    attachments BOOLEAN,
    diary BOOLEAN,
    finances BOOLEAN,
    habits BOOLEAN,
    menstrual_cycle BOOLEAN,
    nutrition BOOLEAN,
    physical_health BOOLEAN,
    sleep BOOLEAN,
    tasks BOOLEAN,
    timeline BOOLEAN,
    usuario_id INT NOT NULL,
    water BOOLEAN,
    PRIMARY KEY (id),
    CONSTRAINT UK_modulos_usuario_usuario UNIQUE (usuario_id),
    CONSTRAINT FK_modulos_usuario_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);

CREATE TABLE preferencias_agua (
    id INT GENERATED ALWAYS AS IDENTITY,
    meta_calculada_ml INT,
    meta_final_ml INT,
    modo_registro VARCHAR(20),
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT UK_preferencias_agua_usuario UNIQUE (usuario_id),
    CONSTRAINT FK_preferencias_agua_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);