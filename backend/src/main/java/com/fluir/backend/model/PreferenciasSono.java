package com.fluir.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "preferencias_sono")
public class PreferenciasSono {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario usuario;

    @Column(name = "meta_sono", length = 30)
    private String metaSono;

    @Column(name = "horario_dormir", length = 10)
    private String horarioDormir;

    @Column(name = "horario_acordar", length = 10)
    private String horarioAcordar;

    @Column(name = "registrar_qualidade", length = 20)
    private String registrarQualidade;

    @Column(name = "dificuldade_dormir", length = 30)
    private String dificuldadeDormir;

    @Column(name = "lembrete_dormir", length = 20)
    private String lembreteDormir;

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

    public String getMetaSono() {
        return metaSono;
    }

    public void setMetaSono(String metaSono) {
        this.metaSono = metaSono;
    }

    public String getHorarioDormir() {
        return horarioDormir;
    }

    public void setHorarioDormir(String horarioDormir) {
        this.horarioDormir = horarioDormir;
    }

    public String getHorarioAcordar() {
        return horarioAcordar;
    }

    public void setHorarioAcordar(String horarioAcordar) {
        this.horarioAcordar = horarioAcordar;
    }

    public String getRegistrarQualidade() {
        return registrarQualidade;
    }

    public void setRegistrarQualidade(String registrarQualidade) {
        this.registrarQualidade = registrarQualidade;
    }

    public String getDificuldadeDormir() {
        return dificuldadeDormir;
    }

    public void setDificuldadeDormir(String dificuldadeDormir) {
        this.dificuldadeDormir = dificuldadeDormir;
    }

    public String getLembreteDormir() {
        return lembreteDormir;
    }

    public void setLembreteDormir(String lembreteDormir) {
        this.lembreteDormir = lembreteDormir;
    }
}