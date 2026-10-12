package com.stormcloaks.krosis.controller;

import com.stormcloaks.krosis.model.Produto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.stormcloaks.krosis.dto.ProdutoCreateDTO;
import com.stormcloaks.krosis.dto.ProdutoDTO;
import com.stormcloaks.krosis.service.ProdutoService;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    public Page<Produto> listar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Long fabricanteId,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {

        return produtoService.buscarComFiltro(nome, categoriaId, fabricanteId, pageable);
    }

    @GetMapping("/{id}")
    public ProdutoDTO buscarPorId(@PathVariable Long id) {
        return produtoService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProdutoDTO criar(@RequestBody ProdutoCreateDTO dto) {
        return produtoService.criarProduto(dto);
    }

    @PutMapping("/{id}")
    public ProdutoDTO editar(@PathVariable Long id, @RequestBody ProdutoCreateDTO dto) {
        return produtoService.editarProduto(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        produtoService.excluirProduto(id);
    }
}