package com.fluir.backend.controller;

import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class CicloOnboardingControllerTest {
    final JdbcTemplate db=mock(JdbcTemplate.class);
    final CicloOnboardingController controller=new CicloOnboardingController(db);
    Authentication user(int id){return new UsernamePasswordAuthenticationToken(id,null,List.of());}

    @Test void naoPermiteConfiguracaoSemAutenticacao(){
        assertEquals(HttpStatus.UNAUTHORIZED,assertThrows(ResponseStatusException.class,
            ()->controller.configure(Map.of("modo","later","rascunhos",List.of()),null)).getStatusCode());
        verifyNoInteractions(db);
    }

    @Test void rejeitaModoInvalido(){
        assertEquals(HttpStatus.BAD_REQUEST,assertThrows(ResponseStatusException.class,
            ()->controller.configure(Map.of("modo","livre","rascunhos",List.of()),user(7))).getStatusCode());
        verifyNoInteractions(db);
    }

    @Test void rejeitaMaisDeCincoIdentificacoes(){
        List<Map<String,Object>> drafts=java.util.stream.IntStream.range(0,6)
            .mapToObj(i->Map.<String,Object>of("apelido","P"+i,"possuiFluir","sim","sincronizar",false)).toList();
        assertEquals(HttpStatus.BAD_REQUEST,assertThrows(ResponseStatusException.class,
            ()->controller.configure(Map.of("modo","other","rascunhos",drafts),user(7))).getStatusCode());
        verifyNoInteractions(db);
    }

    @Test void rascunhosNaoConcedemPermissoes(){
        List<Map<String,Object>> drafts=List.of(
            Map.of("apelido","Ana","possuiFluir","sim","sincronizar",true),
            Map.of("apelido","Bia","possuiFluir","nao","sincronizar",false));
        Map<String,Object> payload=new java.util.HashMap<>();
        payload.put("modo","other");payload.put("rascunhos",drafts);payload.put("usuarioId",999);
        assertEquals("salvo",controller.configure(payload,user(7)).get("status"));
        verify(db).update(contains("INSERT INTO ciclo_perfis"),eq(7),eq("other"));
        verify(db).update(contains("DELETE FROM ciclo_rascunhos_acompanhamento"),eq(7));
        verify(db,times(2)).update(contains("INSERT INTO ciclo_rascunhos_acompanhamento"),any(),any(),any(),any());
        verify(db,never()).update(contains("INSERT INTO ciclo_permissoes"),(Object[])any(Object[].class));
    }

    @Test void respostaPrefiroNaoResponderEhValida(){
        Map<String,Object> payload=Map.of("modo","self","rascunhos",List.of(),
            "menstrua","prefiro-nao-responder");
        assertEquals("salvo",controller.configure(payload,user(7)).get("status"));
    }

    @Test void naoPermiteFotoSvgOuImagemFalsa(){
        Map<String,Object> payload=new java.util.HashMap<>();
        payload.put("modo","self");
        payload.put("rascunhos",List.of());
        payload.put("foto","data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=");
        assertEquals(HttpStatus.BAD_REQUEST,assertThrows(ResponseStatusException.class,
            ()->controller.configure(payload,user(7))).getStatusCode());
        verifyNoInteractions(db);
    }

    @Test void visitantesSoLeemSeusPropriosRascunhos(){
        when(db.queryForList(anyString(),eq(7))).thenReturn(List.of());
        assertEquals(List.of(),controller.listDrafts(user(7)));
        verify(db).queryForList(contains("WHERE visitante_id=?"),eq(7));
    }

    @Test void visitanteNaoApagaRascunhoDeOutroUsuario(){
        when(db.update(contains("DELETE FROM ciclo_rascunhos_acompanhamento"),eq(111L),eq(7))).thenReturn(0);
        assertEquals(HttpStatus.NOT_FOUND,assertThrows(ResponseStatusException.class,
            ()->controller.removeDraft(111L,user(7))).getStatusCode());
    }
}
