package com.fluir.backend.controller;

import com.fluir.backend.service.AssistenteChatService;
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
public class AssistenteChatController {
    private final AssistenteChatService service;
    public AssistenteChatController(AssistenteChatService service) {
        this.service = service;
    }

    public record MensagemRequest(
        @NotBlank @Size(max=1200) String mensagem
    ) {}

    @PostMapping("/chat")
    public ResponseEntity<?> chat(
        @Valid @RequestBody MensagemRequest request,
        Authentication authentication
    ) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Integer id)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("mensagem", "Faça login para usar a IA generativa."));
        }
        try {
            return ResponseEntity.ok(Map.of(
                "resposta", service.responder(id, request.mensagem()),
                "geradoPorIA", true
            ));
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(Map.of("mensagem",error.getMessage()));
        } catch (IllegalStateException error) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("mensagem",error.getMessage()));
        }
    }
}
