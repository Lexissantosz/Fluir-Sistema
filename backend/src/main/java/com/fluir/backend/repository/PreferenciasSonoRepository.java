package com.fluir.backend.repository;

import com.fluir.backend.model.PreferenciasSono;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PreferenciasSonoRepository extends JpaRepository<PreferenciasSono, Integer> {

    Optional<PreferenciasSono> findByUsuario_Id(Integer usuarioId);
}