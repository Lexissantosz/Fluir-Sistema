package com.fluir.backend.repository;

import com.fluir.backend.model.Habito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HabitoRepository extends JpaRepository<Habito, Integer> {

    Optional<Habito> findFirstByUsuarioIdAndCategoriaOrderByIdDesc(Integer usuarioId, String categoria);
}