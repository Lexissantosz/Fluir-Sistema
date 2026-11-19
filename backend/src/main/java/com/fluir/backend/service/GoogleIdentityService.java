package com.fluir.backend.service;

import java.time.Instant;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;

@Service
public class GoogleIdentityService {
    private static final Set<String> ISSUERS = Set.of(
        "accounts.google.com", "https://accounts.google.com"
    );

    private final String clientId;
    private final NimbusJwtDecoder jwtDecoder;

    public record Identity(String subject, String email, String name) {}

    public GoogleIdentityService(@Value("${FLUIR_GOOGLE_CLIENT_ID:}") String clientId) {
        this.clientId = clientId == null ? "" : clientId.trim();
        this.jwtDecoder = NimbusJwtDecoder
            .withJwkSetUri("https://www.googleapis.com/oauth2/v3/certs")
            .build();
        this.jwtDecoder.setJwtValidator(new JwtTimestampValidator());
    }

    public boolean isEnabled() {
        return !clientId.isBlank();
    }

    public String publicClientId() {
        return clientId;
    }

    public Identity verify(String idToken) {
        if (!isEnabled()) {
            throw new IllegalStateException("Login com Google ainda não está configurado.");
        }
        if (idToken == null || idToken.isBlank() || idToken.length() > 8192) {
            throw new IllegalArgumentException("Credencial do Google inválida.");
        }
        try {
            Jwt jwt = jwtDecoder.decode(idToken);
            String issuer = jwt.getIssuer() == null ? "" : jwt.getIssuer().toString();
            if (!ISSUERS.contains(issuer) || !jwt.getAudience().contains(clientId)) {
                throw new IllegalArgumentException("Credencial do Google não pertence ao Fluir.");
            }
            if (jwt.getExpiresAt() == null || !Instant.now().isBefore(jwt.getExpiresAt())) {
                throw new IllegalArgumentException("Credencial do Google expirada.");
            }
            if (!Boolean.TRUE.equals(jwt.getClaim("email_verified"))) {
                throw new IllegalArgumentException("O e-mail do Google precisa estar verificado.");
            }
            String subject = jwt.getSubject();
            String email = jwt.getClaimAsString("email");
            String name = jwt.getClaimAsString("name");
            if (subject == null || subject.isBlank() || subject.length() > 255
                    || email == null || email.isBlank() || email.length() > 120
                    || !email.contains("@")) {
                throw new IllegalArgumentException("Dados de identidade incompletos.");
            }
            String safeName = (name == null || name.isBlank()) ? "Usuário" : name.trim();
            if (safeName.length() > 100) safeName = safeName.substring(0, 100);
            return new Identity(subject, email.trim().toLowerCase(java.util.Locale.ROOT), safeName);
        } catch (JwtException error) {
            throw new IllegalArgumentException("Credencial do Google inválida.");
        }
    }
}
