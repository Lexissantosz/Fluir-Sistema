CREATE TABLE usuarios (
    id INT NOT NULL AUTO_INCREMENT,
    criado_em DATETIME(6),
    email VARCHAR(120) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY UK_usuarios_email (email)
) ENGINE=InnoDB;

CREATE TABLE habitos (
    id INT NOT NULL AUTO_INCREMENT,
    categoria VARCHAR(100),
    criado_em DATETIME(6),
    frequencia_semanal INT,
    melhor_horario VARCHAR(30),
    titulo VARCHAR(150) NOT NULL,
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_habitos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tarefas (
    id INT NOT NULL AUTO_INCREMENT,
    categoria VARCHAR(100),
    concluida BIT,
    criado_em DATETIME(6),
    energia_gasta VARCHAR(20),
    tempo_estimado_minutos INT,
    titulo VARCHAR(150) NOT NULL,
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_tarefas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE perfis_usuario (
    id INT NOT NULL AUTO_INCREMENT,
    altura INT,
    apelido VARCHAR(100),
    atualizado_em DATETIME(6),
    criado_em DATETIME(6),
    energia_atual VARCHAR(20),
    genero_nascimento VARCHAR(50),
    nome VARCHAR(100) NOT NULL,
    onboarding_concluido BIT,
    peso DOUBLE,
    pronomes VARCHAR(50),
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY UK_perfis_usuario_usuario (usuario_id),
    CONSTRAINT FK_perfis_usuario_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE modulos_usuario (
    id INT NOT NULL AUTO_INCREMENT,
    attachments BIT,
    diary BIT,
    finances BIT,
    habits BIT,
    menstrual_cycle BIT,
    nutrition BIT,
    physical_health BIT,
    sleep BIT,
    tasks BIT,
    timeline BIT,
    usuario_id INT NOT NULL,
    water BIT,
    PRIMARY KEY (id),
    UNIQUE KEY UK_modulos_usuario_usuario (usuario_id),
    CONSTRAINT FK_modulos_usuario_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE preferencias_agua (
    id INT NOT NULL AUTO_INCREMENT,
    meta_calculada_ml INT,
    meta_final_ml INT,
    modo_registro VARCHAR(20),
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY UK_preferencias_agua_usuario (usuario_id),
    CONSTRAINT FK_preferencias_agua_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB;