package com.fluir.backend.dto;

public class PreferenciasSonoRequest {

    private String sleepGoal;
    private String usualSleepTime;
    private String usualWakeTime;
    private String trackQuality;
    private String sleepDifficulty;
    private String sleepReminder;

    public String getSleepGoal() {
        return sleepGoal;
    }

    public void setSleepGoal(String sleepGoal) {
        this.sleepGoal = sleepGoal;
    }

    public String getUsualSleepTime() {
        return usualSleepTime;
    }

    public void setUsualSleepTime(String usualSleepTime) {
        this.usualSleepTime = usualSleepTime;
    }

    public String getUsualWakeTime() {
        return usualWakeTime;
    }

    public void setUsualWakeTime(String usualWakeTime) {
        this.usualWakeTime = usualWakeTime;
    }

    public String getTrackQuality() {
        return trackQuality;
    }

    public void setTrackQuality(String trackQuality) {
        this.trackQuality = trackQuality;
    }

    public String getSleepDifficulty() {
        return sleepDifficulty;
    }

    public void setSleepDifficulty(String sleepDifficulty) {
        this.sleepDifficulty = sleepDifficulty;
    }

    public String getSleepReminder() {
        return sleepReminder;
    }

    public void setSleepReminder(String sleepReminder) {
        this.sleepReminder = sleepReminder;
    }
}