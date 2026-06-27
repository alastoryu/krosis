package com.stormcloaks.krosis.repository;

import com.stormcloaks.krosis.model.Fabricante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface FabricanteRepository extends JpaRepository<Fabricante, Long>, JpaSpecificationExecutor<Fabricante> {

}
