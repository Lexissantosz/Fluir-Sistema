package com.fluir.backend.repository;

import com.fluir.backend.model.PreferenciasAnexos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PreferenciasAnexosRepository
        extends JpaRepository<PreferenciasAnexos, Integer> {

    Optional<PreferenciasAnexos> findByUsuario_Id(Integer usuarioId);
}