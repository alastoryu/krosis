package com.stormcloaks.krosis.controller;

import com.stormcloaks.krosis.dto.relatorio.*;
import com.stormcloaks.krosis.service.RelatorioService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    private final RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    @GetMapping("/vencimento")
    public List<RelatorioVencimentoDTO> proximosAoVencimento(
            @RequestParam(defaultValue = "30") int dias) {
        return relatorioService.proximosAoVencimento(dias);
    }

    @GetMapping("/vencidos")
    public List<RelatorioVencimentoDTO> vencidos(
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Long fabricanteId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        return relatorioService.vencidos(categoriaId, fabricanteId, dataInicio, dataFim);
    }

    @GetMapping("/movimentacoes")
    public List<RelatorioMovimentacaoDTO> movimentacoes(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        return relatorioService.movimentacoes(tipo, usuarioId, dataInicio, dataFim);
    }

    @GetMapping("/estoque")
    public List<RelatorioEstoqueDTO> estoqueAtual(
            @RequestParam(required = false) Boolean ativo,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Long fabricanteId) {
        return relatorioService.estoqueAtual(ativo, categoriaId, fabricanteId);
    }

    @GetMapping("/por-categoria")
    public List<RelatorioPorCategoriaDTO> porCategoria(
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Long fabricanteId) {
        return relatorioService.porCategoriaOuFabricante(categoriaId, fabricanteId);
    }

    @GetMapping("/historico-operador")
    public List<RelatorioMovimentacaoDTO> historicoOperador(
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim) {
        return relatorioService.historicoEntradas(usuarioId, dataInicio, dataFim);
    }

    @GetMapping("/sem-movimentacao")
    public List<RelatorioPorCategoriaDTO> semMovimentacao() {
        return relatorioService.semMovimentacao();
    }
}