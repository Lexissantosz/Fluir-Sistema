package com.fluir.backend.controller;

import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class CicloPerfisControllerTest {
    final JdbcTemplate db=mock(JdbcTemplate.class);
    final CicloPerfisController api=new CicloPerfisController(db);
    Authentication user(int id) {
        return new UsernamePasswordAuthenticationToken(id,null,List.of());
    }
    @Test void usuarioNaoAutenticadoNaoConsultaRegistros() {
        assertEquals(HttpStatus.UNAUTHORIZED,assertThrows(ResponseStatusException.class,
            ()->api.records(10,null)).getStatusCode());
        verifyNoInteractions(db);
    }
    @Test void visitanteSemPermissaoNaoPodeLerRegistrosAlheios() {
        when(db.queryForMap(anyString(),eq(10),eq(20)))
            .thenThrow(new EmptyResultDataAccessException(1));
        assertEquals(HttpStatus.NOT_FOUND,assertThrows(ResponseStatusException.class,
            ()->api.records(10,user(20))).getStatusCode());
        verify(db,never()).queryForList(contains("ciclo_registros"),(Object[])any(Object[].class));
    }
    @Test void titularConsultaSomenteSeusRegistros() {
        when(db.queryForList(contains("ciclo_registros"),eq(20))).thenReturn(List.of());
        assertEquals(List.of(),api.records(20,user(20)));
        verify(db).queryForList(contains("WHERE titular_id=?"),eq(20));
    }
    @Test void visitanteComApenasCalendarioNaoVeNotasNemSintomas() {
        when(db.queryForMap(anyString(),eq(10),eq(20)))
            .thenReturn(Map.of("ver_calendario",true,"ver_sintomas",false,"ver_notas",false));
        when(db.queryForList(anyString(),eq(10))).thenReturn(List.of());
        api.records(10,user(20));
        verify(db).queryForList(argThat(sql->sql.contains("tipo='period'")&&
            sql.contains("NULL::varchar AS nota")),eq(10));
    }
    @Test void visitanteComSintomasNaoVeHumorOuOutro() {
        when(db.queryForMap(anyString(),eq(10),eq(20)))
            .thenReturn(Map.of("ver_calendario",true,"ver_sintomas",true,"ver_notas",false));
        when(db.queryForList(anyString(),eq(10))).thenReturn(List.of());
        api.records(10,user(20));
        verify(db).queryForList(argThat(sql->sql.contains("tipo IN ('period','symptom')")&&
            sql.contains("NULL::varchar AS nota")),eq(10));
    }
    @Test void usuarioNaoPodeExcluirRegistroAlheio() {
        when(db.update(contains("DELETE FROM ciclo_registros"),eq(77L),eq(20))).thenReturn(0);
        assertEquals(HttpStatus.NOT_FOUND,assertThrows(ResponseStatusException.class,
            ()->api.deleteRecord(77,user(20))).getStatusCode());
    }
    @Test void codigoInvalidoNaoGeraPermissao() {
        when(db.queryForObject(contains("count(*)"),eq(Integer.class),eq(20))).thenReturn(0);
        when(db.queryForList(contains("FROM ciclo_convites"),anyString())).thenReturn(List.of());
        assertEquals(HttpStatus.BAD_REQUEST,assertThrows(ResponseStatusException.class,
            ()->api.requestInvite(Map.of("codigo","naoexiste"),user(20))).getStatusCode());
        verify(db,never()).update(contains("INSERT INTO ciclo_permissoes"),(Object[])any(Object[].class));
    }
    @Test void registroCriadoSemprePertenceAoAutenticado() {
        when(db.queryForObject(contains("RETURNING id"),eq(Long.class),any(),any(),any(),any(),any(),any())).thenReturn(9L);
        Map<String,Object> result=api.addRecord(Map.of("tipo","period","titulo","Início","data","2026-11-20"),user(20));
        assertEquals(9L,result.get("id"));
        verify(db).queryForObject(contains("INSERT INTO ciclo_registros"),eq(Long.class),
            eq(20),eq("period"),isNull(),eq("Início"),isNull(),any());
    }
    @Test void conviteNaoConcedeAcessoSemAprovacao() {
        when(db.queryForObject(anyString(),eq(Integer.class),eq(20))).thenReturn(0);
        Map<String,Object> invitation=api.createInvite(Map.of(
            "calendario",true,"sintomas",false,"notas",false,"perfil",false),user(20));
        String code=(String)invitation.get("codigo");
        assertNotNull(code);
        assertTrue(code.length()>=30);
        verify(db).update(contains("INSERT INTO ciclo_convites"),eq(20),anyString(),
            eq(true),eq(false),eq(false),eq(false));
        verify(db,never()).update(contains("INSERT INTO ciclo_permissoes"),(Object[])any(Object[].class));
    }
    @Test void preferenciaInvalidaNaoEhPersistida() {
        assertEquals(HttpStatus.BAD_REQUEST,assertThrows(ResponseStatusException.class,
            ()->api.savePreference(Map.of("modo","outro"),user(20))).getStatusCode());
        verifyNoInteractions(db);
    }
}
