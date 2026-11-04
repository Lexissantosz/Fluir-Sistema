
package com.fluir.backend.config;

import com.fluir.backend.controller.UsuarioController;
import com.fluir.backend.security.FluirSessionFilter;
import com.fluir.backend.service.AuthSessionService;
import com.fluir.backend.service.UsuarioService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UsuarioController.class)
@Import({SecurityConfig.class, FluirSessionFilter.class})
class SecurityConfigRotasTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UsuarioService usuarioService;

    @MockitoBean
    private AuthSessionService authSessionService;

    @Test
    void devePermitirRotaPublicaDeDiagnostico() throws Exception {
        mockMvc.perform(get("/api/usuarios/teste"))
                .andExpect(status().isOk());
    }

    @Test
    void devePermitirRequisicaoPublicaDeLogin() throws Exception {
        mockMvc.perform(post("/api/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void devePermitirRequisicaoPublicaDeCadastro() throws Exception {
        mockMvc.perform(post("/api/usuarios/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveBloquearTarefasSemAutenticacao() throws Exception {
        mockMvc.perform(get("/api/tarefas/usuario/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deveBloquearRotaNaoAutorizadaMesmoComToken()
            throws Exception {

        when(authSessionService.obterUsuarioId("qa-token"))
                .thenReturn(1);

        mockMvc.perform(get("/api/usuarios/rota-inexistente")
                        .header("Authorization", "Bearer qa-token"))
                .andExpect(status().isForbidden());
    }
}
