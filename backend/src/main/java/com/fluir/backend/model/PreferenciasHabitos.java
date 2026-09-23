package com.fluir.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "preferencias_habitos")
public class PreferenciasHabitos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario usuario;

    @Column(name = "tipo_acompanhamento", length = 30)
    private String tipoAcompanhamento;

    @Column(name = "meta_semanal", length = 20)
    private String metaSemanal;

    @Column(name = "habitos_selecionados", columnDefinition = "TEXT")
    private String habitosSelecionados;

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

    public String getTipoAcompanhamento() {
        return tipoAcompanhamento;
    }

    public void setTipoAcompanhamento(String tipoAcompanhamento) {
        this.tipoAcompanhamento = tipoAcompanhamento;
    }

    public String getMetaSemanal() {
        return metaSemanal;
    }

    public void setMetaSemanal(String metaSemanal) {
        this.metaSemanal = metaSemanal;
    }

    public String getHabitosSelecionados() {
        return habitosSelecionados;
    }

    public void setHabitosSelecionados(String habitosSelecionados) {
        this.habitosSelecionados = habitosSelecionados;
    }
}