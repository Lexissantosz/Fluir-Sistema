package com.fluir.backend.controller;

import java.util.Map;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Rotas publicas de infraestrutura, sem dados pessoais nem credenciais.
 * /live confirma que o Spring Boot respondeu.
 * /ready verifica que o PostgreSQL aceita uma consulta simples.
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {
    private final JdbcTemplate jdbc;

    public HealthController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/live")
    public ResponseEntity<Map<String, String>> live() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "fluir"));
    }

    @GetMapping("/ready")
    public ResponseEntity<Map<String, String>> ready() {
        try {
            Integer result = jdbc.queryForObject("SELECT 1", Integer.class);
            if (Integer.valueOf(1).equals(result)) {
                return ResponseEntity.ok(Map.of("status", "UP", "database", "UP"));
            }
        } catch (DataAccessException exception) {
            // Nao expor mensagens JDBC, hosts, credenciais ou detalhes da infraestrutura.
        }
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("status", "DOWN", "database", "UNAVAILABLE"));
    }
}
