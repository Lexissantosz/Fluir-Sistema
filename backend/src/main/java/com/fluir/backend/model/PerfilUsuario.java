package com.fluir.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "perfis_usuario")
public class PerfilUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "usuario_id", nullable = false, unique = true)
    private Integer usuarioId;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 100)
    private String apelido;

    @Column(length = 50)
    private String pronomes;

    @Column(name = "genero_nascimento", length = 50)
    private String generoNascimento;

    private Integer altura;

    private Double peso;

    @Column(name = "energia_atual", length = 20)
    private String energiaAtual;

    @Column(name = "onboarding_concluido")
    private Boolean onboardingConcluido = false;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @PrePersist
    public void antesDeCriar() {
        this.criadoEm = LocalDateTime.now();
        this.atualizadoEm = LocalDateTime.now();
    }

    @PreUpdate
    public void antesDeAtualizar() {
        this.atualizadoEm = LocalDateTime.now();
    }

    public Integer getId() {
        return id;
    }

    public Integer getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }


    public String getApelido() {
        return apelido;
    }

    public void setApelido(String apelido) {
        this.apelido = apelido;
    }

    public String getPronomes() {
        return pronomes;
    }

    public void setPronomes(String pronomes) {
        this.pronomes = pronomes;
    }

    public String getGeneroNascimento() {
        return generoNascimento;
    }

    public void setGeneroNascimento(String generoNascimento) {
        this.generoNascimento = generoNascimento;
    }

    public Integer getAltura() {
        return altura;
    }

    public void setAltura(Integer altura) {
        this.altura = altura;
    }

    public Double getPeso() {
        return peso;
    }

    public void setPeso(Double peso) {
        this.peso = peso;
    }

    public String getEnergiaAtual() {
        return energiaAtual;
    }

    public void setEnergiaAtual(String energiaAtual) {
        this.energiaAtual = energiaAtual;
    }

    public Boolean getOnboardingConcluido() {
        return onboardingConcluido;
    }

    public void setOnboardingConcluido(Boolean onboardingConcluido) {
        this.onboardingConcluido = onboardingConcluido;
    }
}