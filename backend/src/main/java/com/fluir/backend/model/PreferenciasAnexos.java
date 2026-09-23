package com.fluir.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "preferencias_anexos")
public class PreferenciasAnexos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario usuario;

    @Column(name = "tipos_arquivo", columnDefinition = "TEXT")
    private String tiposArquivo;

    @Column(name = "vincular_modulos", columnDefinition = "TEXT")
    private String vincularModulos;

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

    public String getTiposArquivo() {
        return tiposArquivo;
    }

    public void setTiposArquivo(String tiposArquivo) {
        this.tiposArquivo = tiposArquivo;
    }

    public String getVincularModulos() {
        return vincularModulos;
    }

    public void setVincularModulos(String vincularModulos) {
        this.vincularModulos = vincularModulos;
    }
}