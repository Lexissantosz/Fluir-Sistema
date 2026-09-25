package com.fluir.backend.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

import com.fluir.backend.model.SessaoLogin;
import com.fluir.backend.repository.SessaoLoginRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthSessionService {

    private static final Duration DURACAO_SESSAO = Duration.ofHours(12);

    private final SecureRandom secureRandom = new SecureRandom();
    private final SessaoLoginRepository sessaoLoginRepository;

    public AuthSessionService(
            SessaoLoginRepository sessaoLoginRepository
    ) {
        this.sessaoLoginRepository = sessaoLoginRepository;
    }

    @Transactional
    public String criarToken(Integer usuarioId) {
        limparSessoesExpiradas();

        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        String token = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);

        Instant agora = Instant.now();

        SessaoLogin sessao = new SessaoLogin(
                gerarHashToken(token),
                usuarioId,
                agora,
                agora.plus(DURACAO_SESSAO)
        );

        sessaoLoginRepository.save(sessao);

        return token;
    }

    @Transactional
    public Integer obterUsuarioId(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }

        String tokenHash = gerarHashToken(token);

        Optional<SessaoLogin> sessaoOptional =
                sessaoLoginRepository.findById(tokenHash);

        if (sessaoOptional.isEmpty()) {
            return null;
        }

        SessaoLogin sessao = sessaoOptional.get();

        if (sessao.getExpiraEm().isBefore(Instant.now())) {
            sessaoLoginRepository.delete(sessao);
            return null;
        }

        return sessao.getUsuarioId();
    }

    private void limparSessoesExpiradas() {
        sessaoLoginRepository.deleteByExpiraEmBefore(
                Instant.now()
        );
    }

    private String gerarHashToken(String token) {
        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException error) {
            throw new IllegalStateException(
                    "SHA-256 não está disponível.",
                    error
            );
        }
    }
}