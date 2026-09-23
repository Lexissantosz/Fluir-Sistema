package com.fluir.backend.service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class AuthSessionService {

    private static final Duration DURACAO_SESSAO = Duration.ofHours(12);

    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, Sessao> sessoes = new ConcurrentHashMap<>();

    public String criarToken(Integer usuarioId) {
        limparSessoesExpiradas();

        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        String token = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);

        sessoes.put(
                token,
                new Sessao(
                        usuarioId,
                        Instant.now().plus(DURACAO_SESSAO)
                )
        );

        return token;
    }

    public Integer obterUsuarioId(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }

        Sessao sessao = sessoes.get(token);

        if (sessao == null) {
            return null;
        }

        if (sessao.expiraEm().isBefore(Instant.now())) {
            sessoes.remove(token);
            return null;
        }

        return sessao.usuarioId();
    }

    private void limparSessoesExpiradas() {
        Instant agora = Instant.now();

        sessoes.entrySet().removeIf(
                entry -> entry.getValue().expiraEm().isBefore(agora)
        );
    }

    private record Sessao(
            Integer usuarioId,
            Instant expiraEm
    ) {
    }
}