package com.fluir.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "preferencias_alimentacao")
public class PreferenciasAlimentacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario usuario;

    @Column(length = 30)
    private String altura;

    @Column(length = 30)
    private String peso;

    @Column(name = "objetivo_alimentar", length = 40)
    private String objetivoAlimentar;

    @Column(name = "refeicoes_por_dia", length = 10)
    private String refeicoesPorDia;

    @Column(columnDefinition = "TEXT")
    private String restricoes;

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

    public String getAltura() {
        return altura;
    }

    public void setAltura(String altura) {
        this.altura = altura;
    }

    public String getPeso() {
        return peso;
    }

    public void setPeso(String peso) {
        this.peso = peso;
    }

    public String getObjetivoAlimentar() {
        return objetivoAlimentar;
    }

    public void setObjetivoAlimentar(String objetivoAlimentar) {
        this.objetivoAlimentar = objetivoAlimentar;
    }

    public String getRefeicoesPorDia() {
        return refeicoesPorDia;
    }

    public void setRefeicoesPorDia(String refeicoesPorDia) {
        this.refeicoesPorDia = refeicoesPorDia;
    }

    public String getRestricoes() {
        return restricoes;
    }

    public void setRestricoes(String restricoes) {
        this.restricoes = restricoes;
    }
}