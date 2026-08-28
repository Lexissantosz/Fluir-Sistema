package com.fluir.backend.dto;

import java.time.LocalDate;

public record TarefaRequest(
        Integer usuarioId,
        String titulo,
        String categoria,
        String descricao,
        String prioridade,
        String horario,
        LocalDate dataTarefa,
        Integer tempoEstimadoMinutos,
        String energiaGasta,
        Boolean concluida
) {
}