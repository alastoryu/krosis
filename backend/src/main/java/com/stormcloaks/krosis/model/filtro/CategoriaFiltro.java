package com.stormcloaks.krosis.model.filtro;

import java.util.ArrayList;
import java.util.List;

import com.stormcloaks.krosis.model.Categoria;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;

public class CategoriaFiltro {

    public static Specification<Categoria> comFiltro(String nome) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (nome != null && !nome.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("nome")), "%" + nome.toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}