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

}
