package com.fluir.backend.service;

import com.fluir.backend.dto.*;
import com.fluir.backend.model.Usuario;
import com.fluir.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceQaMockitoTest {
    @Mock UsuarioRepository usuarios;
    @Mock PasswordEncoder encoder;
    @Mock AuthSessionService sessoes;
    @InjectMocks UsuarioService service;

    @Test void ct006RecusaSenhaIncorreta() {
        Usuario u = new Usuario(); u.setId(1);u.setEmail("qa@example.com");u.setSenha("hash");
        when(usuarios.findByEmail("qa@example.com")).thenReturn(Optional.of(u));
        when(encoder.matches("errada","hash")).thenReturn(false);
        LoginRequest req = new LoginRequest();req.setEmail("qa@example.com");req.setSenha("errada");
        assertThrows(RuntimeException.class, () -> service.login(req));
        verifyNoInteractions(sessoes);
    }
    @Test void ct009RecusaEmailDuplicado() {
        when(usuarios.existsByEmail("qa@example.com")).thenReturn(true);
        CadastroRequest req = new CadastroRequest();req.setNome("Pessoa QA");req.setEmail("QA@example.com");req.setSenha("Teste123!");
        assertThrows(RuntimeException.class, () -> service.cadastrar(req));
        verify(usuarios,never()).save(any());
        verifyNoInteractions(sessoes);
    }
    @Test void ct005LoginValidoGeraToken() {
        Usuario u = new Usuario();u.setId(1);u.setNome("Pessoa QA");u.setEmail("qa@example.com");u.setSenha("hash");
        when(usuarios.findByEmail("qa@example.com")).thenReturn(Optional.of(u));
        when(encoder.matches("certa","hash")).thenReturn(true);
        when(sessoes.criarToken(1)).thenReturn("token-ficticio");
        LoginRequest req = new LoginRequest();req.setEmail("qa@example.com");req.setSenha("certa");
        UsuarioResponse r = service.login(req);
        assertEquals(1,r.getId());assertEquals("token-ficticio",r.getToken());
        verify(sessoes).criarToken(1);
    }
}
