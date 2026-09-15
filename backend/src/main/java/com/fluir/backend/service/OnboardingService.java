package com.fluir.backend.service;

import com.fluir.backend.dto.*;
import com.fluir.backend.model.*;
import com.fluir.backend.repository.*;
import org.springframework.stereotype.Service;

@Service
public class OnboardingService {

    private final UsuarioRepository usuarioRepository;
    private final PerfilUsuarioRepository perfilUsuarioRepository;
    private final ModulosUsuarioRepository modulosUsuarioRepository;
    private final PreferenciasAguaRepository preferenciasAguaRepository;
    private final PreferenciasTarefasRepository preferenciasTarefasRepository;
    private final PreferenciasHabitosRepository preferenciasHabitosRepository;
    private final PreferenciasSonoRepository preferenciasSonoRepository;
    private final PreferenciasFinancasRepository preferenciasFinancasRepository;
    private final PreferenciasDiarioRepository preferenciasDiarioRepository;
    private final PreferenciasAlimentacaoRepository preferenciasAlimentacaoRepository;
    private final TarefaRepository tarefaRepository;
    private final HabitoRepository habitoRepository;
    private final PreferenciasSaudeFisicaRepository preferenciasSaudeFisicaRepository;
    private final PreferenciasCicloMenstrualRepository preferenciasCicloMenstrualRepository;
    private final PreferenciasAnexosRepository preferenciasAnexosRepository;

    public OnboardingService(
            UsuarioRepository usuarioRepository,
            PerfilUsuarioRepository perfilUsuarioRepository,
            ModulosUsuarioRepository modulosUsuarioRepository,
            PreferenciasAguaRepository preferenciasAguaRepository,
            PreferenciasTarefasRepository preferenciasTarefasRepository,
            PreferenciasHabitosRepository preferenciasHabitosRepository,
            PreferenciasSonoRepository preferenciasSonoRepository,
            PreferenciasFinancasRepository preferenciasFinancasRepository,
            PreferenciasDiarioRepository preferenciasDiarioRepository,
            PreferenciasSaudeFisicaRepository preferenciasSaudeFisicaRepository,
            PreferenciasCicloMenstrualRepository preferenciasCicloMenstrualRepository,
            PreferenciasAnexosRepository preferenciasAnexosRepository,
            PreferenciasAlimentacaoRepository preferenciasAlimentacaoRepository,
            TarefaRepository tarefaRepository,
            HabitoRepository habitoRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.perfilUsuarioRepository = perfilUsuarioRepository;
        this.modulosUsuarioRepository = modulosUsuarioRepository;
        this.preferenciasAguaRepository = preferenciasAguaRepository;
        this.preferenciasTarefasRepository = preferenciasTarefasRepository;
        this.preferenciasHabitosRepository = preferenciasHabitosRepository;
        this.preferenciasSonoRepository = preferenciasSonoRepository;
        this.preferenciasFinancasRepository = preferenciasFinancasRepository;
        this.preferenciasDiarioRepository = preferenciasDiarioRepository;
        this.preferenciasAlimentacaoRepository = preferenciasAlimentacaoRepository;
        this.tarefaRepository = tarefaRepository;
        this.habitoRepository = habitoRepository;
        this.preferenciasSaudeFisicaRepository = preferenciasSaudeFisicaRepository;
        this.preferenciasCicloMenstrualRepository = preferenciasCicloMenstrualRepository;
        this.preferenciasAnexosRepository = preferenciasAnexosRepository;
    }

    public OnboardingResponse salvar(OnboardingRequest request) {
        if (request.getUsuarioId() == null) {
            throw new RuntimeException("O usuarioId é obrigatório");
        }

        boolean usuarioExiste = usuarioRepository.existsById(request.getUsuarioId());

        if (!usuarioExiste) {
            throw new RuntimeException("Usuário não encontrado");
        }

        PerfilUsuario perfil = perfilUsuarioRepository.findByUsuario_Id(request.getUsuarioId())
                .orElse(new PerfilUsuario());

        perfil.setUsuarioId(request.getUsuarioId());
        perfil.setNome(request.getNome());
        perfil.setApelido(request.getApelido());
        perfil.setPronomes(request.getPronomes());
        perfil.setGeneroNascimento(request.getGeneroNascimento());
        perfil.setAltura(request.getAltura());
        perfil.setPeso(request.getPeso());
        perfil.setIdade(request.getIdade());
        perfil.setTomComunicacao(request.getTomComunicacao());
        perfil.setEnergiaAtual(request.getEnergiaAtual());
        perfil.setOnboardingConcluido(true);

        perfilUsuarioRepository.save(perfil);

        salvarModulos(request);
        salvarTarefas(request);
        salvarHabitos(request);
        salvarSono(request);
        salvarAgua(request);
        salvarFinancas(request);
        salvarDiario(request);
        salvarAlimentacao(request);
        salvarPrimeiraTarefa(request);
        salvarPrimeiroHabito(request);
        salvarSaudeFisica(request);
        salvarCicloMenstrual(request);
        salvarAnexos(request);

        OnboardingResponse response = buscarPorUsuario(request.getUsuarioId());
        response.setMensagem("Onboarding salvo com sucesso");

        return response;
    }

    public OnboardingResponse buscarPorUsuario(Integer usuarioId) {
        PerfilUsuario perfil = perfilUsuarioRepository.findByUsuario_Id(usuarioId)
                .orElseThrow(() -> new RuntimeException("Onboarding não encontrado para este usuário"));

        OnboardingResponse response = new OnboardingResponse();

        response.setUsuarioId(perfil.getUsuarioId());
        response.setNome(perfil.getNome());
        response.setApelido(perfil.getApelido());
        response.setPronomes(perfil.getPronomes());
        response.setGeneroNascimento(perfil.getGeneroNascimento());
        response.setAltura(perfil.getAltura());
        response.setPeso(perfil.getPeso());
        response.setIdade(perfil.getIdade());
        response.setTomComunicacao(perfil.getTomComunicacao());
        response.setEnergiaAtual(perfil.getEnergiaAtual());
        response.setOnboardingConcluido(perfil.getOnboardingConcluido());

        modulosUsuarioRepository.findByUsuario_Id(usuarioId)
            .ifPresent(modulos -> response.setModulos(converterModulos(modulos)));

        preferenciasAguaRepository.findByUsuario_Id(usuarioId)
            .ifPresent(agua -> response.setAgua(converterAgua(agua)));

        preferenciasTarefasRepository.findByUsuario_Id(usuarioId)
            .ifPresent(tarefas -> response.setTarefas(converterTarefas(tarefas)));

        preferenciasHabitosRepository.findByUsuario_Id(usuarioId)
            .ifPresent(habitos -> response.setHabitos(converterHabitos(habitos)));

        preferenciasSonoRepository.findByUsuario_Id(usuarioId)
            .ifPresent(sono -> response.setSono(converterSono(sono)));

        preferenciasFinancasRepository.findByUsuario_Id(usuarioId)
            .ifPresent(financas -> response.setFinancas(converterFinancas(financas)));

        preferenciasDiarioRepository.findByUsuario_Id(usuarioId)
            .ifPresent(diario -> response.setDiario(converterDiario(diario)));

        preferenciasAlimentacaoRepository.findByUsuario_Id(usuarioId)
            .ifPresent(alimentacao ->
                    response.setAlimentacao(converterAlimentacao(alimentacao)));
        tarefaRepository.findFirstByUsuario_IdAndCategoriaOrderByIdDesc(usuarioId, "Primeira tarefa")
            .ifPresent(tarefa -> response.setPrimeiraTarefa(converterTarefa(tarefa)));

        habitoRepository.findFirstByUsuario_IdAndCategoriaOrderByIdDesc(usuarioId, "Primeiro hábito")
            .ifPresent(habito -> response.setPrimeiroHabito(converterHabito(habito)));

        preferenciasSaudeFisicaRepository.findByUsuario_Id(usuarioId)
            .ifPresent(saudeFisica ->
                    response.setSaudeFisica(converterSaudeFisica(saudeFisica)));

    preferenciasCicloMenstrualRepository.findByUsuario_Id(usuarioId)
            .ifPresent(ciclo ->
                    response.setCicloMenstrual(converterCicloMenstrual(ciclo)));

    preferenciasAnexosRepository.findByUsuario_Id(usuarioId)
            .ifPresent(anexos ->
                    response.setAnexos(converterAnexos(anexos)));
            return response;
        }

    private void salvarModulos(OnboardingRequest request) {
        ModulosRequest modulosRequest = request.getModulos();

        if (modulosRequest == null) {
            return;
        }

        ModulosUsuario modulos = modulosUsuarioRepository.findByUsuario_Id(request.getUsuarioId())
                .orElse(new ModulosUsuario());

        modulos.setUsuarioId(request.getUsuarioId());
        modulos.setTimeline(valorOuPadrao(modulosRequest.getTimeline(), true));
        modulos.setTasks(valorOuPadrao(modulosRequest.getTasks(), false));
        modulos.setHabits(valorOuPadrao(modulosRequest.getHabits(), false));
        modulos.setSleep(valorOuPadrao(modulosRequest.getSleep(), false));
        modulos.setWater(valorOuPadrao(modulosRequest.getWater(), false));
        modulos.setFinances(valorOuPadrao(modulosRequest.getFinances(), false));
        modulos.setDiary(valorOuPadrao(modulosRequest.getDiary(), false));
        modulos.setNutrition(valorOuPadrao(modulosRequest.getNutrition(), false));
        modulos.setPhysicalHealth(valorOuPadrao(modulosRequest.getPhysicalHealth(), false));
        modulos.setMenstrualCycle(valorOuPadrao(modulosRequest.getMenstrualCycle(), false));
        modulos.setAttachments(valorOuPadrao(modulosRequest.getAttachments(), true));

        modulosUsuarioRepository.save(modulos);
    }

    private void salvarAgua(OnboardingRequest request) {
        if (request.getAgua() == null) {
            return;
        }

        PreferenciasAgua agua = preferenciasAguaRepository.findByUsuario_Id(request.getUsuarioId())
                .orElse(new PreferenciasAgua());

        agua.setUsuarioId(request.getUsuarioId());
        agua.setMetaCalculadaMl(request.getAgua().getMetaCalculadaMl());
        agua.setMetaFinalMl(request.getAgua().getMetaFinalMl());
        agua.setModoRegistro(request.getAgua().getModoRegistro());
        agua.setMetaDiaria(request.getAgua().getDailyGoal());
        agua.setUnidade(request.getAgua().getUnit());
        agua.setLembretes(request.getAgua().getReminders());
        agua.setFrequenciaLembrete(request.getAgua().getReminderFrequency());

        preferenciasAguaRepository.save(agua);
    }

    private void salvarPrimeiraTarefa(OnboardingRequest request) {
        if (request.getPrimeiraTarefa() == null) {
            return;
        }

        if (request.getPrimeiraTarefa().getTitulo() == null || request.getPrimeiraTarefa().getTitulo().isBlank()) {
            return;
        }

        Tarefa tarefa = tarefaRepository
                .findFirstByUsuario_IdAndCategoriaOrderByIdDesc(request.getUsuarioId(), "Primeira tarefa")
                .orElse(new Tarefa());

        tarefa.setUsuarioId(request.getUsuarioId());
        tarefa.setTitulo(request.getPrimeiraTarefa().getTitulo());
        tarefa.setCategoria("Primeira tarefa");
        tarefa.setTempoEstimadoMinutos(request.getPrimeiraTarefa().getTempoEstimadoMinutos());
        tarefa.setEnergiaGasta(request.getPrimeiraTarefa().getEnergiaGasta());
        tarefa.setConcluida(false);

        tarefaRepository.save(tarefa);
    }

    private void salvarPrimeiroHabito(OnboardingRequest request) {
        if (request.getPrimeiroHabito() == null) {
            return;
        }

        if (request.getPrimeiroHabito().getTitulo() == null || request.getPrimeiroHabito().getTitulo().isBlank()) {
            return;
        }

        Habito habito = habitoRepository
                .findFirstByUsuario_IdAndCategoriaOrderByIdDesc(request.getUsuarioId(), "Primeiro hábito")
                .orElse(new Habito());

        habito.setUsuarioId(request.getUsuarioId());
        habito.setTitulo(request.getPrimeiroHabito().getTitulo());
        habito.setCategoria("Primeiro hábito");
        habito.setFrequenciaSemanal(request.getPrimeiroHabito().getFrequenciaSemanal());
        habito.setMelhorHorario(request.getPrimeiroHabito().getMelhorHorario());

        habitoRepository.save(habito);
    }

    private void salvarTarefas(OnboardingRequest request) {
    if (request.getTarefas() == null) {
        return;
    }

    PreferenciasTarefas tarefas = preferenciasTarefasRepository
            .findByUsuario_Id(request.getUsuarioId())
            .orElse(new PreferenciasTarefas());

    tarefas.setUsuarioId(request.getUsuarioId());
    tarefas.setVisualizacaoPreferida(request.getTarefas().getPreferredView());
    tarefas.setLembretes(request.getTarefas().getReminders());

    if (request.getTarefas().getCategories() != null) {
        tarefas.setCategorias(String.join(",", request.getTarefas().getCategories()));
    } else {
        tarefas.setCategorias(null);
    }

    preferenciasTarefasRepository.save(tarefas);
    }

    private void salvarHabitos(OnboardingRequest request) {
        if (request.getHabitos() == null) {
            return;
        }

        PreferenciasHabitos habitos = preferenciasHabitosRepository
                .findByUsuario_Id(request.getUsuarioId())
                .orElse(new PreferenciasHabitos());

        habitos.setUsuarioId(request.getUsuarioId());
        habitos.setTipoAcompanhamento(request.getHabitos().getTrackingType());
        habitos.setMetaSemanal(request.getHabitos().getWeeklyGoal());

        if (request.getHabitos().getSelectedHabits() != null) {
            habitos.setHabitosSelecionados(
                    String.join(",", request.getHabitos().getSelectedHabits())
            );
        } else {
            habitos.setHabitosSelecionados(null);
        }

        preferenciasHabitosRepository.save(habitos);
    }

    private void salvarSono(OnboardingRequest request) {
        if (request.getSono() == null) {
            return;
        }

        PreferenciasSono sono = preferenciasSonoRepository
                .findByUsuario_Id(request.getUsuarioId())
                .orElse(new PreferenciasSono());

        sono.setUsuarioId(request.getUsuarioId());
        sono.setMetaSono(request.getSono().getSleepGoal());
        sono.setHorarioDormir(request.getSono().getUsualSleepTime());
        sono.setHorarioAcordar(request.getSono().getUsualWakeTime());
        sono.setRegistrarQualidade(request.getSono().getTrackQuality());
        sono.setDificuldadeDormir(request.getSono().getSleepDifficulty());
        sono.setLembreteDormir(request.getSono().getSleepReminder());

        preferenciasSonoRepository.save(sono);
    }

    private void salvarFinancas(OnboardingRequest request) {
        if (request.getFinancas() == null) {
            return;
        }

        PreferenciasFinancas financas = preferenciasFinancasRepository
                .findByUsuario_Id(request.getUsuarioId())
                .orElse(new PreferenciasFinancas());

        financas.setUsuarioId(request.getUsuarioId());
        financas.setRendaMensal(request.getFinancas().getMonthlyIncome());
        financas.setControlarGastos(request.getFinancas().getTrackExpenses());
        financas.setControlarDividas(request.getFinancas().getTrackDebts());
        financas.setMetaFinanceira(request.getFinancas().getFinancialGoal());

        if (request.getFinancas().getCategories() != null) {
            financas.setCategorias(
                    String.join(",", request.getFinancas().getCategories())
            );
        } else {
            financas.setCategorias(null);
        }

        preferenciasFinancasRepository.save(financas);
    }

    private void salvarDiario(OnboardingRequest request) {
        if (request.getDiario() == null) {
            return;
        }

        PreferenciasDiario diario = preferenciasDiarioRepository
                .findByUsuario_Id(request.getUsuarioId())
                .orElse(new PreferenciasDiario());

        diario.setUsuarioId(request.getUsuarioId());
        diario.setFrequencia(request.getDiario().getFrequency());
        diario.setRegistrarHumor(request.getDiario().getTrackMood());
        diario.setPerguntasReflexivas(request.getDiario().getDailyPrompt());
        diario.setAcompanharEstresse(request.getDiario().getTrackStress());

        preferenciasDiarioRepository.save(diario);
    }

    private void salvarAlimentacao(OnboardingRequest request) {
    if (request.getAlimentacao() == null) {
        return;
    }

    PreferenciasAlimentacao alimentacao = preferenciasAlimentacaoRepository
            .findByUsuario_Id(request.getUsuarioId())
            .orElse(new PreferenciasAlimentacao());

    alimentacao.setUsuarioId(request.getUsuarioId());
    alimentacao.setAltura(request.getAlimentacao().getHeight());
    alimentacao.setPeso(request.getAlimentacao().getWeight());
    alimentacao.setObjetivoAlimentar(request.getAlimentacao().getGoal());
    alimentacao.setRefeicoesPorDia(request.getAlimentacao().getMealsPerDay());
    alimentacao.setRestricoes(request.getAlimentacao().getRestrictions());

    preferenciasAlimentacaoRepository.save(alimentacao);
}

    private Boolean valorOuPadrao(Boolean valor, Boolean padrao) {
        return valor != null ? valor : padrao;
    }

    private ModulosRequest converterModulos(ModulosUsuario modulos) {
        ModulosRequest dto = new ModulosRequest();

        dto.setTimeline(modulos.getTimeline());
        dto.setTasks(modulos.getTasks());
        dto.setHabits(modulos.getHabits());
        dto.setSleep(modulos.getSleep());
        dto.setWater(modulos.getWater());
        dto.setFinances(modulos.getFinances());
        dto.setDiary(modulos.getDiary());
        dto.setNutrition(modulos.getNutrition());
        dto.setPhysicalHealth(modulos.getPhysicalHealth());
        dto.setMenstrualCycle(modulos.getMenstrualCycle());
        dto.setAttachments(modulos.getAttachments());

        return dto;
    }

    private AguaRequest converterAgua(PreferenciasAgua agua) {
        AguaRequest dto = new AguaRequest();

        dto.setMetaCalculadaMl(agua.getMetaCalculadaMl());
        dto.setMetaFinalMl(agua.getMetaFinalMl());
        dto.setModoRegistro(agua.getModoRegistro());
        dto.setDailyGoal(agua.getMetaDiaria());
        dto.setUnit(agua.getUnidade());
        dto.setReminders(agua.getLembretes());
        dto.setReminderFrequency(agua.getFrequenciaLembrete());

        return dto;
    }

    private PreferenciasTarefasRequest converterTarefas(PreferenciasTarefas tarefas) {
        PreferenciasTarefasRequest dto = new PreferenciasTarefasRequest();

        dto.setPreferredView(tarefas.getVisualizacaoPreferida());
        dto.setReminders(tarefas.getLembretes());

        if (tarefas.getCategorias() != null && !tarefas.getCategorias().isBlank()) {
            dto.setCategories(java.util.Arrays.asList(tarefas.getCategorias().split(",")));
        }

        return dto;
    }

    private PreferenciasSonoRequest converterSono(PreferenciasSono sono) {
        PreferenciasSonoRequest dto = new PreferenciasSonoRequest();

        dto.setSleepGoal(sono.getMetaSono());
        dto.setUsualSleepTime(sono.getHorarioDormir());
        dto.setUsualWakeTime(sono.getHorarioAcordar());
        dto.setTrackQuality(sono.getRegistrarQualidade());
        dto.setSleepDifficulty(sono.getDificuldadeDormir());
        dto.setSleepReminder(sono.getLembreteDormir());

        return dto;
    }

    private PreferenciasHabitosRequest converterHabitos(PreferenciasHabitos habitos) {
        PreferenciasHabitosRequest dto = new PreferenciasHabitosRequest();

        dto.setTrackingType(habitos.getTipoAcompanhamento());
        dto.setWeeklyGoal(habitos.getMetaSemanal());

        if (habitos.getHabitosSelecionados() != null
                && !habitos.getHabitosSelecionados().isBlank()) {
            dto.setSelectedHabits(
                    java.util.Arrays.asList(habitos.getHabitosSelecionados().split(","))
            );
        }

        return dto;
    }

    private PrimeiraTarefaRequest converterTarefa(Tarefa tarefa) {
        PrimeiraTarefaRequest dto = new PrimeiraTarefaRequest();

        dto.setTitulo(tarefa.getTitulo());
        dto.setTempoEstimadoMinutos(tarefa.getTempoEstimadoMinutos());
        dto.setEnergiaGasta(tarefa.getEnergiaGasta());

        return dto;
    }

    private PrimeiroHabitoRequest converterHabito(Habito habito) {
        PrimeiroHabitoRequest dto = new PrimeiroHabitoRequest();

        dto.setTitulo(habito.getTitulo());
        dto.setFrequenciaSemanal(habito.getFrequenciaSemanal());
        dto.setMelhorHorario(habito.getMelhorHorario());

        return dto;
    }


    private PreferenciasFinancasRequest converterFinancas(PreferenciasFinancas financas) {
        PreferenciasFinancasRequest dto = new PreferenciasFinancasRequest();

        dto.setMonthlyIncome(financas.getRendaMensal());
        dto.setTrackExpenses(financas.getControlarGastos());
        dto.setTrackDebts(financas.getControlarDividas());
        dto.setFinancialGoal(financas.getMetaFinanceira());

        if (financas.getCategorias() != null && !financas.getCategorias().isBlank()) {
            dto.setCategories(
                    java.util.Arrays.asList(financas.getCategorias().split(","))
            );
        }

        return dto;
    }

    private PreferenciasDiarioRequest converterDiario(PreferenciasDiario diario) {
        PreferenciasDiarioRequest dto = new PreferenciasDiarioRequest();

        dto.setFrequency(diario.getFrequencia());
        dto.setTrackMood(diario.getRegistrarHumor());
        dto.setDailyPrompt(diario.getPerguntasReflexivas());
        dto.setTrackStress(diario.getAcompanharEstresse());

        return dto;
    }

    private PreferenciasAlimentacaoRequest converterAlimentacao(
            PreferenciasAlimentacao alimentacao
    ) {
        PreferenciasAlimentacaoRequest dto =
                new PreferenciasAlimentacaoRequest();

        dto.setHeight(alimentacao.getAltura());
        dto.setWeight(alimentacao.getPeso());
        dto.setGoal(alimentacao.getObjetivoAlimentar());
        dto.setMealsPerDay(alimentacao.getRefeicoesPorDia());
        dto.setRestrictions(alimentacao.getRestricoes());

        return dto;
    }

    private void salvarSaudeFisica(OnboardingRequest request) {
    if (request.getSaudeFisica() == null) {
        return;
    }

    PreferenciasSaudeFisica saudeFisica = preferenciasSaudeFisicaRepository
            .findByUsuario_Id(request.getUsuarioId())
            .orElse(new PreferenciasSaudeFisica());

    saudeFisica.setUsuarioId(request.getUsuarioId());
    saudeFisica.setPraticaAtividade(request.getSaudeFisica().getExercises());
    saudeFisica.setFrequenciaSemanal(request.getSaudeFisica().getWeeklyFrequency());
    saudeFisica.setTipoTreino(request.getSaudeFisica().getTrainingType());
    saudeFisica.setRegistrarDorEnergia(request.getSaudeFisica().getTrackPainEnergy());
    saudeFisica.setLimitacoes(request.getSaudeFisica().getLimitations());

    preferenciasSaudeFisicaRepository.save(saudeFisica);
}

private void salvarCicloMenstrual(OnboardingRequest request) {
    if (request.getCicloMenstrual() == null) {
        return;
    }

    PreferenciasCicloMenstrual ciclo = preferenciasCicloMenstrualRepository
            .findByUsuario_Id(request.getUsuarioId())
            .orElse(new PreferenciasCicloMenstrual());

    ciclo.setUsuarioId(request.getUsuarioId());
    ciclo.setMenstruaAtualmente(request.getCicloMenstrual().getCurrentlyMenstruates());
    ciclo.setCicloRegular(request.getCicloMenstrual().getRegularCycle());
    ciclo.setDataUltimaMenstruacao(request.getCicloMenstrual().getLastPeriodDate());
    ciclo.setDuracaoCiclo(request.getCicloMenstrual().getCycleLength());
    ciclo.setDuracaoSangramento(request.getCicloMenstrual().getBleedingLength());
    ciclo.setColicas(request.getCicloMenstrual().getCramps());
    ciclo.setGravida(request.getCicloMenstrual().getPregnant());
    ciclo.setAmamentando(request.getCicloMenstrual().getBreastfeeding());
    ciclo.setMetodoHormonal(request.getCicloMenstrual().getHormonalMethod());
    ciclo.setLembretes(request.getCicloMenstrual().getReminders());

    if (request.getCicloMenstrual().getSymptoms() != null) {
        ciclo.setSintomas(String.join(",", request.getCicloMenstrual().getSymptoms()));
    } else {
        ciclo.setSintomas(null);
    }

    preferenciasCicloMenstrualRepository.save(ciclo);
}

private void salvarAnexos(OnboardingRequest request) {
    if (request.getAnexos() == null) {
        return;
    }

    PreferenciasAnexos anexos = preferenciasAnexosRepository
            .findByUsuario_Id(request.getUsuarioId())
            .orElse(new PreferenciasAnexos());

    anexos.setUsuarioId(request.getUsuarioId());

    if (request.getAnexos().getFileTypes() != null) {
        anexos.setTiposArquivo(String.join(",", request.getAnexos().getFileTypes()));
    } else {
        anexos.setTiposArquivo(null);
    }

    if (request.getAnexos().getLinkToModules() != null) {
        anexos.setVincularModulos(String.join(",", request.getAnexos().getLinkToModules()));
    } else {
        anexos.setVincularModulos(null);
    }

    preferenciasAnexosRepository.save(anexos);
}

private PreferenciasSaudeFisicaRequest converterSaudeFisica(
        PreferenciasSaudeFisica saudeFisica
) {
    PreferenciasSaudeFisicaRequest dto =
            new PreferenciasSaudeFisicaRequest();

    dto.setExercises(saudeFisica.getPraticaAtividade());
    dto.setWeeklyFrequency(saudeFisica.getFrequenciaSemanal());
    dto.setTrainingType(saudeFisica.getTipoTreino());
    dto.setTrackPainEnergy(saudeFisica.getRegistrarDorEnergia());
    dto.setLimitations(saudeFisica.getLimitacoes());

    return dto;
}

private PreferenciasCicloMenstrualRequest converterCicloMenstrual(
        PreferenciasCicloMenstrual ciclo
) {
    PreferenciasCicloMenstrualRequest dto =
            new PreferenciasCicloMenstrualRequest();

    dto.setCurrentlyMenstruates(ciclo.getMenstruaAtualmente());
    dto.setRegularCycle(ciclo.getCicloRegular());
    dto.setLastPeriodDate(ciclo.getDataUltimaMenstruacao());
    dto.setCycleLength(ciclo.getDuracaoCiclo());
    dto.setBleedingLength(ciclo.getDuracaoSangramento());
    dto.setCramps(ciclo.getColicas());
    dto.setPregnant(ciclo.getGravida());
    dto.setBreastfeeding(ciclo.getAmamentando());
    dto.setHormonalMethod(ciclo.getMetodoHormonal());
    dto.setReminders(ciclo.getLembretes());

    if (ciclo.getSintomas() != null && !ciclo.getSintomas().isBlank()) {
        dto.setSymptoms(
                java.util.Arrays.asList(ciclo.getSintomas().split(","))
        );
    }

    return dto;
}

private PreferenciasAnexosRequest converterAnexos(
        PreferenciasAnexos anexos
) {
    PreferenciasAnexosRequest dto = new PreferenciasAnexosRequest();

    if (anexos.getTiposArquivo() != null && !anexos.getTiposArquivo().isBlank()) {
        dto.setFileTypes(
                java.util.Arrays.asList(anexos.getTiposArquivo().split(","))
        );
    }

    if (anexos.getVincularModulos() != null
            && !anexos.getVincularModulos().isBlank()) {
        dto.setLinkToModules(
                java.util.Arrays.asList(anexos.getVincularModulos().split(","))
        );
    }

    return dto;
}

}