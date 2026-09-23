package com.fluir.backend.dto;

public class PreferenciasSaudeFisicaRequest {

    private String exercises;
    private String weeklyFrequency;
    private String trainingType;
    private String trackPainEnergy;
    private String limitations;

    public String getExercises() {
        return exercises;
    }

    public void setExercises(String exercises) {
        this.exercises = exercises;
    }

    public String getWeeklyFrequency() {
        return weeklyFrequency;
    }

    public void setWeeklyFrequency(String weeklyFrequency) {
        this.weeklyFrequency = weeklyFrequency;
    }

    public String getTrainingType() {
        return trainingType;
    }

    public void setTrainingType(String trainingType) {
        this.trainingType = trainingType;
    }

    public String getTrackPainEnergy() {
        return trackPainEnergy;
    }

    public void setTrackPainEnergy(String trackPainEnergy) {
        this.trackPainEnergy = trackPainEnergy;
    }

    public String getLimitations() {
        return limitations;
    }

    public void setLimitations(String limitations) {
        this.limitations = limitations;
    }
}