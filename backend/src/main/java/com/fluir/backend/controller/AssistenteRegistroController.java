package com.fluir.backend.controller;

import com.fluir.backend.service.AssistenteRegistroService;
import com.fluir.backend.service.AssistenteRegistroService.SolicitarRegistro;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistente/registros")
public class AssistenteRegistroController {
    private final AssistenteRegistroService service;
    public AssistenteRegistroController(AssistenteRegistroService service) {
        this.service=service;
    }

    private Integer usuarioId(Authentication auth) {
        return auth != null && auth.getPrincipal() instanceof Integer id ? id : null;
    }

    @GetMapping
    public ResponseEntity<?> listar(Authentication authentication) {
        Integer id=usuarioId(authentication);
        if(id==null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("mensagem","Entre na sua conta para consultar registros."));
        return ResponseEntity.ok(service.listar(id));
    }

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody SolicitarRegistro input,
                                       Authentication authentication) {
        Integer id=usuarioId(authentication);
        if(id==null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("mensagem","É necessário estar autenticado."));
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(service.registrar(id,input));
        } catch(IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("mensagem",ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id, Authentication authentication) {
        Integer owner=usuarioId(authentication);
        if(owner==null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("mensagem","É necessário estar autenticado."));
        return service.excluir(owner,id) ?
            ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
