package com.fluir.backend.service;

import com.fluir.backend.dto.*;
import com.fluir.backend.model.*;
import com.fluir.backend.repository.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import org.mockito.ArgumentCaptor;

@ExtendWith(MockitoExtension.class)
class OnboardingServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PerfilUsuarioRepository perfilUsuarioRepository;

    @Mock
    private ModulosUsuarioRepository modulosUsuarioRepository;

    @Mock
    private PreferenciasAguaRepository preferenciasAguaRepository;

    @Mock
    private PreferenciasTarefasRepository preferenciasTarefasRepository;

    @Mock
    private PreferenciasHabitosRepository preferenciasHabitosRepository;

    @Mock
    private PreferenciasSonoRepository preferenciasSonoRepository;

    @Mock
    private PreferenciasFinancasRepository preferenciasFinancasRepository;

    @Mock
    private PreferenciasDiarioRepository preferenciasDiarioRepository;

    @Mock
    private PreferenciasAlimentacaoRepository preferenciasAlimentacaoRepository;

    @Mock
    private TarefaRepository tarefaRepository;

    @Mock
    private HabitoRepository habitoRepository;

    @Mock
    private PreferenciasSaudeFisicaRepository preferenciasSaudeFisicaRepository;

    @Mock
    private PreferenciasCicloMenstrualRepository preferenciasCicloMenstrualRepository;

    @Mock
    private PreferenciasAnexosRepository preferenciasAnexosRepository;

    @InjectMocks
    private OnboardingService onboardingService;

    @Test
    void deveFalharQuandoUsuarioIdNaoForInformado() {
        OnboardingRequest request = new OnboardingRequest();

        RuntimeException erro = assertThrows(
                RuntimeException.class,
                () -> onboardingService.salvar(request)
        );

        assertEquals("O usuarioId é obrigatório", erro.getMessage());

        verifyNoInteractions(usuarioRepository);
        verifyNoInteractions(perfilUsuarioRepository);
    }

    @Test
    void deveFalharQuandoUsuarioNaoExistir() {
        OnboardingRequest request = new OnboardingRequest();
        request.setUsuarioId(99);

        when(usuarioRepository.existsById(99))
                .thenReturn(false);

        RuntimeException erro = assertThrows(
                RuntimeException.class,
                () -> onboardingService.salvar(request)
        );

        assertEquals("Usuário não encontrado", erro.getMessage());

        verify(usuarioRepository).existsById(99);
        verify(perfilUsuarioRepository, never()).save(any());
    }

    @Test
void deveSalvarPreferenciasComplexasDoOnboarding() {
    OnboardingRequest request = new OnboardingRequest();

    request.setUsuarioId(1);
    request.setNome("Alex");

    PreferenciasTarefasRequest tarefas = new PreferenciasTarefasRequest();
    tarefas.setPreferredView("lista");
    tarefas.setReminders("sim");
    tarefas.setCategories(java.util.List.of("Estudos", "Casa"));
    request.setTarefas(tarefas);

    PreferenciasCicloMenstrualRequest ciclo = new PreferenciasCicloMenstrualRequest();
    ciclo.setCurrentlyMenstruates("sim");
    ciclo.setRegularCycle("sim");
    ciclo.setSymptoms(java.util.List.of("Cólicas", "Cansaço"));
    request.setCicloMenstrual(ciclo);

    PreferenciasAnexosRequest anexos = new PreferenciasAnexosRequest();
    anexos.setFileTypes(java.util.List.of("imagem", "pdf"));
    anexos.setLinkToModules(java.util.List.of("diario", "saude"));
    request.setAnexos(anexos);

    PerfilUsuario perfil = new PerfilUsuario();
    perfil.setUsuarioId(1);

    when(usuarioRepository.existsById(1))
            .thenReturn(true);

    when(perfilUsuarioRepository.findByUsuario_Id(1))
            .thenReturn(Optional.of(perfil));

    onboardingService.salvar(request);

    ArgumentCaptor<PreferenciasTarefas> captorTarefas =
            ArgumentCaptor.forClass(PreferenciasTarefas.class);

    ArgumentCaptor<PreferenciasCicloMenstrual> captorCiclo =
            ArgumentCaptor.forClass(PreferenciasCicloMenstrual.class);

    ArgumentCaptor<PreferenciasAnexos> captorAnexos =
            ArgumentCaptor.forClass(PreferenciasAnexos.class);

    verify(preferenciasTarefasRepository)
            .save(captorTarefas.capture());

    verify(preferenciasCicloMenstrualRepository)
            .save(captorCiclo.capture());

    verify(preferenciasAnexosRepository)
            .save(captorAnexos.capture());

    PreferenciasTarefas tarefasSalvas = captorTarefas.getValue();
    assertEquals("lista", tarefasSalvas.getVisualizacaoPreferida());
    assertEquals("sim", tarefasSalvas.getLembretes());
    assertEquals("Estudos,Casa", tarefasSalvas.getCategorias());

    PreferenciasCicloMenstrual cicloSalvo = captorCiclo.getValue();
    assertEquals("sim", cicloSalvo.getMenstruaAtualmente());
    assertEquals("sim", cicloSalvo.getCicloRegular());
    assertEquals("Cólicas,Cansaço", cicloSalvo.getSintomas());

    PreferenciasAnexos anexosSalvos = captorAnexos.getValue();
    assertEquals("imagem,pdf", anexosSalvos.getTiposArquivo());
    assertEquals("diario,saude", anexosSalvos.getVincularModulos());
}

    @Test
    void deveSalvarPerfilBasicoEConcluirOnboarding() {
        OnboardingRequest request = new OnboardingRequest();

        request.setUsuarioId(1);
        request.setNome("Alex");
        request.setApelido("Lex");
        request.setIdade(18);
        request.setTomComunicacao("amigavel");
        request.setEnergiaAtual("media");

        PerfilUsuario perfil = new PerfilUsuario();
        perfil.setUsuarioId(1);

        when(usuarioRepository.existsById(1))
                .thenReturn(true);

        when(perfilUsuarioRepository.findByUsuario_Id(1))
                .thenReturn(Optional.of(perfil));

        OnboardingResponse response = onboardingService.salvar(request);

        assertNotNull(response);

        assertEquals(1, response.getUsuarioId());
        assertEquals("Alex", response.getNome());
        assertEquals("Lex", response.getApelido());
        assertEquals(18, response.getIdade());
        assertEquals("amigavel", response.getTomComunicacao());

        assertTrue(response.getOnboardingConcluido());

        assertEquals(
                "Onboarding salvo com sucesso",
                response.getMensagem()
        );

        assertEquals("Alex", perfil.getNome());
        assertEquals("Lex", perfil.getApelido());
        assertEquals(18, perfil.getIdade());

        assertTrue(perfil.getOnboardingConcluido());

        verify(perfilUsuarioRepository).save(perfil);
    }

    @Test
    void deveFalharAoBuscarOnboardingInexistente() {
        when(perfilUsuarioRepository.findByUsuario_Id(10))
                .thenReturn(Optional.empty());

        RuntimeException erro = assertThrows(
                RuntimeException.class,
                () -> onboardingService.buscarPorUsuario(10)
        );

        assertEquals(
                "Onboarding não encontrado para este usuário",
                erro.getMessage()
        );
    }
}