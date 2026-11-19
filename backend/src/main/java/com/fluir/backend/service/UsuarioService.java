package com.fluir.backend.service;

import com.fluir.backend.dto.CadastroRequest;
import com.fluir.backend.dto.LoginRequest;
import com.fluir.backend.dto.UsuarioResponse;
import com.fluir.backend.model.Usuario;
import com.fluir.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthSessionService authSessionService;
    private final GoogleIdentityService googleIdentityService;
    private final SecureRandom secureRandom = new SecureRandom();

    public UsuarioService(
        UsuarioRepository usuarioRepository,
        PasswordEncoder passwordEncoder,
        AuthSessionService authSessionService,
        GoogleIdentityService googleIdentityService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authSessionService = authSessionService;
        this.googleIdentityService = googleIdentityService;
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
        String token = authSessionService.criarToken(usuarioSalvo.getId());

        return UsuarioResponse.fromUsuario(
                usuarioSalvo,
                "Usuário cadastrado com sucesso",
                token
        );
    }

    public UsuarioResponse login(LoginRequest request) {
        String emailNormalizado = request.getEmail().trim().toLowerCase();

        Usuario usuario = usuarioRepository.findByEmail(emailNormalizado)
                .orElseThrow(() -> new RuntimeException("E-mail ou senha inválidos"));

        boolean senhaCorreta = passwordEncoder.matches(request.getSenha(), usuario.getSenha());

        if (!senhaCorreta) {
            throw new RuntimeException("E-mail ou senha inválidos");
        }

        String token = authSessionService.criarToken(usuario.getId());

        return UsuarioResponse.fromUsuario(
                usuario,
                "Login realizado com sucesso",
                token
        );
    }
    public boolean googleEnabled() {
        return googleIdentityService.isEnabled();
    }

    public String googleClientId() {
        return googleIdentityService.publicClientId();
    }

    @Transactional
    public UsuarioResponse loginComGoogle(String idToken) {
        GoogleIdentityService.Identity identidade = googleIdentityService.verify(idToken);

        Usuario usuario = usuarioRepository.findByGoogleSub(identidade.subject())
            .orElseGet(() -> {
                // NUNCA vincular automaticamente por e-mail a uma conta de senha
                // que ainda não passou por verificação de titularidade.
                if (usuarioRepository.existsByEmail(identidade.email())) {
                    throw new IllegalStateException(
                        "Esse e-mail já possui uma conta Fluir. Entre com senha e vincule o Google no perfil."
                    );
                }
                Usuario novo = new Usuario();
                novo.setNome(identidade.name());
                novo.setEmail(identidade.email());
                byte[] randomPassword = new byte[32];
                secureRandom.nextBytes(randomPassword);
                novo.setSenha(passwordEncoder.encode(
                    Base64.getUrlEncoder().withoutPadding().encodeToString(randomPassword)
                ));
                novo.setGoogleSub(identidade.subject());
                return usuarioRepository.save(novo);
            });

        String token = authSessionService.criarToken(usuario.getId());
        UsuarioResponse resposta = UsuarioResponse.fromUsuario(usuario, "Login Google realizado com sucesso", token);
        resposta.setProvedor("google");
        resposta.setEmailVerificado(true);
        return resposta;
    }

    @Transactional
    public UsuarioResponse vincularGoogle(Integer usuarioAutenticadoId, String idToken) {
        GoogleIdentityService.Identity identidade = googleIdentityService.verify(idToken);
        Usuario usuario = usuarioRepository.findById(usuarioAutenticadoId)
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        if (!usuario.getEmail().equalsIgnoreCase(identidade.email())) {
            throw new IllegalArgumentException(
                "O e-mail da conta Google deve ser igual ao e-mail da conta Fluir."
            );
        }
        if (usuario.getGoogleSub() != null &&
            !usuario.getGoogleSub().equals(identidade.subject())) {
            throw new IllegalArgumentException("Outra conta Google já está vinculada.");
        }
        usuarioRepository.findByGoogleSub(identidade.subject()).ifPresent(existente -> {
            if (!existente.getId().equals(usuario.getId())) {
                throw new IllegalArgumentException("Essa conta Google já está em uso.");
            }
        });
        usuario.setGoogleSub(identidade.subject());
        usuarioRepository.save(usuario);
        UsuarioResponse resposta = UsuarioResponse.fromUsuario(usuario, "Conta Google vinculada com sucesso",
                authSessionService.criarToken(usuario.getId()));
        resposta.setProvedor("google");
        resposta.setEmailVerificado(true);
        return resposta;
    }

}