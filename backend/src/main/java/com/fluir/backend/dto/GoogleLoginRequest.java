package com.fluir.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class GoogleLoginRequest {
    @NotBlank
    @Size(max = 8192)
    private String idToken;
    public String getIdToken() { return idToken; }
    public void setIdToken(String idToken) { this.idToken = idToken; }
}
