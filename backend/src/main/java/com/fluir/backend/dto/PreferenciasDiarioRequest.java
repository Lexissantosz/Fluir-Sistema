package com.fluir.backend.dto;

public class PreferenciasDiarioRequest {

    private String frequency;
    private String trackMood;
    private String dailyPrompt;
    private String trackStress;

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getTrackMood() {
        return trackMood;
    }

    public void setTrackMood(String trackMood) {
        this.trackMood = trackMood;
    }

    public String getDailyPrompt() {
        return dailyPrompt;
    }

    public void setDailyPrompt(String dailyPrompt) {
        this.dailyPrompt = dailyPrompt;
    }

    public String getTrackStress() {
        return trackStress;
    }

    public void setTrackStress(String trackStress) {
        this.trackStress = trackStress;
    }
}