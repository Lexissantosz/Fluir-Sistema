package com.fluir.backend.repository;

import com.fluir.backend.model.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TarefaRepository extends JpaRepository<Tarefa, Integer> {

    List<Tarefa> findByUsuario_Id(Integer usuarioId);

    Optional<Tarefa> findFirstByUsuario_IdAndCategoriaOrderByIdDesc(
            Integer usuarioId,
            String categoria
    );
}