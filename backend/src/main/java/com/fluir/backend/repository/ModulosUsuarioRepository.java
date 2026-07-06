package com.fluir.backend.repository;

import com.fluir.backend.model.ModulosUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ModulosUsuarioRepository extends JpaRepository<ModulosUsuario, Integer> {

    Optional<ModulosUsuario> findByUsuarioId(Integer usuarioId);
}