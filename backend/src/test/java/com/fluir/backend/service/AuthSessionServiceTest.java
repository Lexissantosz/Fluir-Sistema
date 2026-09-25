package com.fluir.backend.service;

import com.fluir.backend.model.SessaoLogin;
import com.fluir.backend.repository.SessaoLoginRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthSessionServiceTest {

    @Mock
    private SessaoLoginRepository sessaoLoginRepository;

    @InjectMocks
    private AuthSessionService authSessionService;

    @Test
    void deveCriarESalvarSessaoPersistida() {
        String token = authSessionService.criarToken(1);

        assertNotNull(token);
        assertFalse(token.isBlank());

        ArgumentCaptor<SessaoLogin> captor =
                ArgumentCaptor.forClass(SessaoLogin.class);

        verify(sessaoLoginRepository)
                .save(captor.capture());

        SessaoLogin sessaoSalva = captor.getValue();

        assertEquals(1, sessaoSalva.getUsuarioId());
        assertNotNull(sessaoSalva.getCriadoEm());
        assertNotNull(sessaoSalva.getExpiraEm());

        assertTrue(
                sessaoSalva.getExpiraEm()
                        .isAfter(sessaoSalva.getCriadoEm())
        );

        assertNotNull(sessaoSalva.getTokenHash());
        assertEquals(64, sessaoSalva.getTokenHash().length());

        assertNotEquals(
                token,
                sessaoSalva.getTokenHash()
        );

        verify(sessaoLoginRepository)
                .deleteByExpiraEmBefore(any(Instant.class));
    }

    @Test
    void deveRetornarUsuarioQuandoTokenForValido() {
        SessaoLogin sessao = new SessaoLogin(
                "hash",
                42,
                Instant.now().minusSeconds(60),
                Instant.now().plusSeconds(3600)
        );

        when(sessaoLoginRepository.findById(anyString()))
                .thenReturn(Optional.of(sessao));

        Integer usuarioId =
                authSessionService.obterUsuarioId("token-valido");

        assertEquals(42, usuarioId);

        verify(sessaoLoginRepository)
                .findById(anyString());

        verify(sessaoLoginRepository, never())
                .delete(any());
    }

    @Test
    void deveRetornarNullQuandoTokenNaoExistir() {
        when(sessaoLoginRepository.findById(anyString()))
                .thenReturn(Optional.empty());

        Integer usuarioId =
                authSessionService.obterUsuarioId("token-inexistente");

        assertNull(usuarioId);

        verify(sessaoLoginRepository)
                .findById(anyString());

        verify(sessaoLoginRepository, never())
                .delete(any());
    }

    @Test
    void deveExcluirSessaoExpirada() {
        SessaoLogin sessaoExpirada = new SessaoLogin(
                "hash",
                7,
                Instant.now().minusSeconds(7200),
                Instant.now().minusSeconds(60)
        );

        when(sessaoLoginRepository.findById(anyString()))
                .thenReturn(Optional.of(sessaoExpirada));

        Integer usuarioId =
                authSessionService.obterUsuarioId("token-expirado");

        assertNull(usuarioId);

        verify(sessaoLoginRepository)
                .delete(sessaoExpirada);
    }
}