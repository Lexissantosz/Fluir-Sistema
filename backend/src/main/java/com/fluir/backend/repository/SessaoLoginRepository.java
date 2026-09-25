package com.fluir.backend.repository;

import java.time.Instant;

import com.fluir.backend.model.SessaoLogin;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SessaoLoginRepository
        extends JpaRepository<SessaoLogin, String> {

    long deleteByExpiraEmBefore(Instant instante);
}