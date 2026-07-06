package com.fluir.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "modulos_usuario")
public class ModulosUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "usuario_id", nullable = false, unique = true)
    private Integer usuarioId;

    private Boolean timeline = true;
    private Boolean tasks = false;
    private Boolean habits = false;
    private Boolean sleep = false;
    private Boolean water = false;
    private Boolean finances = false;
    private Boolean diary = false;
    private Boolean nutrition = false;

    @Column(name = "physical_health")
    private Boolean physicalHealth = false;

    @Column(name = "menstrual_cycle")
    private Boolean menstrualCycle = false;

    private Boolean attachments = true;

    public Integer getId() {
        return id;
    }

    public Integer getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }

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