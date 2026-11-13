package com.fluir.backend.controller;

import com.fluir.backend.dto.TarefaRequest;

import com.fluir.backend.model.Tarefa;
import com.fluir.backend.model.Usuario;
import com.fluir.backend.repository.TarefaRepository;
import com.fluir.backend.repository.UsuarioRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

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
            @PathVariable Integer usuarioId,
            @AuthenticationPrincipal Integer usuarioAutenticadoId
    ) {
        if (usuarioAutenticadoId == null ||
                !usuarioAutenticadoId.equals(usuarioId)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .build();
        }

        List<Tarefa> tarefas =
                tarefaRepository.findByUsuario_Id(usuarioAutenticadoId);

        return ResponseEntity.ok(tarefas);
    }

    @PostMapping
    public ResponseEntity<?> criar(
            @RequestBody TarefaRequest request,
            @AuthenticationPrincipal Integer usuarioAutenticadoId
    ) {
        if (usuarioAutenticadoId == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Autenticação necessária");
        }

        if (request.usuarioId() == null) {
            return ResponseEntity
                    .badRequest()
                    .body("usuarioId é obrigatório");
        }

        if (!usuarioAutenticadoId.equals(request.usuarioId())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Usuário não autorizado");
        }

        if (request.titulo() == null || request.titulo().isBlank()) {
            return ResponseEntity.badRequest().body("titulo é obrigatório");
        }

        Usuario usuario = usuarioRepository.findById(usuarioAutenticadoId).orElse(null);

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
            @RequestParam Boolean concluida,
            @AuthenticationPrincipal Integer usuarioAutenticadoId
    ) {
        if (usuarioAutenticadoId == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        Tarefa tarefa = tarefaRepository.findById(id).orElse(null);

        if (tarefa == null) {
            return ResponseEntity.notFound().build();
        }

        if (tarefa.getUsuario() == null ||
                !usuarioAutenticadoId.equals(tarefa.getUsuarioId())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .build();
        }

        tarefa.setConcluida(concluida);

        return ResponseEntity.ok(tarefaRepository.save(tarefa));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(
            @PathVariable Integer id,
            @AuthenticationPrincipal Integer usuarioAutenticadoId
    ) {
        if (usuarioAutenticadoId == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        Tarefa tarefa = tarefaRepository.findById(id).orElse(null);

        if (tarefa == null) {
            return ResponseEntity.notFound().build();
        }

        if (!usuarioAutenticadoId.equals(tarefa.getUsuarioId())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .build();
        }

        tarefaRepository.delete(tarefa);

        return ResponseEntity.noContent().build();
    }
}