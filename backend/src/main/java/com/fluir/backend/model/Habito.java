package com.fluir.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "habitos")
public class Habito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "usuario_id", nullable = false)
    private Integer usuarioId;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(length = 100)
    private String categoria;

    @Column(name = "frequencia_semanal")
    private Integer frequenciaSemanal;

    @Column(name = "melhor_horario", length = 30)
    private String melhorHorario;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    @PrePersist
    public void antesDeCriar() {
        this.criadoEm = LocalDateTime.now();
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

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Integer getFrequenciaSemanal() {
        return frequenciaSemanal;
    }

    public void setFrequenciaSemanal(Integer frequenciaSemanal) {
        this.frequenciaSemanal = frequenciaSemanal;
    }

    public String getMelhorHorario() {
        return melhorHorario;
    }

    public void setMelhorHorario(String melhorHorario) {
        this.melhorHorario = melhorHorario;
    }
}