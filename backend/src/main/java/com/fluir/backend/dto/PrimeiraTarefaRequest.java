package com.fluir.backend.dto;

public class PrimeiraTarefaRequest {

    private String titulo;
    private Integer tempoEstimadoMinutos;
    private String energiaGasta;

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Integer getTempoEstimadoMinutos() {
        return tempoEstimadoMinutos;
    }

    public void setTempoEstimadoMinutos(Integer tempoEstimadoMinutos) {
        this.tempoEstimadoMinutos = tempoEstimadoMinutos;
    }

    public String getEnergiaGasta() {
        return energiaGasta;
    }

    public void setEnergiaGasta(String energiaGasta) {
        this.energiaGasta = energiaGasta;
    }
}