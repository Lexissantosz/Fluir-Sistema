package com.fluir.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "preferencias_agua")
public class PreferenciasAgua {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario usuario;

    @Column(name = "meta_calculada_ml")
    private Integer metaCalculadaMl;

    @Column(name = "meta_final_ml")
    private Integer metaFinalMl;

    @Column(name = "modo_registro", length = 20)
    private String modoRegistro;

    @Column(name = "meta_diaria", length = 50)
    private String metaDiaria;

    @Column(length = 20)
    private String unidade;

    @Column(length = 20)
    private String lembretes;

    @Column(name = "frequencia_lembrete", length = 30)
    private String frequenciaLembrete;

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

    public Integer getMetaCalculadaMl() {
        return metaCalculadaMl;
    }

    public void setMetaCalculadaMl(Integer metaCalculadaMl) {
        this.metaCalculadaMl = metaCalculadaMl;
    }

    public Integer getMetaFinalMl() {
        return metaFinalMl;
    }

    public void setMetaFinalMl(Integer metaFinalMl) {
        this.metaFinalMl = metaFinalMl;
    }

    public String getModoRegistro() {
        return modoRegistro;
    }

    public void setModoRegistro(String modoRegistro) {
        this.modoRegistro = modoRegistro;
    }

    public String getMetaDiaria() {
    return metaDiaria;
    }

    public void setMetaDiaria(String metaDiaria) {
        this.metaDiaria = metaDiaria;
    }

    public String getUnidade() {
        return unidade;
    }

    public void setUnidade(String unidade) {
        this.unidade = unidade;
    }

    public String getLembretes() {
        return lembretes;
    }

    public void setLembretes(String lembretes) {
        this.lembretes = lembretes;
    }

    public String getFrequenciaLembrete() {
        return frequenciaLembrete;
    }

    public void setFrequenciaLembrete(String frequenciaLembrete) {
        this.frequenciaLembrete = frequenciaLembrete;
    }
}