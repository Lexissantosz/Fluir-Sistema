package com.fluir.backend.controller;

import com.fluir.backend.dto.OnboardingRequest;
import com.fluir.backend.dto.OnboardingResponse;
import com.fluir.backend.service.OnboardingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/onboarding")
@CrossOrigin(origins = "*")
public class OnboardingController {

    private final OnboardingService onboardingService;

    public OnboardingController(OnboardingService onboardingService) {
        this.onboardingService = onboardingService;
    }

    @PostMapping("/salvar")
    public ResponseEntity<?> salvar(@RequestBody OnboardingRequest request) {
        try {
            OnboardingResponse response = onboardingService.salvar(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException erro) {
            return ResponseEntity.badRequest().body(erro.getMessage());
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> buscarPorUsuario(@PathVariable Integer usuarioId) {
        try {
            OnboardingResponse response = onboardingService.buscarPorUsuario(usuarioId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException erro) {
            return ResponseEntity.badRequest().body(erro.getMessage());
        }
    }
}