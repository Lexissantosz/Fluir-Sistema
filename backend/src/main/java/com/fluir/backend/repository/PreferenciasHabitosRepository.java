package com.fluir.backend.repository;

import com.fluir.backend.model.PreferenciasHabitos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PreferenciasHabitosRepository extends JpaRepository<PreferenciasHabitos, Integer> {

    Optional<PreferenciasHabitos> findByUsuario_Id(Integer usuarioId);
}