package com.fluir.backend.controller;

import com.fluir.backend.dto.TarefaRequest;
import com.fluir.backend.model.Tarefa;
import com.fluir.backend.model.Usuario;
import com.fluir.backend.repository.TarefaRepository;
import com.fluir.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class TarefaControllerSecurityTest {
    private final TarefaRepository tarefas=mock(TarefaRepository.class);
    private final UsuarioRepository usuarios=mock(UsuarioRepository.class);
    private final TarefaController controller=new TarefaController(tarefas,usuarios);
    private final UsernamePasswordAuthenticationToken usuario1=
        new UsernamePasswordAuthenticationToken(1,null);

    @Test void naoListaTarefasDeOutroUsuario() {
        assertEquals(HttpStatus.FORBIDDEN,
            controller.buscarPorUsuario(2,usuario1).getStatusCode());
        verifyNoInteractions(tarefas);
    }

    @Test void naoCriaTarefaParaOutroUsuario() {
        TarefaRequest request=new TarefaRequest(2,"Tarefa externa",null,null,
            null,null,null,null,null,false);
        assertEquals(HttpStatus.FORBIDDEN,controller.criar(request,usuario1).getStatusCode());
        verifyNoInteractions(usuarios,tarefas);
    }

    @Test void naoAlteraTarefaDeOutroUsuario() {
        Usuario dono=new Usuario();dono.setId(2);
        Tarefa tarefa=new Tarefa();tarefa.setUsuario(dono);
        when(tarefas.findById(99)).thenReturn(Optional.of(tarefa));
        assertEquals(HttpStatus.FORBIDDEN,
            controller.alterarStatus(99,true,usuario1).getStatusCode());
        verify(tarefas,never()).save(any());
    }

    @Test void naoExcluiTarefaDeOutroUsuario() {
        Usuario dono=new Usuario();dono.setId(2);
        Tarefa tarefa=new Tarefa();tarefa.setUsuario(dono);
        when(tarefas.findById(99)).thenReturn(Optional.of(tarefa));
        assertEquals(HttpStatus.FORBIDDEN,
            controller.excluir(99,usuario1).getStatusCode());
        verify(tarefas,never()).delete(any());
    }

    @Test void podeAlterarTarefaPropria() {
        Usuario dono=new Usuario();dono.setId(1);
        Tarefa tarefa=new Tarefa();tarefa.setUsuario(dono);
        when(tarefas.findById(99)).thenReturn(Optional.of(tarefa));
        when(tarefas.save(tarefa)).thenReturn(tarefa);
        assertEquals(HttpStatus.OK,
            controller.alterarStatus(99,true,usuario1).getStatusCode());
        verify(tarefas).save(tarefa);
    }
}
