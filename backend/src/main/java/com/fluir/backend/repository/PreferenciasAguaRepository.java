package com.fluir.backend.repository;

import com.fluir.backend.model.PreferenciasAgua;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PreferenciasAguaRepository extends JpaRepository<PreferenciasAgua, Integer> {

    Optional<PreferenciasAgua> findByUsuarioId(Integer usuarioId);
}