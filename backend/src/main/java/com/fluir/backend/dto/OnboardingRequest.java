package com.fluir.backend.dto;

public class OnboardingRequest {

    private Integer usuarioId;
    private String nome;
    private String apelido;
    private String pronomes;
    private String generoNascimento;
    private Integer altura;
    private Double peso;
    private Integer idade;
    private String tomComunicacao;
    private String energiaAtual;
    private ModulosRequest modulos;
    private PreferenciasTarefasRequest tarefas;
    private PreferenciasHabitosRequest habitos;
    private PreferenciasSonoRequest sono;
    private PreferenciasFinancasRequest financas;
    private PreferenciasDiarioRequest diario;
    private AguaRequest agua;
    private PrimeiraTarefaRequest primeiraTarefa;
    private PrimeiroHabitoRequest primeiroHabito;

    public Integer getUsuarioId() {
        return usuarioId;
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
}