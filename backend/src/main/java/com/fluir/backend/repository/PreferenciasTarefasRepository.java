package com.fluir.backend.repository;

import com.fluir.backend.model.PreferenciasTarefas;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PreferenciasTarefasRepository extends JpaRepository<PreferenciasTarefas, Integer> {

    Optional<PreferenciasTarefas> findByUsuario_Id(Integer usuarioId);
}