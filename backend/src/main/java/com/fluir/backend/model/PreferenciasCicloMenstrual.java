package com.fluir.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "preferencias_ciclo_menstrual")
public class PreferenciasCicloMenstrual {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario usuario;

    @Column(name = "menstrua_atualmente", length = 30)
    private String menstruaAtualmente;

    @Column(name = "ciclo_regular", length = 30)
    private String cicloRegular;

    @Column(name = "data_ultima_menstruacao", length = 10)
    private String dataUltimaMenstruacao;

    @Column(name = "duracao_ciclo", length = 30)
    private String duracaoCiclo;

    @Column(name = "duracao_sangramento", length = 30)
    private String duracaoSangramento;

    @Column(length = 20)
    private String colicas;

    @Column(length = 30)
    private String gravida;

    @Column(length = 30)
    private String amamentando;

    @Column(name = "metodo_hormonal", length = 30)
    private String metodoHormonal;

    @Column(length = 20)
    private String lembretes;

    @Column(columnDefinition = "TEXT")
    private String sintomas;

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

    public String getMenstruaAtualmente() {
        return menstruaAtualmente;
    }

    public void setMenstruaAtualmente(String menstruaAtualmente) {
        this.menstruaAtualmente = menstruaAtualmente;
    }

    public String getCicloRegular() {
        return cicloRegular;
    }

    public void setCicloRegular(String cicloRegular) {
        this.cicloRegular = cicloRegular;
    }

    public String getDataUltimaMenstruacao() {
        return dataUltimaMenstruacao;
    }

    public void setDataUltimaMenstruacao(String dataUltimaMenstruacao) {
        this.dataUltimaMenstruacao = dataUltimaMenstruacao;
    }

    public String getDuracaoCiclo() {
        return duracaoCiclo;
    }

    public void setDuracaoCiclo(String duracaoCiclo) {
        this.duracaoCiclo = duracaoCiclo;
    }

    public String getDuracaoSangramento() {
        return duracaoSangramento;
    }

    public void setDuracaoSangramento(String duracaoSangramento) {
        this.duracaoSangramento = duracaoSangramento;
    }

    public String getColicas() {
        return colicas;
    }

    public void setColicas(String colicas) {
        this.colicas = colicas;
    }

    public String getGravida() {
        return gravida;
    }

    public void setGravida(String gravida) {
        this.gravida = gravida;
    }

    public String getAmamentando() {
        return amamentando;
    }

    public void setAmamentando(String amamentando) {
        this.amamentando = amamentando;
    }

    public String getMetodoHormonal() {
        return metodoHormonal;
    }

    public void setMetodoHormonal(String metodoHormonal) {
        this.metodoHormonal = metodoHormonal;
    }

    public String getLembretes() {
        return lembretes;
    }

    public void setLembretes(String lembretes) {
        this.lembretes = lembretes;
    }

    public String getSintomas() {
        return sintomas;
    }

    public void setSintomas(String sintomas) {
        this.sintomas = sintomas;
    }
}