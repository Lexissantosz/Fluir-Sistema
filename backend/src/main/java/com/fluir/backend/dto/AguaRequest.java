package com.fluir.backend.dto;

public class AguaRequest {

    private Integer metaCalculadaMl;
    private Integer metaFinalMl;
    private String modoRegistro;

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