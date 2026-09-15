package com.fluir.backend.dto;

public class AguaRequest {

    private Integer metaCalculadaMl;
    private Integer metaFinalMl;
    private String modoRegistro;
    private String dailyGoal;
    private String unit;
    private String reminders;
    private String reminderFrequency;

    public Integer getMetaCalculadaMl() {
        return metaCalculadaMl;
    }

    public void setMetaCalculadaMl(Integer metaCalculadaMl) {
        this.metaCalculadaMl = metaCalculadaMl;
    }

    public Integer getMetaFinalMl() {
        return metaFinalMl;
    }

    public void setMetaFinalMl(Integer metaFinalMl) {
        this.metaFinalMl = metaFinalMl;
    }

    public String getModoRegistro() {
        return modoRegistro;
    }

    public void setModoRegistro(String modoRegistro) {
        this.modoRegistro = modoRegistro;
    }

    public String getDailyGoal() {
    return dailyGoal;
    }

    public void setDailyGoal(String dailyGoal) {
        this.dailyGoal = dailyGoal;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getReminders() {
        return reminders;
    }

    public void setReminders(String reminders) {
        this.reminders = reminders;
    }

    public String getReminderFrequency() {
        return reminderFrequency;
    }

    public void setReminderFrequency(String reminderFrequency) {
        this.reminderFrequency = reminderFrequency;
    }
}