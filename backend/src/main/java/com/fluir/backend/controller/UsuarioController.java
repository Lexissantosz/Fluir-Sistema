package com.fluir.backend.controller;

import com.fluir.backend.dto.CadastroRequest;
import com.fluir.backend.dto.LoginRequest;
import com.fluir.backend.dto.UsuarioResponse;
import com.fluir.backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@Valid @RequestBody CadastroRequest request) {
        try {
            UsuarioResponse response = usuarioService.cadastrar(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException erro) {
            return ResponseEntity.badRequest().body(erro.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            UsuarioResponse response = usuarioService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException erro) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(erro.getMessage());
        }
    }

    @GetMapping("/teste")
    public ResponseEntity<String> teste() {
        return ResponseEntity.ok("API do Fluir funcionando");
    }
}