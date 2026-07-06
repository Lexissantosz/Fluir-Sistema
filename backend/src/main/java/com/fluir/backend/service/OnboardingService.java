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
    private final TarefaRepository tarefaRepository;
    private final HabitoRepository habitoRepository;

    public OnboardingService(
            UsuarioRepository usuarioRepository,
            PerfilUsuarioRepository perfilUsuarioRepository,
            ModulosUsuarioRepository modulosUsuarioRepository,
            PreferenciasAguaRepository preferenciasAguaRepository,
            TarefaRepository tarefaRepository,
            HabitoRepository habitoRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.perfilUsuarioRepository = perfilUsuarioRepository;
        this.modulosUsuarioRepository = modulosUsuarioRepository;
        this.preferenciasAguaRepository = preferenciasAguaRepository;
        this.tarefaRepository = tarefaRepository;
        this.habitoRepository = habitoRepository;
    }

    public OnboardingResponse salvar(OnboardingRequest request) {
        if (request.getUsuarioId() == null) {
            throw new RuntimeException("O usuarioId é obrigatório");
        }

        boolean usuarioExiste = usuarioRepository.existsById(request.getUsuarioId());

        if (!usuarioExiste) {
            throw new RuntimeException("Usuário não encontrado");
        }

        PerfilUsuario perfil = perfilUsuarioRepository.findByUsuarioId(request.getUsuarioId())
                .orElse(new PerfilUsuario());

        perfil.setUsuarioId(request.getUsuarioId());
        perfil.setNome(request.getNome());
        perfil.setApelido(request.getApelido());
        perfil.setPronomes(request.getPronomes());
        perfil.setGeneroNascimento(request.getGeneroNascimento());
        perfil.setAltura(request.getAltura());
        perfil.setPeso(request.getPeso());
        perfil.setEnergiaAtual(request.getEnergiaAtual());
        perfil.setOnboardingConcluido(true);

        perfilUsuarioRepository.save(perfil);

        salvarModulos(request);
        salvarAgua(request);
        salvarPrimeiraTarefa(request);
        salvarPrimeiroHabito(request);

        OnboardingResponse response = buscarPorUsuario(request.getUsuarioId());
        response.setMensagem("Onboarding salvo com sucesso");

        return response;
    }

    public OnboardingResponse buscarPorUsuario(Integer usuarioId) {
        PerfilUsuario perfil = perfilUsuarioRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Onboarding não encontrado para este usuário"));

        OnboardingResponse response = new OnboardingResponse();

        response.setUsuarioId(perfil.getUsuarioId());
        response.setNome(perfil.getNome());
        response.setApelido(perfil.getApelido());
        response.setPronomes(perfil.getPronomes());
        response.setGeneroNascimento(perfil.getGeneroNascimento());
        response.setAltura(perfil.getAltura());
        response.setPeso(perfil.getPeso());
        response.setEnergiaAtual(perfil.getEnergiaAtual());
        response.setOnboardingConcluido(perfil.getOnboardingConcluido());

        modulosUsuarioRepository.findByUsuarioId(usuarioId)
                .ifPresent(modulos -> response.setModulos(converterModulos(modulos)));

        preferenciasAguaRepository.findByUsuarioId(usuarioId)
                .ifPresent(agua -> response.setAgua(converterAgua(agua)));

        tarefaRepository.findFirstByUsuarioIdAndCategoriaOrderByIdDesc(usuarioId, "Primeira tarefa")
                .ifPresent(tarefa -> response.setPrimeiraTarefa(converterTarefa(tarefa)));

        habitoRepository.findFirstByUsuarioIdAndCategoriaOrderByIdDesc(usuarioId, "Primeiro hábito")
                .ifPresent(habito -> response.setPrimeiroHabito(converterHabito(habito)));

        return response;
    }

    private void salvarModulos(OnboardingRequest request) {
        ModulosRequest modulosRequest = request.getModulos();

        if (modulosRequest == null) {
            return;
        }

        ModulosUsuario modulos = modulosUsuarioRepository.findByUsuarioId(request.getUsuarioId())
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

        PreferenciasAgua agua = preferenciasAguaRepository.findByUsuarioId(request.getUsuarioId())
                .orElse(new PreferenciasAgua());

        agua.setUsuarioId(request.getUsuarioId());
        agua.setMetaCalculadaMl(request.getAgua().getMetaCalculadaMl());
        agua.setMetaFinalMl(request.getAgua().getMetaFinalMl());
        agua.setModoRegistro(request.getAgua().getModoRegistro());

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
                .findFirstByUsuarioIdAndCategoriaOrderByIdDesc(request.getUsuarioId(), "Primeira tarefa")
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
                .findFirstByUsuarioIdAndCategoriaOrderByIdDesc(request.getUsuarioId(), "Primeiro hábito")
                .orElse(new Habito());

        habito.setUsuarioId(request.getUsuarioId());
        habito.setTitulo(request.getPrimeiroHabito().getTitulo());
        habito.setCategoria("Primeiro hábito");
        habito.setFrequenciaSemanal(request.getPrimeiroHabito().getFrequenciaSemanal());
        habito.setMelhorHorario(request.getPrimeiroHabito().getMelhorHorario());

        habitoRepository.save(habito);
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
}