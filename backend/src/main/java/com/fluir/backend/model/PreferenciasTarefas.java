package com.fluir.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "preferencias_tarefas")
public class PreferenciasTarefas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario usuario;

    @Column(name = "visualizacao_preferida", length = 30)
    private String visualizacaoPreferida;

    @Column(length = 20)
    private String lembretes;

    @Column(columnDefinition = "TEXT")
    private String categorias;

    public Integer getId() {
        return id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Integer getUsuarioId() {
        return usuario != null ? usuario.getId() : null;
    }

    public void setUsuarioId(Integer usuarioId) {
        if (usuarioId == null) {
            this.usuario = null;
        } else {
            Usuario u = new Usuario();
            u.setId(usuarioId);
            this.usuario = u;
        }
    }

    public String getVisualizacaoPreferida() {
        return visualizacaoPreferida;
    }

    public void setVisualizacaoPreferida(String visualizacaoPreferida) {
        this.visualizacaoPreferida = visualizacaoPreferida;
    }

    public String getLembretes() {
        return lembretes;
    }

    public void setLembretes(String lembretes) {
        this.lembretes = lembretes;
    }

    public String getCategorias() {
        return categorias;
    }

    public void setCategorias(String categorias) {
        this.categorias = categorias;
    }
}