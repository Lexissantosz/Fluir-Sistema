package com.fluir.backend.controller;

import com.fluir.backend.dto.TarefaRequest;

import com.fluir.backend.model.Tarefa;
import com.fluir.backend.model.Usuario;
import com.fluir.backend.repository.TarefaRepository;
import com.fluir.backend.repository.UsuarioRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tarefas")
public class TarefaController {

    private final TarefaRepository tarefaRepository;
    private final UsuarioRepository usuarioRepository;

    public TarefaController(
            TarefaRepository tarefaRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.tarefaRepository = tarefaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Tarefa>> buscarPorUsuario(
            @PathVariable Integer usuarioId
    ) {
        List<Tarefa> tarefas = tarefaRepository.findByUsuario_Id(usuarioId);
        return ResponseEntity.ok(tarefas);
    }

    @PostMapping
    public ResponseEntity<?> criar(
            @RequestBody TarefaRequest request
    ) {
        if (request.usuarioId() == null) {
            return ResponseEntity.badRequest().body("usuarioId é obrigatório");
        }

        if (request.titulo() == null || request.titulo().isBlank()) {
            return ResponseEntity.badRequest().body("titulo é obrigatório");
        }

        Usuario usuario = usuarioRepository.findById(request.usuarioId()).orElse(null);

        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }

        Tarefa tarefa = new Tarefa();

        tarefa.setUsuario(usuario);
        tarefa.setTitulo(request.titulo());
        tarefa.setCategoria(request.categoria());
        tarefa.setDescricao(request.descricao());
        tarefa.setPrioridade(request.prioridade());
        tarefa.setHorario(request.horario());
        tarefa.setDataTarefa(request.dataTarefa());
        tarefa.setTempoEstimadoMinutos(request.tempoEstimadoMinutos());
        tarefa.setEnergiaGasta(request.energiaGasta());
        tarefa.setConcluida(
                request.concluida() != null ? request.concluida() : false
        );

        return ResponseEntity.ok(tarefaRepository.save(tarefa));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> alterarStatus(
            @PathVariable Integer id,
            @RequestParam Boolean concluida
    ) {
        return tarefaRepository.findById(id)
                .map(tarefa -> {
                    tarefa.setConcluida(concluida);
                    return ResponseEntity.ok(tarefaRepository.save(tarefa));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Integer id) {
        if (!tarefaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        tarefaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}