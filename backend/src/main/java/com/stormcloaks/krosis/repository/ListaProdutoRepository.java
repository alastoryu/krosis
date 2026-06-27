package com.stormcloaks.krosis.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.stormcloaks.krosis.model.ListaProduto;

@Repository
public interface ListaProdutoRepository extends JpaRepository<ListaProduto, Long>, JpaSpecificationExecutor<ListaProduto> {

    Optional<ListaProduto> findById(Long id);

    // Outros métodos são herdados de JpaRepository
}
