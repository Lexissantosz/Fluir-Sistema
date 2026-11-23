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
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

class PlanosInteresseControllerTest {
    final JdbcTemplate jdbc=mock(JdbcTemplate.class);
    final PlanosInteresseController controller=new PlanosInteresseController(jdbc);
    Authentication user(int id){return new UsernamePasswordAuthenticationToken(id,null,List.of());}

    @Test void exigeAutenticacaoSemAlterarBanco(){
        assertEquals(HttpStatus.UNAUTHORIZED,assertThrows(ResponseStatusException.class,
            ()->controller.save(Map.of("selectedFeatures",List.of(),"interest","later"),null)).getStatusCode());
        verifyNoInteractions(jdbc);
    }
    @Test void calculaCompletoComDoisPessoaisEUmaCompleta(){
        Map<String,Object> request=Map.of("selectedFeatures",
            List.of("finance.basic","diary.full","ai.insights"),"interest","interested",
            "recommendedPlan","free","userId",98765);
        var result=controller.save(request,user(7));
        assertEquals("complete",result.get("planoSugerido"));
        assertEquals(true,result.get("interesse"));
        verify(jdbc).update(contains("INSERT INTO interesse_planos_onboarding"),eq(7),
            eq("complete"),eq(true),eq("finance.basic;diary.full;ai.insights"));
    }
    @Test void retirarRecursoCompletoSugerePessoal(){
        var result=controller.save(Map.of("selectedFeatures",List.of("finance.basic","diary.full"),
            "interest","later"),user(7));
        assertEquals("personal",result.get("planoSugerido"));
        verify(jdbc).update(contains("INSERT INTO interesse_planos_onboarding"),eq(7),
            eq("personal"),eq(false),anyString());
    }
    @Test void somenteGratuitoNaoCriaAssinatura(){
        var result=controller.save(Map.of("selectedFeatures",List.of(),"interest","interested"),user(7));
        assertEquals("free",result.get("planoSugerido"));
        assertEquals(false,result.get("interesse"));
        verify(jdbc,never()).update(contains("assinatura"),(Object[])any(Object[].class));
    }
    @Test void rejeitaRecursosFalsos(){
        assertEquals(HttpStatus.BAD_REQUEST,assertThrows(ResponseStatusException.class,
            ()->controller.save(Map.of("selectedFeatures",List.of("admin.entitlement"),
                "interest","interested"),user(7))).getStatusCode());
        verifyNoInteractions(jdbc);
    }
    @Test void rejeitaDuplicacoes(){
        assertEquals(HttpStatus.BAD_REQUEST,assertThrows(ResponseStatusException.class,
            ()->controller.save(Map.of("selectedFeatures",List.of("finance.basic","finance.basic"),
                "interest","later"),user(7))).getStatusCode());
        verifyNoInteractions(jdbc);
    }
    @Test void aceitaIdentificacoesExtrasMasNaoConcedeAcesso(){
        var result=controller.save(Map.of("selectedFeatures",List.of("cycle.extra.1"),
            "interest","later"),user(7));
        assertEquals("personal",result.get("planoSugerido"));
        verify(jdbc).update(contains("INSERT INTO interesse_planos_onboarding"),eq(7),
            eq("personal"),eq(false),eq("cycle.extra.1"));
        verify(jdbc,never()).update(contains("ciclo_permissoes"),(Object[])any(Object[].class));
    }
}
