package com.stormcloaks.krosis.repository;

import com.stormcloaks.krosis.model.Lote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoteRepository extends JpaRepository<Lote, Long> {
    List<Lote> findByProdutoId(Long produtoId);
}