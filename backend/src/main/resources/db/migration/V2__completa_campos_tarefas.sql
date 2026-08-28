ALTER TABLE tarefas
    ADD COLUMN descricao VARCHAR(500),
    ADD COLUMN prioridade VARCHAR(20),
    ADD COLUMN horario VARCHAR(10),
    ADD COLUMN data_tarefa DATE;