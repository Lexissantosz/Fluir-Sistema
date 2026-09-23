package com.fluir.backend.dto;

public class PreferenciasAlimentacaoRequest {

    private String height;
    private String weight;
    private String goal;
    private String mealsPerDay;
    private String restrictions;

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public String getMealsPerDay() {
        return mealsPerDay;
    }

    public void setMealsPerDay(String mealsPerDay) {
        this.mealsPerDay = mealsPerDay;
    }

    public String getRestrictions() {
        return restrictions;
    }

    public void setRestrictions(String restrictions) {
        this.restrictions = restrictions;
    }
}