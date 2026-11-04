package com.fluir.backend.controller;

import com.fluir.backend.dto.TarefaRequest;

import com.fluir.backend.repository.TarefaRepository;
import com.fluir.backend.repository.UsuarioRepository;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verifyNoInteractions;

import com.fluir.backend.model.Tarefa;
import java.util.Optional;

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

    @Test
    void deveBloquearAlteracaoDeTarefaDeOutroUsuario() {
        TarefaRepository tarefas =
                Mockito.mock(TarefaRepository.class);

        UsuarioRepository usuarios =
                Mockito.mock(UsuarioRepository.class);

        Tarefa tarefa = new Tarefa();
        tarefa.setUsuarioId(1);
        tarefa.setConcluida(false);

        Mockito.when(tarefas.findById(99))
                .thenReturn(Optional.of(tarefa));

        TarefaController controller =
                new TarefaController(tarefas, usuarios);

        var resposta = controller.alterarStatus(99, true, 2);

        assertEquals(HttpStatus.FORBIDDEN, resposta.getStatusCode());
        assertEquals(false, tarefa.getConcluida());

        Mockito.verify(tarefas, Mockito.never())
                .save(Mockito.any(Tarefa.class));
    }

    @Test
    void deveBloquearExclusaoDeTarefaDeOutroUsuario() {
        TarefaRepository tarefas =
                Mockito.mock(TarefaRepository.class);

        UsuarioRepository usuarios =
                Mockito.mock(UsuarioRepository.class);

        Tarefa tarefa = new Tarefa();
        tarefa.setUsuarioId(1);

        Mockito.when(tarefas.findById(99))
                .thenReturn(Optional.of(tarefa));

        TarefaController controller =
                new TarefaController(tarefas, usuarios);

        var resposta = controller.excluir(99, 2);

        assertEquals(
                HttpStatus.FORBIDDEN,
                resposta.getStatusCode()
        );

        Mockito.verify(tarefas, Mockito.never())
                .delete(Mockito.any(Tarefa.class));

        Mockito.verify(tarefas, Mockito.never())
                .deleteById(Mockito.anyInt());
    }
}