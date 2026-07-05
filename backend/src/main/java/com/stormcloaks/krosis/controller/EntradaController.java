package com.stormcloaks.krosis.controller;

import com.stormcloaks.krosis.dto.EntradaLoteRequest;
import com.stormcloaks.krosis.dto.LoteDTO;
import com.stormcloaks.krosis.model.Produto;
import com.stormcloaks.krosis.service.EntradaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/entrada")
public class EntradaController {

    private final EntradaService entradaService;

    public EntradaController(EntradaService entradaService) {
        this.entradaService = entradaService;
    }

    @GetMapping("/produto/{codigoBarras}")
    public ResponseEntity<Produto> buscarProduto(@PathVariable String codigoBarras) {
        return ResponseEntity.ok(entradaService.buscarPorCodigoBarras(codigoBarras));
    }

    @PostMapping
    public ResponseEntity<LoteDTO> registrar(@RequestBody EntradaLoteRequest req) {
        return ResponseEntity.status(201).body(entradaService.registrarEntrada(req));
    }
}