package com.stormcloaks.krosis.controller;

import com.stormcloaks.krosis.dto.CategoriaCreateDTO;
import com.stormcloaks.krosis.dto.CategoriaDTO;
import com.stormcloaks.krosis.model.Categoria;
import com.stormcloaks.krosis.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    @Autowired private CategoriaService categoriaService;

    @GetMapping
    public Page<Categoria> listar(
            @RequestParam(required = false) String nome,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {

        return categoriaService.buscarComFiltro(nome, pageable);
    }

    @GetMapping("/{id}")
    public Categoria buscarPorId(@PathVariable Long id) {
        return categoriaService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Categoria criar(@RequestBody CategoriaCreateDTO dto) {
        return categoriaService.criarCategoria(dto);
    }

    @PutMapping("/{id}")
    public Categoria editar(@PathVariable Long id, @RequestBody CategoriaDTO dto) {
        if (!id.equals(dto.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID do path e do corpo não coincidem.");
        }

        return categoriaService.editarCategoria(dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        categoriaService.excluirCategoria(id);
    }
}
