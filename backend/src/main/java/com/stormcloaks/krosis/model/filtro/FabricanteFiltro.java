package com.stormcloaks.krosis.model.filtro;

import com.stormcloaks.krosis.model.Fabricante;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class FabricanteFiltro {
    public static Specification<Fabricante> comFiltro(String nome, String paisOrigem) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (nome != null && !nome.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("nome")), "%" + nome.toLowerCase() + "%"));
            }

            if (paisOrigem != null && !paisOrigem.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("paisOrigem")), "%" + paisOrigem.toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
