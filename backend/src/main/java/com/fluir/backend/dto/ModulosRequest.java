package com.fluir.backend.dto;

public class ModulosRequest {

    private Boolean timeline;
    private Boolean tasks;
    private Boolean habits;
    private Boolean sleep;
    private Boolean water;
    private Boolean finances;
    private Boolean diary;
    private Boolean nutrition;
    private Boolean physicalHealth;
    private Boolean menstrualCycle;
    private Boolean attachments;

    public Boolean getTimeline() {
        return timeline;
    }

    public void setTimeline(Boolean timeline) {
        this.timeline = timeline;
    }

    public Boolean getTasks() {
        return tasks;
    }

    public void setTasks(Boolean tasks) {
        this.tasks = tasks;
    }

    public Boolean getHabits() {
        return habits;
    }

    public void setHabits(Boolean habits) {
        this.habits = habits;
    }

    public Boolean getSleep() {
        return sleep;
    }

    public void setSleep(Boolean sleep) {
        this.sleep = sleep;
    }

    public Boolean getWater() {
        return water;
    }

    public void setWater(Boolean water) {
        this.water = water;
    }

    public Boolean getFinances() {
        return finances;
    }

    public void setFinances(Boolean finances) {
        this.finances = finances;
    }

    public Boolean getDiary() {
        return diary;
    }

    public void setDiary(Boolean diary) {
        this.diary = diary;
    }

    public Boolean getNutrition() {
        return nutrition;
    }

    public void setNutrition(Boolean nutrition) {
        this.nutrition = nutrition;
    }

    public Boolean getPhysicalHealth() {
        return physicalHealth;
    }

    public void setPhysicalHealth(Boolean physicalHealth) {
        this.physicalHealth = physicalHealth;
    }

    public Boolean getMenstrualCycle() {
        return menstrualCycle;
    }

    public void setMenstrualCycle(Boolean menstrualCycle) {
        this.menstrualCycle = menstrualCycle;
    }

    public Boolean getAttachments() {
        return attachments;
    }

    public void setAttachments(Boolean attachments) {
        this.attachments = attachments;
    }
}