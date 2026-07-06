package com.stormcloaks.krosis.service;

import com.stormcloaks.krosis.dto.relatorio.*;
import com.stormcloaks.krosis.model.*;
import com.stormcloaks.krosis.repository.LoteRepository;
import com.stormcloaks.krosis.repository.RelatorioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class RelatorioService {

    private final RelatorioRepository relatorioRepository;
    private final LoteRepository loteRepository;

    public RelatorioService(RelatorioRepository relatorioRepository,
                            LoteRepository loteRepository) {
        this.relatorioRepository = relatorioRepository;
        this.loteRepository      = loteRepository;
    }

    public List<RelatorioVencimentoDTO> proximosAoVencimento(int dias) {
        LocalDate limite = LocalDate.now().plusDays(dias);
        return relatorioRepository.buscarProximosAoVencimento(limite)
                .stream()
                .map(this::toVencimentoDTO)
                .toList();
    }

    public List<RelatorioVencimentoDTO> vencidos(Long categoriaId, Long fabricanteId,
                                                 LocalDate dataInicio, LocalDate dataFim) {
        return relatorioRepository
                .buscarVencidos(LocalDate.now(), categoriaId, fabricanteId, dataInicio, dataFim)
                .stream()
                .map(this::toVencimentoDTO)
                .toList();
    }

    public List<RelatorioMovimentacaoDTO>
    movimentacoes(String tipo, Long usuarioId,
                                                        LocalDateTime dataInicio,
                                                        LocalDateTime dataFim) {
        Movimentacao.Tipo tipoEnum = tipo != null ? Movimentacao.Tipo.valueOf(tipo) : null;
        return relatorioRepository
                .buscarMovimentacoes(tipoEnum, usuarioId, dataInicio, dataFim)
                .stream()
                .map(m -> {
                    RelatorioMovimentacaoDTO dto = new RelatorioMovimentacaoDTO();
                    dto.setId(m.getId());
                    dto.setTimestamp(m.getTimestamp());
                    dto.setNomeProduto(m.getProduto().getNome());
                    dto.setNumeroLote(m.getLote().getNumeroLote());
                    dto.setTipo(m.getTipo().name());
                    dto.setQuantidade(m.getQuantidade());
                    dto.setOperador(m.getUsuario().getNome());
                    return dto;
                })
                .toList();
    }

    public List<RelatorioEstoqueDTO> estoqueAtual(Boolean ativo, Long categoriaId,
                                                  Long fabricanteId) {
        return relatorioRepository.buscarEstoque(ativo, categoriaId, fabricanteId)
                .stream()
                .map(p -> {
                    List<Lote> lotes = loteRepository.findByProdutoId(p.getId());
                    RelatorioEstoqueDTO dto = new RelatorioEstoqueDTO();
                    dto.setProdutoId(p.getId());
                    dto.setNomeProduto(p.getNome());
                    dto.setCodigoBarras(p.getCodigoDeBarras());
                    dto.setCategoria(p.getCategoria().getNome());
                    dto.setFabricante(p.getFabricante().getNome());
                    dto.setAtivo(p.isAtivo());
                    dto.setQuantidadeTotal(lotes.stream().mapToInt(Lote::getQuantidade).sum());
                    dto.setLotesAtivos((long) lotes.size());
                    dto.setValidadeMaisProxima(
                            lotes.stream()
                                    .map(Lote::getValidade)
                                    .filter(v -> v.isAfter(LocalDate.now()))
                                    .min(LocalDate::compareTo)
                                    .orElse(null)
                    );
                    return dto;
                })
                .toList();
    }

    public List<RelatorioPorCategoriaDTO> porCategoriaOuFabricante(Long categoriaId,
                                                                   Long fabricanteId) {
        return relatorioRepository
                .buscarPorCategoriaOuFabricante(categoriaId, fabricanteId)
                .stream()
                .map(p -> {
                    List<Lote> lotes = loteRepository.findByProdutoId(p.getId());
                    RelatorioPorCategoriaDTO dto = new RelatorioPorCategoriaDTO();
                    dto.setProdutoId(p.getId());
                    dto.setNomeProduto(p.getNome());
                    dto.setCategoria(p.getCategoria().getNome());
                    dto.setFabricante(p.getFabricante().getNome());
                    dto.setQuantidadeEstoque(lotes.stream().mapToInt(Lote::getQuantidade).sum());
                    dto.setTotalLotes((long) lotes.size());
                    dto.setValidadeMaisProxima(
                            lotes.stream()
                                    .map(Lote::getValidade)
                                    .filter(v -> v.isAfter(LocalDate.now()))
                                    .min(LocalDate::compareTo)
                                    .orElse(null)
                    );
                    return dto;
                })
                .toList();
    }

    public List<RelatorioMovimentacaoDTO> historicoEntradas(Long usuarioId,
                                                            LocalDateTime dataInicio,
                                                            LocalDateTime dataFim) {
        return relatorioRepository
                .buscarHistoricoEntradas(usuarioId, dataInicio, dataFim)
                .stream()
                .map(m -> {
                    RelatorioMovimentacaoDTO dto = new RelatorioMovimentacaoDTO();
                    dto.setId(m.getId());
                    dto.setTimestamp(m.getTimestamp());
                    dto.setNomeProduto(m.getProduto().getNome());
                    dto.setNumeroLote(m.getLote().getNumeroLote());
                    dto.setTipo(m.getTipo().name());
                    dto.setQuantidade(m.getQuantidade());
                    dto.setOperador(m.getUsuario().getNome());
                    return dto;
                })
                .toList();
    }

    public List<RelatorioPorCategoriaDTO> semMovimentacao() {
        return relatorioRepository.buscarProdutosSemMovimentacao()
                .stream()
                .map(p -> {
                    RelatorioPorCategoriaDTO dto = new RelatorioPorCategoriaDTO();
                    dto.setProdutoId(p.getId());
                    dto.setNomeProduto(p.getNome());
                    dto.setCategoria(p.getCategoria().getNome());
                    dto.setFabricante(p.getFabricante().getNome());
                    dto.setQuantidadeEstoque(0);
                    dto.setTotalLotes(0L);
                    return dto;
                })
                .toList();
    }

    private RelatorioVencimentoDTO toVencimentoDTO(Lote l) {
        RelatorioVencimentoDTO dto = new RelatorioVencimentoDTO();
        dto.setLoteId(l.getId());
        dto.setNomeProduto(l.getProduto().getNome());
        dto.setCodigoBarras(l.getProduto().getCodigoDeBarras());
        dto.setNumeroLote(l.getNumeroLote());
        dto.setValidade(l.getValidade());
        dto.setDiasRestantes(ChronoUnit.DAYS.between(LocalDate.now(), l.getValidade()));
        dto.setQuantidade(l.getQuantidade());
        dto.setCategoria(l.getProduto().getCategoria().getNome());
        dto.setFabricante(l.getProduto().getFabricante().getNome());
        return dto;
    }
}