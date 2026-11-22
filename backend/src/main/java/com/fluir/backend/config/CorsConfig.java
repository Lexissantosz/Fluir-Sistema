package com.fluir.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer configurarCors() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(
                            "http://127.0.0.1:5500",
                            "http://localhost:5500",
                            "http://localhost:5173",
                            "https://lexissantosz.github.io",
                            "https://fluir-sistema.vercel.app",
                            "https://fluir-sistema-einry2uxv-lexissantosz.vercel.app",
                            "https://fluir-sistema-git-alex-refino-ux-ia-mobile-19-11-lexissantosz.vercel.app",
                            "https://localhost", // Capacitor Android
                            "http://localhost"
                        )
                        
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}