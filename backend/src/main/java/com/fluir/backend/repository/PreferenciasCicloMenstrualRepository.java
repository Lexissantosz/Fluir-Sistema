package com.fluir.backend.repository;

import com.fluir.backend.model.PreferenciasCicloMenstrual;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PreferenciasCicloMenstrualRepository
        extends JpaRepository<PreferenciasCicloMenstrual, Integer> {

    Optional<PreferenciasCicloMenstrual> findByUsuario_Id(Integer usuarioId);
}