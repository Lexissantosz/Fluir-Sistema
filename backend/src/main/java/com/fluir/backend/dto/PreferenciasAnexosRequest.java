package com.fluir.backend.dto;

import java.util.List;

public class PreferenciasAnexosRequest {

    private List<String> fileTypes;
    private List<String> linkToModules;

    public List<String> getFileTypes() {
        return fileTypes;
    }

    public void setFileTypes(List<String> fileTypes) {
        this.fileTypes = fileTypes;
    }

    public List<String> getLinkToModules() {
        return linkToModules;
    }

    public void setLinkToModules(List<String> linkToModules) {
        this.linkToModules = linkToModules;
    }
}
