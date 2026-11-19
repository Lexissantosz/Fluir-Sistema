package com.fluir.backend.controller;

import com.fluir.backend.dto.CadastroRequest;
import com.fluir.backend.dto.LoginRequest;
import com.fluir.backend.dto.UsuarioResponse;
import com.fluir.backend.dto.ErroResponse;
import com.fluir.backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import java.util.Map;
import com.fluir.backend.dto.GoogleLoginRequest;
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
            return ResponseEntity.badRequest()
                    .body(new ErroResponse(erro.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            UsuarioResponse response = usuarioService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException erro) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErroResponse(erro.getMessage()));
        }
    }


    @GetMapping("/google/config")
    public Map<String, Object> configuracaoGoogle() {
        return Map.of(
            "habilitado", usuarioService.googleEnabled(),
            "clientId", usuarioService.googleClientId()
        );
    }

    @PostMapping("/google")
    public ResponseEntity<?> loginGoogle(@Valid @RequestBody GoogleLoginRequest request) {
        if (!usuarioService.googleEnabled()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new ErroResponse("Login Google ainda não está configurado."));
        }
        try {
            return ResponseEntity.ok(usuarioService.loginComGoogle(request.getIdToken()));
        } catch (IllegalStateException erro) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErroResponse(erro.getMessage()));
        } catch (RuntimeException erro) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErroResponse("Não foi possível validar a conta Google."));
        }
    }

    @PostMapping("/google/vincular")
    public ResponseEntity<?> vincularGoogle(
            @Valid @RequestBody GoogleLoginRequest request,
            Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Integer)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErroResponse("Sessão necessária para vincular Google."));
        }
        try {
            Integer id = (Integer) authentication.getPrincipal();
            return ResponseEntity.ok(usuarioService.vincularGoogle(id, request.getIdToken()));
        } catch (RuntimeException erro) {
            return ResponseEntity.badRequest().body(new ErroResponse(erro.getMessage()));
        }
    }

    @GetMapping("/teste")
    public ResponseEntity<String> teste() {
        return ResponseEntity.ok("API do Fluir funcionando");
    }
}