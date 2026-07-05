package com.stormcloaks.krosis.repository;

import com.stormcloaks.krosis.model.Movimentacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {
    Page<Movimentacao> findByProdutoId(Long produtoId, Pageable pageable);
}