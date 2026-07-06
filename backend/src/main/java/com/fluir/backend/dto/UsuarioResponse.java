package com.fluir.backend.dto;

import com.fluir.backend.model.Usuario;

public class UsuarioResponse {

    private Integer id;
    private String nome;
    private String email;
    private String mensagem;

    public UsuarioResponse() {
    }

    public UsuarioResponse(Integer id, String nome, String email, String mensagem) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.mensagem = mensagem;
    }

    public static UsuarioResponse fromUsuario(Usuario usuario, String mensagem) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                mensagem
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
}