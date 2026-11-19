package com.fluir.backend.service;

import com.fluir.backend.model.*;
import com.fluir.backend.repository.*;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AssistenteRegistroServiceTest {
    private final AssistenteRegistroRepository registros=mock(AssistenteRegistroRepository.class);
    private final UsuarioRepository usuarios=mock(UsuarioRepository.class);
    private final TarefaRepository tarefas=mock(TarefaRepository.class);
    private final AssistenteRegistroService service=new AssistenteRegistroService(registros,usuarios,tarefas);

    @Test void recusaRegistroInvalidoSemEscrever() {
        var input=new AssistenteRegistroService.SolicitarRegistro(
            "comando_desconhecido","dado","teste",UUID.randomUUID());
        assertThrows(IllegalArgumentException.class,()->service.registrar(1,input));
        verifyNoInteractions(registros,usuarios,tarefas);
    }

    @Test void naoDuplicaEventoComAMesmaChaveNaMesmaConta() {
        UUID chave=UUID.randomUUID();
        var anterior=new AssistenteRegistro();
        anterior.setTipo("mood");
        anterior.setConteudo("positive");
        anterior.setRotulo("Leve");
        when(registros.findByUsuario_IdAndChaveCliente(12,chave))
            .thenReturn(Optional.of(anterior));
        var salvo=service.registrar(12,new AssistenteRegistroService.SolicitarRegistro(
            "mood","positive","Leve",chave));
        assertEquals("mood",salvo.tipo());
        verify(registros,never()).save(any());
        verifyNoInteractions(usuarios,tarefas);
    }

    @Test void salvaHumorSemCriarTarefaDeFazDeConta() {
        Usuario usuario=new Usuario();
        usuario.setId(1);
        UUID chave=UUID.randomUUID();
        when(registros.findByUsuario_IdAndChaveCliente(1,chave))
            .thenReturn(Optional.empty());
        when(usuarios.findById(1)).thenReturn(Optional.of(usuario));
        when(registros.saveAndFlush(any(AssistenteRegistro.class)))
            .thenAnswer(inv->inv.getArgument(0));
        var salvo=service.registrar(1,new AssistenteRegistroService.SolicitarRegistro(
            "mood","heavy","Pesado",chave));
        assertEquals("heavy",salvo.conteudo());
        verifyNoInteractions(tarefas);
    }

    @Test void tarefasRealmenteUsamTabelaDeTarefasEUsuarioAutenticado() {
        Usuario dono=new Usuario();
        dono.setId(1);
        UUID chave=UUID.randomUUID();
        when(usuarios.findById(1)).thenReturn(Optional.of(dono));
        when(tarefas.save(any(Tarefa.class))).thenAnswer(inv->inv.getArgument(0));
        when(registros.saveAndFlush(any(AssistenteRegistro.class)))
            .thenAnswer(inv->inv.getArgument(0));
        service.registrar(1,new AssistenteRegistroService.SolicitarRegistro(
            "task","Estudar biologia","Estudar biologia",chave));
        verify(tarefas).save(argThat(t->"Estudar biologia".equals(t.getTitulo())
            && Integer.valueOf(1).equals(t.getUsuarioId())));
    }

    @Test void naoExcluiRegistroDeOutroUsuario() {
        when(registros.findByIdAndUsuario_Id(123L,1)).thenReturn(Optional.empty());
        assertFalse(service.excluir(1,123L));
        verify(registros,never()).delete(any());
        verifyNoInteractions(tarefas);
    }
}
