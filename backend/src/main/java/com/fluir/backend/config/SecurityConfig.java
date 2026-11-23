package com.fluir.backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.fluir.backend.security.FluirSessionFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "https://fluir-sistema.vercel.app",
                // Preview QA privado e alias estavel desta branch, sem origens wildcard.
                "https://fluir-sistema-einry2uxv-lexissantosz.vercel.app",
                "https://fluir-sistema-git-alex-refino-ux-ia-mobile-19-11-lexissantosz.vercel.app",
                "http://127.0.0.1:5500",
                "http://localhost:5500",
                "https://localhost", // Capacitor Android
                "http://localhost"
        ));
        // Prévia QA apenas do projeto Fluir (não libera outros projetos Vercel).
        configuration.setAllowedOriginPatterns(List.of(
                "https://fluir-sistema-git-*-lexissantosz.vercel.app",
                "https://fluir-sistema-*-lexissantosz.vercel.app"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(false);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
        HttpSecurity http,
        CorsConfigurationSource corsConfigurationSource,
        FluirSessionFilter fluirSessionFilter
) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource)
                )

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/health/**").permitAll()
                        .requestMatchers("/api/usuarios/google/vincular").authenticated()
                        .requestMatchers("/api/usuarios/**").permitAll()
                        .requestMatchers("/api/onboarding/**").authenticated()
                        .requestMatchers("/api/assistente/**").authenticated()
                        .requestMatchers("/api/tarefas/**").authenticated()
                        .anyRequest().permitAll()
                )

                .addFilterBefore(
                        fluirSessionFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}