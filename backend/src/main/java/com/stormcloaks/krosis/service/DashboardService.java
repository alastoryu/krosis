package com.stormcloaks.krosis.service;

import com.stormcloaks.krosis.dto.DashboardResumoDTO;
import com.stormcloaks.krosis.model.Lote;
import com.stormcloaks.krosis.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ProdutoRepository    produtoRepository;
    private final CategoriaRepository  categoriaRepository;
    private final FabricanteRepository fabricanteRepository;
    private final UsuarioRepository    usuarioRepository;
    private final LoteRepository loteRepository;

    public DashboardService(ProdutoRepository produtoRepository,
                            CategoriaRepository categoriaRepository,
                            FabricanteRepository fabricanteRepository,
                            UsuarioRepository usuarioRepository,
                            LoteRepository loteRepository) {
        this.produtoRepository    = produtoRepository;
        this.categoriaRepository  = categoriaRepository;
        this.fabricanteRepository = fabricanteRepository;
        this.usuarioRepository    = usuarioRepository;
        this.loteRepository       = loteRepository;
    }
    public DashboardResumoDTO getResumo() {
        LocalDate hoje   = LocalDate.now();
        LocalDate em7    = hoje.plusDays(7);
        LocalDate em30   = hoje.plusDays(30);

        List<Lote> todosLotes = loteRepository.findAll();

        DashboardResumoDTO dto = new DashboardResumoDTO();

        dto.setTotalProdutos(produtoRepository.count());
        dto.setTotalCategorias(categoriaRepository.count());
        dto.setTotalFabricantes(fabricanteRepository.count());
        dto.setTotalUsuarios(usuarioRepository.count());
        dto.setTotalLotes(todosLotes.size());

        dto.setVencidosHoje(todosLotes.stream()
                .filter(l -> !l.getValidade().isAfter(hoje) && l.getQuantidade() > 0)
                .count());

        dto.setVencendoEm7Dias(todosLotes.stream()
                .filter(l -> l.getValidade().isAfter(hoje)
                        && !l.getValidade().isAfter(em7)
                        && l.getQuantidade() > 0)
                .count());

        dto.setVencendoEm30Dias(todosLotes.stream()
                .filter(l -> l.getValidade().isAfter(hoje)
                        && !l.getValidade().isAfter(em30)
                        && l.getQuantidade() > 0)
                .count());

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        List<DashboardResumoDTO.AlertaVencimentoDTO> alertas = todosLotes.stream()
                .filter(l -> !l.getValidade().isAfter(em30) && l.getQuantidade() > 0)
                .sorted(Comparator.comparing(Lote::getValidade))
                .limit(5)
                .map(l -> {
                    var alerta = new DashboardResumoDTO.AlertaVencimentoDTO();
                    alerta.setNomeProduto(l.getProduto().getNome());
                    alerta.setNumeroLote(l.getNumeroLote());
                    alerta.setValidade(l.getValidade().format(fmt));
                    alerta.setDiasRestantes(ChronoUnit.DAYS.between(hoje, l.getValidade()));
                    alerta.setQuantidade(l.getQuantidade());
                    return alerta;
                })
                .toList();
        dto.setAlertasCriticos(alertas);

        List<Map<String, Object>> porMes = new ArrayList<>();
        DateTimeFormatter mesFmt = DateTimeFormatter.ofPattern("MMM/yy", new Locale("pt", "BR"));
        for (int i = 0; i < 6; i++) {
            LocalDate inicio = hoje.plusMonths(i).withDayOfMonth(1);
            LocalDate fim    = inicio.withDayOfMonth(inicio.lengthOfMonth());
            long count = todosLotes.stream()
                    .filter(l -> !l.getValidade().isBefore(inicio)
                            && !l.getValidade().isAfter(fim)
                            && l.getQuantidade() > 0)
                    .count();
            Map<String, Object> ponto = new LinkedHashMap<>();
            ponto.put("mes", inicio.format(mesFmt));
            ponto.put("lotes", count);
            porMes.add(ponto);
        }
        dto.setVencimentosPorMes(porMes);

        List<Map<String, Object>> porCategoria = todosLotes.stream()
                .filter(l -> l.getQuantidade() > 0)
                .collect(Collectors.groupingBy(
                        l -> l.getProduto().getCategoria().getNome(),
                        Collectors.summingInt(Lote::getQuantidade)
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .map(e -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("categoria", e.getKey());
                    item.put("quantidade", e.getValue());
                    return item;
                })
                .toList();
        dto.setEstoquePorCategoria(porCategoria);

        return dto;
    }
}