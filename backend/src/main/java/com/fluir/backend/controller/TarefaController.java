package com.fluir.backend.controller;

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
            @RequestBody Tarefa tarefa
    ) {
        Integer usuarioId = tarefa.getUsuarioId();

        if (usuarioId == null) {
            return ResponseEntity.badRequest().body("usuarioId é obrigatório");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);

        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }

        tarefa.setUsuario(usuario);

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