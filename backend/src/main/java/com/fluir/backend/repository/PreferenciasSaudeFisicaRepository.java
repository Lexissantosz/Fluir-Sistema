package com.fluir.backend.repository;

import com.fluir.backend.model.PreferenciasSaudeFisica;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PreferenciasSaudeFisicaRepository
        extends JpaRepository<PreferenciasSaudeFisica, Integer> {

    Optional<PreferenciasSaudeFisica> findByUsuario_Id(Integer usuarioId);
}