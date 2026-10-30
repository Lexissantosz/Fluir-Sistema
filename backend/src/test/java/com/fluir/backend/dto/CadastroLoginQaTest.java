package com.fluir.backend.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import jakarta.validation.Validation;

class CadastroLoginQaTest {
    @Test void ct008EmailInvalido() {
        var f = Validation.buildDefaultValidatorFactory();
        try { var req = new CadastroRequest(); req.setNome("Pessoa QA");req.setEmail("invalido");req.setSenha("Teste123!");
            assertTrue(f.getValidator().validate(req).stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
        } finally { f.close(); }
    }
    @Test void ct007LoginSemEmail() {
        var f = Validation.buildDefaultValidatorFactory();
        try { var req = new LoginRequest(); req.setEmail("");req.setSenha("Teste123!");
            assertFalse(f.getValidator().validate(req).isEmpty());
        } finally { f.close(); }
    }
    @Test void ct010CadastroValido() {
        var f = Validation.buildDefaultValidatorFactory();
        try { var req = new CadastroRequest(); req.setNome("Pessoa QA");req.setEmail("qa@example.com");req.setSenha("Teste123!");
            assertTrue(f.getValidator().validate(req).isEmpty());
        } finally { f.close(); }
    }
}
