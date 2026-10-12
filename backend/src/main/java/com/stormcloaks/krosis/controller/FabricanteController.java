package com.stormcloaks.krosis.controller;

import com.stormcloaks.krosis.dto.FabricanteCreateDTO;
import com.stormcloaks.krosis.dto.FabricanteDTO;
import com.stormcloaks.krosis.model.Fabricante;
import com.stormcloaks.krosis.service.FabricanteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/fabricantes")
public class FabricanteController {

    @Autowired private FabricanteService fabricanteService;

    @GetMapping
    public Page<Fabricante> listar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String paisOrigem,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {

        return fabricanteService.buscarComFiltro(nome, paisOrigem, pageable);
    }

    @GetMapping("/{id}")
    public Fabricante buscarPorId(@PathVariable Long id) {
        return fabricanteService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Fabricante criar(@RequestBody FabricanteCreateDTO dto) {
        return fabricanteService.criarFabricante(dto);
    }

    @PutMapping("/{id}")
    public Fabricante editar(@PathVariable Long id, @RequestBody FabricanteDTO dto) {
        if (!id.equals(dto.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID do path e do corpo não coincidem.");
        }

        return fabricanteService.editarFabricante(dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        fabricanteService.excluirFabricante(id);
    }
}
