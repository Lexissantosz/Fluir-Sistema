package com.fluir.backend.controller;

import com.fluir.backend.dto.OnboardingRequest;
import com.fluir.backend.dto.OnboardingResponse;
import com.fluir.backend.service.OnboardingService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {

    private final OnboardingService onboardingService;

    public OnboardingController(OnboardingService onboardingService) {
        this.onboardingService = onboardingService;
    }

    @PostMapping("/salvar")
    public ResponseEntity<?> salvar(
            @RequestBody OnboardingRequest request,
            Authentication authentication
    ) {
        Integer usuarioAutenticadoId =
                (Integer) authentication.getPrincipal();

        if (!usuarioAutenticadoId.equals(request.getUsuarioId())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Você não pode alterar o onboarding de outro usuário");
        }

        try {
            OnboardingResponse response =
                    onboardingService.salvar(request);

            return ResponseEntity.ok(response);
        } catch (RuntimeException erro) {
            return ResponseEntity.badRequest().body(erro.getMessage());
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> buscarPorUsuario(
            @PathVariable Integer usuarioId,
            Authentication authentication
    ) {
        Integer usuarioAutenticadoId =
                (Integer) authentication.getPrincipal();

        if (!usuarioAutenticadoId.equals(usuarioId)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Você não pode acessar o onboarding de outro usuário");
        }

        try {
            OnboardingResponse response =
                    onboardingService.buscarPorUsuario(usuarioId);

            return ResponseEntity.ok(response);
        } catch (RuntimeException erro) {
            return ResponseEntity.badRequest().body(erro.getMessage());
        }
    }
}