package com.fluir.backend.controller;

import com.fluir.backend.model.Tarefa;
import com.fluir.backend.repository.TarefaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tarefas")
@CrossOrigin(origins = "*")
public class TarefaController {

    private final TarefaRepository tarefaRepository;

    public TarefaController(TarefaRepository tarefaRepository) {
        this.tarefaRepository = tarefaRepository;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Tarefa>> buscarPorUsuario(
            @PathVariable Integer usuarioId
    ) {
        List<Tarefa> tarefas = tarefaRepository.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(tarefas);
    }

    @PostMapping
    public ResponseEntity<Tarefa> criar(
            @RequestBody Tarefa tarefa
    ) {
        Tarefa salva = tarefaRepository.save(tarefa);
        return ResponseEntity.ok(salva);
    }

    @PutMapping("/{id}/concluir")
    public ResponseEntity<?> concluir(
            @PathVariable Integer id
    ) {
        return tarefaRepository.findById(id)
                .map(tarefa -> {
                    tarefa.setConcluida(true);
                    return ResponseEntity.ok(tarefaRepository.save(tarefa));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}