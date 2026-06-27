package com.stormcloaks.krosis.model.filtro;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.stormcloaks.krosis.model.Produto;

import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Join;

import com.stormcloaks.krosis.model.Categoria;
import com.stormcloaks.krosis.model.Fabricante;

public class ProdutoFiltro {

    public static Specification<Produto> comFiltro(String nome, Long categoriaId, Long fabricanteId) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (nome != null && !nome.isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("nome")),
                                "%" + nome.toLowerCase() + "%"
                        )
                );
            }

            if (categoriaId != null) {
                Join<Produto, Categoria> categoriaJoin = root.join("categoria");
                predicates.add(cb.equal(categoriaJoin.get("id"), categoriaId));
            }

            if (fabricanteId != null) {
                Join<Produto, Fabricante> fabricanteJoin = root.join("fabricante");
                predicates.add(cb.equal(fabricanteJoin.get("id"), fabricanteId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}