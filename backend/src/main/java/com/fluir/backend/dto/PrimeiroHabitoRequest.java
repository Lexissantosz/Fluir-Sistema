package com.fluir.backend.dto;

public class PrimeiroHabitoRequest {

    private String titulo;
    private Integer frequenciaSemanal;
    private String melhorHorario;

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
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