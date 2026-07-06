package com.fluir.backend.repository;

import com.fluir.backend.model.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TarefaRepository extends JpaRepository<Tarefa, Integer> {

    Optional<Tarefa> findFirstByUsuarioIdAndCategoriaOrderByIdDesc(Integer usuarioId, String categoria);
}