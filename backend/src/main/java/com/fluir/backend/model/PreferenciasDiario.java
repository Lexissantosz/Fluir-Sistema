package com.fluir.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "preferencias_diario")
public class PreferenciasDiario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario usuario;

    @Column(length = 30)
    private String frequencia;

    @Column(name = "registrar_humor", length = 20)
    private String registrarHumor;

    @Column(name = "perguntas_reflexivas", length = 20)
    private String perguntasReflexivas;

    @Column(name = "acompanhar_estresse", length = 20)
    private String acompanharEstresse;

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

    public String getFrequencia() {
        return frequencia;
    }

    public void setFrequencia(String frequencia) {
        this.frequencia = frequencia;
    }

    public String getRegistrarHumor() {
        return registrarHumor;
    }

    public void setRegistrarHumor(String registrarHumor) {
        this.registrarHumor = registrarHumor;
    }

    public String getPerguntasReflexivas() {
        return perguntasReflexivas;
    }

    public void setPerguntasReflexivas(String perguntasReflexivas) {
        this.perguntasReflexivas = perguntasReflexivas;
    }

    public String getAcompanharEstresse() {
        return acompanharEstresse;
    }

    public void setAcompanharEstresse(String acompanharEstresse) {
        this.acompanharEstresse = acompanharEstresse;
    }
}