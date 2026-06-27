package com.stormcloaks.krosis.service;

import com.stormcloaks.krosis.dto.CategoriaCreateDTO;
import com.stormcloaks.krosis.dto.CategoriaDTO;
import com.stormcloaks.krosis.model.Categoria;
import com.stormcloaks.krosis.model.filtro.CategoriaFiltro;
import com.stormcloaks.krosis.repository.CategoriaRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CategoriaService {

	@Autowired private CategoriaRepository categoriaRepository;
	
	public Page<Categoria> buscarComFiltro(String nome, Pageable pageable) {
        Specification<Categoria> spec = CategoriaFiltro.comFiltro(nome);
        Page<Categoria> pageCategoria = categoriaRepository.findAll(spec, pageable);
        return pageCategoria;
    }

    public Categoria buscarPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrado"));
    }
    
    public Categoria criarCategoria(CategoriaCreateDTO dto) {
    	Categoria categoria = new Categoria();
    	categoria.setAtivo(dto.getAtivo());
    	categoria.setDescricao(dto.getDescricao());
    	categoria.setNome(dto.getNome());
    	
    	Categoria categoriaSalvo = categoriaRepository.save(categoria);
    	
    	return categoriaSalvo;
    }
    
    public Categoria editarCategoria(CategoriaDTO dto) {
    	Optional<Categoria> optionalCategoria = categoriaRepository.findById(dto.getId());

        if (optionalCategoria.isEmpty()) {
            throw new RuntimeException("Categoria não encontrado com ID: " + dto.getId());
        }

        Categoria categoria = optionalCategoria.get();
    	categoria.setAtivo(dto.isAtivo());
    	categoria.setDescricao(dto.getDescricao());
    	categoria.setNome(dto.getNome());
    	
    	Categoria categoriaoSalvo = categoriaRepository.save(categoria);
    	
    	return categoriaoSalvo;
    }
    
    @Transactional
    public void excluirCategoria(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoria com ID " + id + " não encontrado.");
        }

        categoriaRepository.deleteById(id);
    }
}
