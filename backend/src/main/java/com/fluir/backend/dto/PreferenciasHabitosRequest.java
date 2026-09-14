package com.fluir.backend.dto;

import java.util.List;

public class PreferenciasHabitosRequest {

    private String trackingType;
    private String weeklyGoal;
    private List<String> selectedHabits;

    public String getTrackingType() {
        return trackingType;
    }

    public void setTrackingType(String trackingType) {
        this.trackingType = trackingType;
    }

    public String getWeeklyGoal() {
        return weeklyGoal;
    }

    public void setWeeklyGoal(String weeklyGoal) {
        this.weeklyGoal = weeklyGoal;
    }

    public List<String> getSelectedHabits() {
        return selectedHabits;
    }

    public void setSelectedHabits(List<String> selectedHabits) {
        this.selectedHabits = selectedHabits;
    }
}