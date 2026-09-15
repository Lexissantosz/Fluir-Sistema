package com.fluir.backend.repository;

import com.fluir.backend.model.PreferenciasDiario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PreferenciasDiarioRepository extends JpaRepository<PreferenciasDiario, Integer> {

    Optional<PreferenciasDiario> findByUsuario_Id(Integer usuarioId);
}