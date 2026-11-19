package com.fluir.backend.dto;

import com.fluir.backend.model.Usuario;

public class UsuarioResponse {

    private Integer id;
    private String nome;
    private String email;
    private String mensagem;
    private String token;
    private String provedor;
    private Boolean emailVerificado;

    public UsuarioResponse() {
    }

    public UsuarioResponse(
        Integer id,
        String nome,
        String email,
        String mensagem,
        String token
    ) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.mensagem = mensagem;
        this.token = token;
    }

    public static UsuarioResponse fromUsuario(
        Usuario usuario,
        String mensagem,
        String token
    ) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                mensagem,
                token
        );
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }



    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }



    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }



    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public String getProvedor() { return provedor; }
    public void setProvedor(String provedor) { this.provedor = provedor; }
    public Boolean getEmailVerificado() { return emailVerificado; }
    public void setEmailVerificado(Boolean emailVerificado) { this.emailVerificado = emailVerificado; }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}