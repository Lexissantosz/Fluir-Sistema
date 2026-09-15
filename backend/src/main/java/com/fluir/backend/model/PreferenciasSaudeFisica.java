package com.fluir.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "preferencias_saude_fisica")
public class PreferenciasSaudeFisica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario usuario;

    @Column(name = "pratica_atividade", length = 20)
    private String praticaAtividade;

    @Column(name = "frequencia_semanal", length = 20)
    private String frequenciaSemanal;

    @Column(name = "tipo_treino", length = 30)
    private String tipoTreino;

    @Column(name = "registrar_dor_energia", length = 20)
    private String registrarDorEnergia;

    @Column(columnDefinition = "TEXT")
    private String limitacoes;

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

    public String getPraticaAtividade() {
        return praticaAtividade;
    }

    public void setPraticaAtividade(String praticaAtividade) {
        this.praticaAtividade = praticaAtividade;
    }

    public String getFrequenciaSemanal() {
        return frequenciaSemanal;
    }

    public void setFrequenciaSemanal(String frequenciaSemanal) {
        this.frequenciaSemanal = frequenciaSemanal;
    }

    public String getTipoTreino() {
        return tipoTreino;
    }

    public void setTipoTreino(String tipoTreino) {
        this.tipoTreino = tipoTreino;
    }

    public String getRegistrarDorEnergia() {
        return registrarDorEnergia;
    }

    public void setRegistrarDorEnergia(String registrarDorEnergia) {
        this.registrarDorEnergia = registrarDorEnergia;
    }

    public String getLimitacoes() {
        return limitacoes;
    }

    public void setLimitacoes(String limitacoes) {
        this.limitacoes = limitacoes;
    }
}