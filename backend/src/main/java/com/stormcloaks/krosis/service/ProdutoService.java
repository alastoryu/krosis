package com.stormcloaks.krosis.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.stormcloaks.krosis.dto.ProdutoCreateDTO;
import com.stormcloaks.krosis.dto.ProdutoDTO;
import com.stormcloaks.krosis.model.Produto;
import com.stormcloaks.krosis.model.filtro.ProdutoFiltro;
import com.stormcloaks.krosis.model.Categoria;
import com.stormcloaks.krosis.model.Fabricante;
import com.stormcloaks.krosis.repository.ProdutoRepository;
import com.stormcloaks.krosis.repository.CategoriaRepository;
import com.stormcloaks.krosis.repository.FabricanteRepository;

@Service
public class ProdutoService {

    @Autowired private ProdutoRepository produtoRepository;
    @Autowired private CategoriaRepository categoriaRepository;
    @Autowired private FabricanteRepository fabricanteRepository;

    public Page<Produto> buscarComFiltro(String nome, Long categoriaId, Long fabricanteId, Pageable pageable) {
        Specification<Produto> spec = ProdutoFiltro.comFiltro(nome, categoriaId, fabricanteId);
        return produtoRepository.findAll(spec, pageable);
    }

    public ProdutoDTO buscarPorId(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));

        return toDTO(produto);
    }

    public ProdutoDTO criarProduto(ProdutoCreateDTO dto) {

        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setCodigoDeBarras(dto.getCodigoDeBarras());
        produto.setAtivo(dto.getAtivo());

        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));

        Fabricante fabricante = fabricanteRepository.findById(dto.getFabricanteId())
                .orElseThrow(() -> new EntityNotFoundException("Fabricante não encontrado"));

        produto.setCategoria(categoria);
        produto.setFabricante(fabricante);

        Produto novoProduto = produtoRepository.save(produto);

        ProdutoDTO produtoDTO = toDTO(novoProduto);
        return produtoDTO;
    }

    public ProdutoDTO editarProduto(Long id, ProdutoCreateDTO dto) {

        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));

        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setCodigoDeBarras(dto.getCodigoDeBarras());
        produto.setAtivo(dto.getAtivo());

        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));

        Fabricante fabricante = fabricanteRepository.findById(dto.getFabricanteId())
                .orElseThrow(() -> new EntityNotFoundException("Fabricante não encontrado"));

        produto.setCategoria(categoria);
        produto.setFabricante(fabricante);

        return toDTO(produtoRepository.save(produto));
    }

    @Transactional
    public void excluirProduto(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new EntityNotFoundException("Produto não encontrado");
        }

        produtoRepository.deleteById(id);
    }

    private ProdutoDTO toDTO(Produto produto) {
        ProdutoDTO dto = new ProdutoDTO();
        dto.setId(produto.getId());
        dto.setNome(produto.getNome());
        dto.setDescricao(produto.getDescricao());
        dto.setCodigoDeBarras(produto.getCodigoDeBarras());
        dto.setAtivo(produto.isAtivo());
        if (produto.getCategoria() != null) {
            dto.setCategoriaId(produto.getCategoria().getId());
            dto.setCategoriaNome(produto.getCategoria().getNome());
        }

        if (produto.getFabricante() != null) {
            dto.setFabricanteId(produto.getFabricante().getId());
            dto.setFabricanteNome(produto.getFabricante().getNome());
        }

        return dto;
    }
}