-- Persistência do assistente Fluir por usuário, sem acesso entre contas.
CREATE TABLE IF NOT EXISTS assistente_registros (
    id BIGSERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(32) NOT NULL,
    conteudo VARCHAR(1200) NOT NULL,
    rotulo VARCHAR(160) NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    chave_cliente UUID NOT NULL,
    tarefa_id INTEGER REFERENCES tarefas(id) ON DELETE SET NULL,
    CONSTRAINT assistente_registro_tipo_check CHECK (
      tipo IN ('mood','energy','diary','task','habit','water','sleep','finances',
        'nutrition','physicalHealth','menstrualCycle','attachments','achievements','timeline')
    ),
    CONSTRAINT assistente_registro_conteudo_check CHECK (length(trim(conteudo)) > 0),
    CONSTRAINT assistente_registro_cliente_unique UNIQUE (usuario_id, chave_cliente)
);
CREATE INDEX IF NOT EXISTS idx_assistente_registros_usuario_data
    ON assistente_registros (usuario_id, criado_em DESC);
