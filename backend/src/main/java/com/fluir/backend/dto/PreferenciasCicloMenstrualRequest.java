package com.fluir.backend.dto;

import java.util.List;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;

import jakarta.validation.constraints.AssertTrue;

public class PreferenciasCicloMenstrualRequest {

    private String currentlyMenstruates;
    private String regularCycle;
    private String lastPeriodDate;
    private String cycleLength;
    private String bleedingLength;
    private String cramps;
    private String pregnant;
    private String breastfeeding;
    private String hormonalMethod;
    private String reminders;
    private List<String> symptoms;

    public String getCurrentlyMenstruates() {
        return currentlyMenstruates;
    }

    public void setCurrentlyMenstruates(String currentlyMenstruates) {
        this.currentlyMenstruates = currentlyMenstruates;
    }

    public String getRegularCycle() {
        return regularCycle;
    }

    public void setRegularCycle(String regularCycle) {
        this.regularCycle = regularCycle;
    }

    public String getLastPeriodDate() {
        return lastPeriodDate;
    }

    public void setLastPeriodDate(String lastPeriodDate) {
        this.lastPeriodDate = lastPeriodDate;
    }

    public String getCycleLength() {
        return cycleLength;
    }

    public void setCycleLength(String cycleLength) {
        this.cycleLength = cycleLength;
    }

    public String getBleedingLength() {
        return bleedingLength;
    }

    public void setBleedingLength(String bleedingLength) {
        this.bleedingLength = bleedingLength;
    }

    public String getCramps() {
        return cramps;
    }

    public void setCramps(String cramps) {
        this.cramps = cramps;
    }

    public String getPregnant() {
        return pregnant;
    }

    public void setPregnant(String pregnant) {
        this.pregnant = pregnant;
    }

    public String getBreastfeeding() {
        return breastfeeding;
    }

    public void setBreastfeeding(String breastfeeding) {
        this.breastfeeding = breastfeeding;
    }

    public String getHormonalMethod() {
        return hormonalMethod;
    }

    public void setHormonalMethod(String hormonalMethod) {
        this.hormonalMethod = hormonalMethod;
    }

    public String getReminders() {
        return reminders;
    }

    public void setReminders(String reminders) {
        this.reminders = reminders;
    }

    public List<String> getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(List<String> symptoms) {
        this.symptoms = symptoms;
    }

    @AssertTrue(
            message = "A data da última menstruação deve ser válida e não pode estar no futuro"
    )
    public boolean isLastPeriodDateValida() {
        if (lastPeriodDate == null || lastPeriodDate.isBlank()) {
            return true;
        }

        try {
            LocalDate data = LocalDate.parse(lastPeriodDate);

            return !data.isAfter(LocalDate.now());
        } catch (DateTimeParseException erro) {
            return false;
        }
    }
}