package com.fluir.backend.repository;

import com.fluir.backend.model.PreferenciasFinancas;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PreferenciasFinancasRepository extends JpaRepository<PreferenciasFinancas, Integer> {

    Optional<PreferenciasFinancas> findByUsuario_Id(Integer usuarioId);
}