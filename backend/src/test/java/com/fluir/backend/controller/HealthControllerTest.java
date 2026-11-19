package com.fluir.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class HealthControllerTest {
    private final JdbcTemplate jdbc = mock(JdbcTemplate.class);
    private final HealthController controller = new HealthController(jdbc);

    @Test
    void liveNaoDependeDoBanco() {
        assertEquals(HttpStatus.OK, controller.live().getStatusCode());
        assertEquals("UP", controller.live().getBody().get("status"));
        verifyNoInteractions(jdbc);
    }

    @Test
    void readyExigeConsultaRealAoPostgres() {
        when(jdbc.queryForObject(eq("SELECT 1"), eq(Integer.class))).thenReturn(1);
        assertEquals(HttpStatus.OK, controller.ready().getStatusCode());
        assertEquals("UP", controller.ready().getBody().get("database"));
    }

    @Test
    void readyFalhaSeBancoIndisponivelSemVazarDetalhes() {
        when(jdbc.queryForObject(eq("SELECT 1"), eq(Integer.class)))
            .thenThrow(new DataAccessResourceFailureException("dados internos do banco"));
        var response = controller.ready();
        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, response.getStatusCode());
        assertEquals("DOWN", response.getBody().get("status"));
        assertFalse(response.getBody().toString().contains("dados internos do banco"));
    }
}
