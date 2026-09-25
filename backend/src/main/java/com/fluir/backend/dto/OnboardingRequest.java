package com.fluir.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.Valid;

public class OnboardingRequest {

    @NotNull(message = "O usuarioId é obrigatório")
    private Integer usuarioId;

    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 80, message = "O nome deve ter no máximo 80 caracteres")
    private String nome;

    @NotBlank(message = "O apelido é obrigatório")
    @Size(max = 50, message = "O apelido deve ter no máximo 50 caracteres")
    private String apelido;

    @NotBlank(message = "Os pronomes são obrigatórios")
    @Size(max = 50, message = "Os pronomes devem ter no máximo 50 caracteres")
    private String pronomes;

    @NotBlank(message = "O gênero de nascimento é obrigatório")
    @Size(max = 30, message = "O gênero de nascimento deve ter no máximo 30 caracteres")
    private String generoNascimento;

    private Integer altura;
    private Double peso;

    @NotNull(message = "A idade é obrigatória")
    @Min(value = 13, message = "A idade mínima é 13 anos")
    @Max(value = 120, message = "A idade máxima é 120 anos")
    private Integer idade;

    @NotBlank(message = "O tom de comunicação é obrigatório")
    @Size(max = 30, message = "O tom de comunicação deve ter no máximo 30 caracteres")
    private String tomComunicacao;

    private String energiaAtual;

    private ModulosRequest modulos;
    private PreferenciasTarefasRequest tarefas;
    private PreferenciasHabitosRequest habitos;
    private PreferenciasSonoRequest sono;
    @Valid
    private PreferenciasFinancasRequest financas;
    private PreferenciasDiarioRequest diario;
    private PreferenciasAlimentacaoRequest alimentacao;
    private PreferenciasSaudeFisicaRequest saudeFisica;
    @Valid
    private PreferenciasCicloMenstrualRequest cicloMenstrual;
    private PreferenciasAnexosRequest anexos;
    private AguaRequest agua;
    private PrimeiraTarefaRequest primeiraTarefa;
    private PrimeiroHabitoRequest primeiroHabito;

    public Integer getUsuarioId() {
        return usuarioId;
    }

    public PreferenciasAlimentacaoRequest getAlimentacao() {
        return alimentacao;
    }

    public void setAlimentacao(PreferenciasAlimentacaoRequest alimentacao) {
        this.alimentacao = alimentacao;
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

    public ModulosRequest getModulos() {
        return modulos;
    }

    public void setModulos(ModulosRequest modulos) {
        this.modulos = modulos;
    }

    public AguaRequest getAgua() {
        return agua;
    }

    public void setAgua(AguaRequest agua) {
        this.agua = agua;
    }

    public PrimeiraTarefaRequest getPrimeiraTarefa() {
        return primeiraTarefa;
    }

    public void setPrimeiraTarefa(PrimeiraTarefaRequest primeiraTarefa) {
        this.primeiraTarefa = primeiraTarefa;
    }

    public PrimeiroHabitoRequest getPrimeiroHabito() {
        return primeiroHabito;
    }

    public void setPrimeiroHabito(PrimeiroHabitoRequest primeiroHabito) {
        this.primeiroHabito = primeiroHabito;
    }

    public Integer getIdade() {
        return idade;
    }

    public void setIdade(Integer idade) {
        this.idade = idade;
    }

    public String getTomComunicacao() {
        return tomComunicacao;
    }

    public void setTomComunicacao(String tomComunicacao) {
        this.tomComunicacao = tomComunicacao;
    }

    public PreferenciasTarefasRequest getTarefas() {
        return tarefas;
    }

    public void setTarefas(PreferenciasTarefasRequest tarefas) {
        this.tarefas = tarefas;
    }

    public PreferenciasHabitosRequest getHabitos() {
        return habitos;
    }

    public void setHabitos(PreferenciasHabitosRequest habitos) {
        this.habitos = habitos;
    }

    public PreferenciasSonoRequest getSono() {
        return sono;
    }

    public void setSono(PreferenciasSonoRequest sono) {
        this.sono = sono;
    }

    public PreferenciasFinancasRequest getFinancas() {
        return financas;
    }

    public void setFinancas(PreferenciasFinancasRequest financas) {
        this.financas = financas;
    }

    public PreferenciasDiarioRequest getDiario() {
        return diario;
    }

    public void setDiario(PreferenciasDiarioRequest diario) {
        this.diario = diario;
    }

    public PreferenciasSaudeFisicaRequest getSaudeFisica() {
        return saudeFisica;
    }

    public void setSaudeFisica(PreferenciasSaudeFisicaRequest saudeFisica) {
        this.saudeFisica = saudeFisica;
    }

    public PreferenciasCicloMenstrualRequest getCicloMenstrual() {
        return cicloMenstrual;
    }

    public void setCicloMenstrual(PreferenciasCicloMenstrualRequest cicloMenstrual) {
        this.cicloMenstrual = cicloMenstrual;
    }

    public PreferenciasAnexosRequest getAnexos() {
        return anexos;
    }

    public void setAnexos(PreferenciasAnexosRequest anexos) {
        this.anexos = anexos;
    }

}