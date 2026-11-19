package com.fluir.backend.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "assistente_registros")
public class AssistenteRegistro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnore
    private Usuario usuario;

    @Column(nullable = false, length = 32)
    private String tipo;

    @Column(nullable = false, length = 1200)
    private String conteudo;

    @Column(nullable = false, length = 160)
    private String rotulo;

    @Column(name = "criado_em", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime criadoEm;

    @Column(name = "chave_cliente", nullable = false, updatable = false)
    private UUID chaveCliente;

    @Column(name = "tarefa_id")
    private Integer tarefaId;

    public Long getId() {return id;}
    public Usuario getUsuario() {return usuario;}
    public void setUsuario(Usuario usuario) {this.usuario=usuario;}
    public String getTipo() {return tipo;}
    public void setTipo(String tipo) {this.tipo=tipo;}
    public String getConteudo() {return conteudo;}
    public void setConteudo(String conteudo) {this.conteudo=conteudo;}
    public String getRotulo() {return rotulo;}
    public void setRotulo(String rotulo) {this.rotulo=rotulo;}
    public OffsetDateTime getCriadoEm() {return criadoEm;}
    public UUID getChaveCliente() {return chaveCliente;}
    public void setChaveCliente(UUID chaveCliente) {this.chaveCliente=chaveCliente;}
    public Integer getTarefaId() {return tarefaId;}
    public void setTarefaId(Integer tarefaId) {this.tarefaId=tarefaId;}
}
