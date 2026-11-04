
package com.fluir.backend.controller;

import com.fluir.backend.config.SecurityConfig;
import com.fluir.backend.dto.OnboardingRequest;
import com.fluir.backend.dto.OnboardingResponse;
import com.fluir.backend.security.FluirSessionFilter;
import com.fluir.backend.service.AuthSessionService;
import com.fluir.backend.service.OnboardingService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OnboardingController.class)
@Import({SecurityConfig.class, FluirSessionFilter.class})
class OnboardingControllerSegurancaTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OnboardingService onboardingService;

    @MockitoBean
    private AuthSessionService authSessionService;

    private String jsonValido(int usuarioId) {
        return """
                {
                  "usuarioId": %d,
                  "nome": "Usuario de Teste",
                  "apelido": "Teste",
                  "pronomes": "ele/dele",
                  "generoNascimento": "masculino",
                  "idade": 18,
                  "tomComunicacao": "amigavel"
                }
                """.formatted(usuarioId);
    }

    @Test
    void devePermitirSalvarProprioOnboarding() throws Exception {
        when(authSessionService.obterUsuarioId("token-a"))
                .thenReturn(1);

        OnboardingResponse resposta = new OnboardingResponse();
        resposta.setUsuarioId(1);

        when(onboardingService.salvar(any(OnboardingRequest.class)))
                .thenReturn(resposta);

        mockMvc.perform(post("/api/onboarding/salvar")
                        .header("Authorization", "Bearer token-a")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonValido(1)))
                .andExpect(status().isOk());

        verify(onboardingService).salvar(
                argThat(request -> Integer.valueOf(1)
                        .equals(request.getUsuarioId()))
        );
    }

    @Test
    void deveBloquearOnboardingDeOutroUsuario() throws Exception {
        when(authSessionService.obterUsuarioId("token-b"))
                .thenReturn(2);

        mockMvc.perform(post("/api/onboarding/salvar")
                        .header("Authorization", "Bearer token-b")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonValido(1)))
                .andExpect(status().isForbidden());

        verifyNoInteractions(onboardingService);
    }

    @Test
    void deveBloquearOnboardingSemAutenticacao() throws Exception {
        mockMvc.perform(post("/api/onboarding/salvar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonValido(1)))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(onboardingService);
    }
}
