package com.fluir.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

@Entity
@Table(name = "preferencias_financas")
public class PreferenciasFinancas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Usuario usuario;

    @Column(name = "renda_mensal", precision = 12, scale = 2)
    private BigDecimal rendaMensal;

    @Column(name = "controlar_gastos", length = 20)
    private String controlarGastos;

    @Column(name = "controlar_dividas", length = 20)
    private String controlarDividas;

    @Column(name = "meta_financeira", length = 255)
    private String metaFinanceira;

    @Column(columnDefinition = "TEXT")
    private String categorias;

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

    public BigDecimal getRendaMensal() {
        return rendaMensal;
    }

    public void setRendaMensal(BigDecimal rendaMensal) {
        this.rendaMensal = rendaMensal;
    }

    public String getControlarGastos() {
        return controlarGastos;
    }

    public void setControlarGastos(String controlarGastos) {
        this.controlarGastos = controlarGastos;
    }

    public String getControlarDividas() {
        return controlarDividas;
    }

    public void setControlarDividas(String controlarDividas) {
        this.controlarDividas = controlarDividas;
    }

    public String getMetaFinanceira() {
        return metaFinanceira;
    }

    public void setMetaFinanceira(String metaFinanceira) {
        this.metaFinanceira = metaFinanceira;
    }

    public String getCategorias() {
        return categorias;
    }

    public void setCategorias(String categorias) {
        this.categorias = categorias;
    }
}