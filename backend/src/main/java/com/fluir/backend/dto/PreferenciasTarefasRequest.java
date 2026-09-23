package com.fluir.backend.dto;

import java.util.List;

public class PreferenciasTarefasRequest {

    private String preferredView;
    private String reminders;
    private List<String> categories;

    public String getPreferredView() {
        return preferredView;
    }

    public void setPreferredView(String preferredView) {
        this.preferredView = preferredView;
    }

    public String getReminders() {
        return reminders;
    }

    public void setReminders(String reminders) {
        this.reminders = reminders;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }
}