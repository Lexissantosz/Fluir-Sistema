package com.fluir.backend.service;

import com.fluir.backend.model.AssistenteRegistro;
import com.fluir.backend.model.Tarefa;
import com.fluir.backend.model.Usuario;
import com.fluir.backend.repository.AssistenteRegistroRepository;
import com.fluir.backend.repository.TarefaRepository;
import com.fluir.backend.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class AssistenteRegistroService {
    private static final Set<String> TIPOS = Set.of(
        "mood", "energy", "diary", "task", "habit", "water", "sleep", "finances",
        "nutrition", "physicalHealth", "menstrualCycle", "attachments",
        "achievements", "timeline"
    );
    private final AssistenteRegistroRepository registros;
    private final UsuarioRepository usuarios;
    private final TarefaRepository tarefas;

    public AssistenteRegistroService(AssistenteRegistroRepository registros,
                                    UsuarioRepository usuarios,
                                    TarefaRepository tarefas) {
        this.registros=registros;
        this.usuarios=usuarios;
        this.tarefas=tarefas;
    }

    public record SolicitarRegistro(String tipo,String conteudo,String rotulo,UUID chaveCliente) {}
    public record RegistroPublico(Long id,String tipo,String conteudo,String rotulo,
                                  java.time.OffsetDateTime criadoEm,Integer tarefaId) {
        public static RegistroPublico de(AssistenteRegistro registro) {
            return new RegistroPublico(registro.getId(), registro.getTipo(),
                registro.getConteudo(), registro.getRotulo(), registro.getCriadoEm(),
                registro.getTarefaId());
        }
    }

    public List<RegistroPublico> listar(Integer usuarioId) {
        return registros.findTop50ByUsuario_IdOrderByCriadoEmDesc(usuarioId)
            .stream().map(RegistroPublico::de).toList();
    }

    @Transactional
    public RegistroPublico registrar(Integer usuarioId, SolicitarRegistro input) {
        if (usuarioId == null || input == null || input.chaveCliente() == null ||
            input.tipo() == null || !TIPOS.contains(input.tipo())) {
            throw new IllegalArgumentException("Tipo de registro ou identificador inválido.");
        }
        if (input.conteudo() == null || input.conteudo().isBlank() ||
            input.conteudo().length() > 1200 || input.rotulo() == null ||
            input.rotulo().isBlank() || input.rotulo().length() > 160) {
            throw new IllegalArgumentException("Conteúdo deve ter entre 1 e 1200 caracteres.");
        }
        var existente = registros.findByUsuario_IdAndChaveCliente(usuarioId,input.chaveCliente());
        if (existente.isPresent()) return RegistroPublico.de(existente.get());

        Usuario usuario = usuarios.findById(usuarioId)
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        var registro=new AssistenteRegistro();
        registro.setUsuario(usuario);
        registro.setTipo(input.tipo());
        registro.setConteudo(input.conteudo().trim());
        registro.setRotulo(input.rotulo().trim());
        registro.setChaveCliente(input.chaveCliente());

        if ("task".equals(input.tipo())) {
            if (input.conteudo().trim().length() > 150) {
                throw new IllegalArgumentException("Título da tarefa deve ter até 150 caracteres.");
            }
            Tarefa tarefa=new Tarefa();
            tarefa.setUsuario(usuario);
            tarefa.setTitulo(input.conteudo().trim());
            tarefa.setCategoria("Assistente");
            tarefa.setConcluida(false);
            registro.setTarefaId(tarefas.save(tarefa).getId());
        }
        return RegistroPublico.de(registros.saveAndFlush(registro));
    }

    @Transactional
    public boolean excluir(Integer usuarioId,Long id) {
        if(usuarioId == null || id == null) return false;
        var encontrado=registros.findByIdAndUsuario_Id(id,usuarioId);
        if(encontrado.isEmpty()) return false;
        var registro=encontrado.get();
        if (registro.getTarefaId() != null) {
            tarefas.findById(registro.getTarefaId()).ifPresent(tarefa -> {
                if (tarefa.getUsuario() != null &&
                    usuarioId.equals(tarefa.getUsuario().getId())) tarefas.delete(tarefa);
            });
        }
        registros.delete(registro);
        return true;
    }
}
