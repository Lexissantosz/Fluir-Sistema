package com.fluir.backend.controller;

import com.fluir.backend.service.AssistenteInterpretacaoService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistente")
public class AssistenteInterpretacaoController {
    private final AssistenteInterpretacaoService service;
    public AssistenteInterpretacaoController(AssistenteInterpretacaoService service) {
        this.service=service;
    }
    public record Mensagem(@NotBlank @Size(max=1200) String mensagem) {}

    @PostMapping("/interpretar")
    public ResponseEntity<?> interpretar(
            @Valid @RequestBody Mensagem req,
            Authentication authentication) {
        if(authentication==null||!(authentication.getPrincipal() instanceof Integer id)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("mensagem","Faça login antes de usar a IA."));
        }
        try{
            return ResponseEntity.ok(service.interpretar(id,req.mensagem()));
        }catch(IllegalArgumentException erro){
            return ResponseEntity.badRequest().body(Map.of("mensagem",erro.getMessage()));
        }catch(IllegalStateException erro){
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("mensagem",erro.getMessage()));
        }
    }
}
