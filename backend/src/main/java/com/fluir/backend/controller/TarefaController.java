package com.fluir.backend.controller;

import com.fluir.backend.dto.TarefaRequest;
import com.fluir.backend.model.Tarefa;
import com.fluir.backend.model.Usuario;
import com.fluir.backend.repository.TarefaRepository;
import com.fluir.backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tarefas")
public class TarefaController {
    private final TarefaRepository tarefas;
    private final UsuarioRepository usuarios;

    public TarefaController(TarefaRepository tarefas, UsuarioRepository usuarios) {
        this.tarefas = tarefas;
        this.usuarios = usuarios;
    }

    private Integer idAutenticado(Authentication authentication) {
        return authentication != null && authentication.getPrincipal() instanceof Integer
            ? (Integer) authentication.getPrincipal() : null;
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> buscarPorUsuario(@PathVariable Integer usuarioId, Authentication auth) {
        if (!usuarioId.equals(idAutenticado(auth))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado às tarefas.");
        }
        return ResponseEntity.ok(tarefas.findByUsuario_Id(usuarioId));
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody TarefaRequest req, Authentication auth) {
        Integer owner = idAutenticado(auth);
        if (owner == null || req.usuarioId() == null || !owner.equals(req.usuarioId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Não pode criar tarefas para outro usuário.");
        }
        if (req.titulo() == null || req.titulo().isBlank() || req.titulo().length()>150) {
            return ResponseEntity.badRequest().body("Título inválido.");
        }
        Usuario usuario = usuarios.findById(owner).orElse(null);
        if (usuario == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não encontrado.");

        Tarefa tarefa = new Tarefa();
        tarefa.setUsuario(usuario);
        tarefa.setTitulo(req.titulo().trim());
        tarefa.setCategoria(req.categoria());
        tarefa.setDescricao(req.descricao());
        tarefa.setPrioridade(req.prioridade());
        tarefa.setHorario(req.horario());
        tarefa.setDataTarefa(req.dataTarefa());
        tarefa.setTempoEstimadoMinutos(req.tempoEstimadoMinutos());
        tarefa.setEnergiaGasta(req.energiaGasta());
        tarefa.setConcluida(req.concluida() != null ? req.concluida() : false);
        return ResponseEntity.ok(tarefas.save(tarefa));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> alterarStatus(
            @PathVariable Integer id, @RequestParam Boolean concluida, Authentication auth) {
        Integer owner = idAutenticado(auth);
        if (owner == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado.");
        java.util.Optional<Tarefa> encontrada = tarefas.findById(id);
        if (encontrada.isEmpty()) return ResponseEntity.notFound().build();
        Tarefa tarefa = encontrada.get();
        if (tarefa.getUsuario() == null || !owner.equals(tarefa.getUsuario().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Tarefa de outro usuário.");
        }
        tarefa.setConcluida(concluida);
        return ResponseEntity.ok(tarefas.save(tarefa));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Integer id, Authentication auth) {
        Integer owner = idAutenticado(auth);
        if (owner == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado.");
        java.util.Optional<Tarefa> encontrada = tarefas.findById(id);
        if (encontrada.isEmpty()) return ResponseEntity.notFound().build();
        Tarefa tarefa = encontrada.get();
        if (tarefa.getUsuario() == null || !owner.equals(tarefa.getUsuario().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Tarefa de outro usuário.");
        }
        tarefas.delete(tarefa);
        return ResponseEntity.noContent().build();
    }
}
