package com.fluir.backend.repository;

import com.fluir.backend.model.AssistenteRegistro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AssistenteRegistroRepository extends JpaRepository<AssistenteRegistro,Long> {
    List<AssistenteRegistro> findTop50ByUsuario_IdOrderByCriadoEmDesc(Integer usuarioId);
    Optional<AssistenteRegistro> findByUsuario_IdAndChaveCliente(Integer usuarioId,UUID chaveCliente);
    Optional<AssistenteRegistro> findByIdAndUsuario_Id(Long id,Integer usuarioId);
}
