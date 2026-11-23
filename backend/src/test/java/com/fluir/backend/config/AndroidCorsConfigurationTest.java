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
    void previewDeAvaliacaoTemOrigemExataAutorizadaSemWildcard() {
        CorsConfigurationSource source = new SecurityConfig().corsConfigurationSource();
        MockHttpServletRequest request = new MockHttpServletRequest("OPTIONS", "/api/usuarios/login");
        CorsConfiguration cors = source.getCorsConfiguration(request);
        assertNotNull(cors);
        assertTrue(cors.getAllowedOrigins().contains(
            "https://fluir-sistema-einry2uxv-lexissantosz.vercel.app"));
        assertTrue(cors.getAllowedOrigins().contains(
            "https://fluir-sistema-git-alex-refino-ux-ia-mobile-19-11-lexissantosz.vercel.app"));
        assertFalse(cors.getAllowedOrigins().contains("*"));
        assertFalse(cors.getAllowCredentials());
    }

    @Test
    void previewsOficiaisAutorizadosMasOutrasContasBloqueadas() {
        CorsConfigurationSource source = new SecurityConfig().corsConfigurationSource();
        MockHttpServletRequest request = new MockHttpServletRequest("OPTIONS", "/api/assistente/chat");
        CorsConfiguration cors = source.getCorsConfiguration(request);
        assertNotNull(cors);
        assertEquals("https://fluir-sistema-git-alex-release-assistente-d-e74a9f-lexissantosz.vercel.app",
            cors.checkOrigin("https://fluir-sistema-git-alex-release-assistente-d-e74a9f-lexissantosz.vercel.app"));
        assertEquals("https://fluir-sistema-git-alex-hotfix-demo-dashboar-c85cea-lexissantosz.vercel.app",
            cors.checkOrigin("https://fluir-sistema-git-alex-hotfix-demo-dashboar-c85cea-lexissantosz.vercel.app"));
        assertNull(cors.checkOrigin("https://projeto-malicioso-outra-conta.vercel.app"));
        assertNull(cors.checkOrigin("https://fluir-sistema-atacante.vercel.app"));
        assertNull(cors.checkOrigin("http://fluir-sistema-git-teste-lexissantosz.vercel.app"));
        assertFalse(cors.getAllowCredentials());
    }

}
