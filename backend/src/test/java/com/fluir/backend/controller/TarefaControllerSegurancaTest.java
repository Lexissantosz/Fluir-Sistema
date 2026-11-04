package com.fluir.backend.controller;

import com.fluir.backend.dto.TarefaRequest;

import com.fluir.backend.repository.TarefaRepository;
import com.fluir.backend.repository.UsuarioRepository;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verifyNoInteractions;

class TarefaControllerSegurancaTest {

    @Test
    void deveBloquearConsultaDeOutroUsuario() {
        TarefaRepository tarefas =
                Mockito.mock(TarefaRepository.class);

        UsuarioRepository usuarios =
                Mockito.mock(UsuarioRepository.class);

        TarefaController controller =
                new TarefaController(tarefas, usuarios);

        var resposta = controller.buscarPorUsuario(1, 2);

        assertEquals(
                HttpStatus.FORBIDDEN,
                resposta.getStatusCode()
        );

        verifyNoInteractions(tarefas);
    }

    @Test
    void deveBloquearCriacaoParaOutroUsuario() {
        TarefaRepository tarefas =
                Mockito.mock(TarefaRepository.class);

        UsuarioRepository usuarios =
                Mockito.mock(UsuarioRepository.class);

        TarefaController controller =
                new TarefaController(tarefas, usuarios);

        TarefaRequest request = new TarefaRequest(
                1,
                "Tarefa indevida",
                null, null, null, null, null, null, null, false
        );

        var resposta = controller.criar(request, 2);

        assertEquals(
                HttpStatus.FORBIDDEN,
                resposta.getStatusCode()
        );

        verifyNoInteractions(tarefas, usuarios);
    }
}