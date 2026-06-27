package com.stormcloaks.krosis.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.stormcloaks.krosis.dto.UsuarioCreateDTO;
import com.stormcloaks.krosis.dto.UsuarioDTO;
import com.stormcloaks.krosis.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public Page<UsuarioDTO> listar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String email,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {

        return usuarioService.buscarComFiltro(nome, email, pageable);
    }

    @GetMapping("/{id}")
    public UsuarioDTO buscarPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioDTO criar(@RequestBody UsuarioCreateDTO dto) {
        return usuarioService.criar(dto);
    }

    @PutMapping("/{id}")
    public UsuarioDTO atualizar(@PathVariable Long id,
                                @RequestBody UsuarioCreateDTO dto) {
        return usuarioService.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        usuarioService.excluir(id);
    }
}