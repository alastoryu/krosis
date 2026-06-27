package com.stormcloaks.krosis.service;

import com.stormcloaks.krosis.dto.FabricanteCreateDTO;
import com.stormcloaks.krosis.dto.FabricanteDTO;
import com.stormcloaks.krosis.model.Fabricante;
import com.stormcloaks.krosis.model.filtro.FabricanteFiltro;
import com.stormcloaks.krosis.repository.FabricanteRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FabricanteService {

    @Autowired private FabricanteRepository fabricanteRepository;

    public Page<Fabricante> buscarComFiltro(String nome, String paisOrigem, Pageable pageable) {
        Specification<Fabricante> spec = FabricanteFiltro.comFiltro(nome, paisOrigem);
        Page<Fabricante> pageFabricante = fabricanteRepository.findAll(spec, pageable);
        return pageFabricante;
    }

    public Fabricante buscarPorId(Long id) {
        return fabricanteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fabricante não encontrado"));
    }

    public Fabricante criarFabricante(FabricanteCreateDTO dto) {
        Fabricante fabricante = new Fabricante();
        fabricante.setAtivo(dto.getAtivo());
        fabricante.setDescricao(dto.getDescricao());
        fabricante.setNome(dto.getNome());
        fabricante.setPaisOrigem(dto.getPaisOrigem());

        Fabricante fabricanteSalvo = fabricanteRepository.save(fabricante);

        return fabricanteSalvo;
    }

    public Fabricante editarFabricante(FabricanteDTO dto) {
        Optional<Fabricante> optionalFabricante = fabricanteRepository.findById(dto.getId());

        if (optionalFabricante.isEmpty()) {
            throw new RuntimeException("Fabricante não encontrado com ID: " + dto.getId());
        }

        Fabricante fabricante = optionalFabricante.get();
        fabricante.setAtivo(dto.isAtivo());
        fabricante.setDescricao(dto.getDescricao());
        fabricante.setNome(dto.getNome());
        fabricante.setPaisOrigem(dto.getPaisOrigem());

        Fabricante fabricanteoSalvo = fabricanteRepository.save(fabricante);

        return fabricanteoSalvo;
    }

    @Transactional
    public void excluirFabricante(Long id) {
        if (!fabricanteRepository.existsById(id)) {
            throw new RuntimeException("Fabricante com ID " + id + " não encontrado.");
        }

        fabricanteRepository.deleteById(id);
    }
}
