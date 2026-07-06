package com.fluir.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "preferencias_agua")
public class PreferenciasAgua {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "usuario_id", nullable = false, unique = true)
    private Integer usuarioId;

    @Column(name = "meta_calculada_ml")
    private Integer metaCalculadaMl;

    @Column(name = "meta_final_ml")
    private Integer metaFinalMl;

    @Column(name = "modo_registro", length = 20)
    private String modoRegistro;

    public Integer getId() {
        return id;
    }

    public Integer getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
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
}