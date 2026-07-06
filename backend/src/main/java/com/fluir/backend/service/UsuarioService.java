package com.fluir.backend.service;

import com.fluir.backend.dto.CadastroRequest;
import com.fluir.backend.dto.LoginRequest;
import com.fluir.backend.dto.UsuarioResponse;
import com.fluir.backend.model.Usuario;
import com.fluir.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UsuarioResponse cadastrar(CadastroRequest request) {
        String emailNormalizado = request.getEmail().trim().toLowerCase();

        if (usuarioRepository.existsByEmail(emailNormalizado)) {
            throw new RuntimeException("Este e-mail já está cadastrado");
        }

        String senhaCriptografada = passwordEncoder.encode(request.getSenha());

        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome().trim());
        usuario.setEmail(emailNormalizado);
        usuario.setSenha(senhaCriptografada);

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        return UsuarioResponse.fromUsuario(usuarioSalvo, "Usuário cadastrado com sucesso");
    }

    public UsuarioResponse login(LoginRequest request) {
        String emailNormalizado = request.getEmail().trim().toLowerCase();

        Usuario usuario = usuarioRepository.findByEmail(emailNormalizado)
                .orElseThrow(() -> new RuntimeException("E-mail ou senha inválidos"));

        boolean senhaCorreta = passwordEncoder.matches(request.getSenha(), usuario.getSenha());

        if (!senhaCorreta) {
            throw new RuntimeException("E-mail ou senha inválidos");
        }

        return UsuarioResponse.fromUsuario(usuario, "Login realizado com sucesso");
    }
}