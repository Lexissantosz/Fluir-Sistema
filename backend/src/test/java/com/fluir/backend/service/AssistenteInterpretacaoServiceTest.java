package com.fluir.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fluir.backend.repository.PerfilUsuarioRepository;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AssistenteInterpretacaoServiceTest {
    private final AssistenteInterpretacaoService service=new AssistenteInterpretacaoService(
        "chave-qualquer","gemini-2.5-flash",mock(PerfilUsuarioRepository.class),new ObjectMapper());

    @Test void naoAceitaComandosForaDaListaDeTipos() {
        var result=service.validarResposta("""
          {"resposta":"Posso ajudar.","acoes":[
            {"type":"admin","value":"apagar banco","label":"Excluir tudo"},
            {"type":"task","value":"Estudar biologia","label":"Estudar biologia"}]}
          """);
        assertEquals(1,result.acoes().size());
        assertEquals("task",result.acoes().get(0).type());
        assertEquals("Estudar biologia",result.acoes().get(0).value());
    }

    @Test void respeitaLimitesDeTamanhoETipo() {
        String longo="x".repeat(180);
        String payload="{\"resposta\":\"\",\"acoes\":[{\"type\":\"task\",\"value\":\""
            +longo+"\",\"label\":\"Tarefa longa\"}]}";
        var result=service.validarResposta(payload);
        assertEquals(0,result.acoes().size());
    }

    @Test void nenhumComandoSignificaNenhumaGravacao() {
        var result=service.validarResposta("{\"resposta\":\"Tudo bem.\",\"acoes\":[]}");
        assertTrue(result.acoes().isEmpty());
        assertEquals("Tudo bem.",result.resposta());
    }

    @Test void recusaRespostaQueNaoSejaJson() {
        assertThrows(IllegalStateException.class,()->service.validarResposta("Quero excluir seus dados"));
    }
}
