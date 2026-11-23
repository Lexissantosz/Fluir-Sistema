package com.fluir.backend.config;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import static org.junit.jupiter.api.Assertions.*;

class AndroidCorsConfigurationTest {
    @Test
    void webViewDoAndroidTemOrigemAutorizada() {
        CorsConfigurationSource source = new SecurityConfig().corsConfigurationSource();
        MockHttpServletRequest request = new MockHttpServletRequest("OPTIONS", "/api/usuarios/login");
        CorsConfiguration cors = source.getCorsConfiguration(request);
        assertNotNull(cors);
        assertTrue(cors.getAllowedOrigins().contains("https://localhost"));
        assertTrue(cors.getAllowedMethods().contains("POST"));
        assertTrue(cors.getAllowedMethods().contains("OPTIONS"));
        assertTrue(cors.getAllowedHeaders().contains("*"));
    }
    @Test
    void previewDeAvaliacaoTemOrigemAutorizadaSemWildcardGlobal() {
        CorsConfigurationSource source = new SecurityConfig().corsConfigurationSource();
        MockHttpServletRequest request = new MockHttpServletRequest("OPTIONS", "/api/onboarding/salvar");
        CorsConfiguration cors = source.getCorsConfiguration(request);
        assertNotNull(cors);
        assertTrue(cors.getAllowedOrigins().contains(
            "https://fluir-sistema-einry2uxv-lexissantosz.vercel.app"));
        assertFalse(cors.getAllowedOrigins().contains("*"));
        assertFalse(cors.getAllowCredentials());
    }

    @Test
    void previewsDeBranchesNovasTemAcessoAoBackendSemLiberarOutrosSites() {
        CorsConfiguration cors = new SecurityConfig().corsConfigurationSource()
            .getCorsConfiguration(new MockHttpServletRequest("OPTIONS", "/api/onboarding/salvar"));
        assertNotNull(cors);
        String branch = "https://fluir-sistema-git-alex-onboarding-planos-personalizados-22-11-lexissantosz.vercel.app";
        String preview = "https://fluir-sistema-git-alex-corrige-sessao-onboa-b0c120-lexissantosz.vercel.app";
        assertEquals(branch, cors.checkOrigin(branch));
        assertEquals(preview, cors.checkOrigin(preview));
        assertEquals("https://fluir-sistema.vercel.app", cors.checkOrigin("https://fluir-sistema.vercel.app"));
        assertNull(cors.checkOrigin("https://evil.vercel.app"));
        assertNull(cors.checkOrigin("https://fluir-sistema-git-branch-other-account.vercel.app"));
        assertNull(cors.checkOrigin("https://fluir-sistema-git-branch-lexissantosz.vercel.app.evil.example"));
    }

    @Test
    void QAIsoladoFuncionaEmAmbasOrigensLocaisSemAbrirQualquerPorta() {
        CorsConfiguration cors = new SecurityConfig().corsConfigurationSource()
            .getCorsConfiguration(new MockHttpServletRequest("OPTIONS", "/api/onboarding/salvar"));
        assertNotNull(cors);
        assertEquals("http://localhost:5505", cors.checkOrigin("http://localhost:5505"));
        assertEquals("http://127.0.0.1:5505", cors.checkOrigin("http://127.0.0.1:5505"));
        assertNull(cors.checkOrigin("http://localhost:8888"));
        assertNull(cors.checkOrigin("http://192.168.0.3:5505"));
    }

}
