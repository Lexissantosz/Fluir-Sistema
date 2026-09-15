package com.fluir.backend.repository;

import com.fluir.backend.model.PreferenciasAlimentacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PreferenciasAlimentacaoRepository
        extends JpaRepository<PreferenciasAlimentacao, Integer> {

    Optional<PreferenciasAlimentacao> findByUsuario_Id(Integer usuarioId);
}