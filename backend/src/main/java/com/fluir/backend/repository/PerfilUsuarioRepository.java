package com.fluir.backend.repository;

import com.fluir.backend.model.PerfilUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PerfilUsuarioRepository extends JpaRepository<PerfilUsuario, Integer> {

    Optional<PerfilUsuario> findByUsuarioId(Integer usuarioId);
}