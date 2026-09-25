package com.fluir.backend.dto;

import java.math.BigDecimal;
import java.util.List;
import jakarta.validation.constraints.PositiveOrZero;

public class PreferenciasFinancasRequest {

    @PositiveOrZero(message = "A renda mensal não pode ser negativa")
    private BigDecimal monthlyIncome;
    private String trackExpenses;
    private String trackDebts;
    private String financialGoal;
    private List<String> categories;

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(BigDecimal monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public String getTrackExpenses() {
        return trackExpenses;
    }

    public void setTrackExpenses(String trackExpenses) {
        this.trackExpenses = trackExpenses;
    }

    public String getTrackDebts() {
        return trackDebts;
    }

    public void setTrackDebts(String trackDebts) {
        this.trackDebts = trackDebts;
    }

    public String getFinancialGoal() {
        return financialGoal;
    }

    public void setFinancialGoal(String financialGoal) {
        this.financialGoal = financialGoal;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }
}