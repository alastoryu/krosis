package com.stormcloaks.krosis.repository;

import com.stormcloaks.krosis.model.Lote;
import com.stormcloaks.krosis.model.Movimentacao;
import com.stormcloaks.krosis.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface RelatorioRepository extends JpaRepository<Lote, Long> {

    @Query("""
        SELECT l FROM Lote l
        JOIN FETCH l.produto p
        JOIN FETCH p.categoria c
        JOIN FETCH p.fabricante f
        WHERE l.validade <= :dataLimite
          AND l.quantidade > 0
        ORDER BY l.validade ASC
    """)
    List<Lote> buscarProximosAoVencimento(@Param("dataLimite") LocalDate dataLimite);

    @Query("""
        SELECT l FROM Lote l
        JOIN FETCH l.produto p
        JOIN FETCH p.categoria c
        JOIN FETCH p.fabricante f
        WHERE l.validade < :hoje
          AND l.quantidade > 0
          AND (:categoriaId IS NULL OR c.id = :categoriaId)
          AND (:fabricanteId IS NULL OR f.id = :fabricanteId)
          AND (:dataInicio IS NULL OR l.validade >= :dataInicio)
          AND (:dataFim IS NULL OR l.validade <= :dataFim)
        ORDER BY l.validade ASC
    """)
    List<Lote> buscarVencidos(
            @Param("hoje") LocalDate hoje,
            @Param("categoriaId") Long categoriaId,
            @Param("fabricanteId") Long fabricanteId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim
    );

    @Query("""
        SELECT m FROM Movimentacao m
        JOIN FETCH m.produto p
        JOIN FETCH m.lote l
        JOIN FETCH m.usuario u
        WHERE (:tipo IS NULL OR m.tipo = :tipo)
          AND (:usuarioId IS NULL OR u.id = :usuarioId)
          AND (:dataInicio IS NULL OR m.timestamp >= :dataInicio)
          AND (:dataFim IS NULL OR m.timestamp <= :dataFim)
        ORDER BY m.timestamp DESC
    """)
    List<Movimentacao> buscarMovimentacoes(
            @Param("tipo") Movimentacao.Tipo tipo,
            @Param("usuarioId") Long usuarioId,
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim
    );

    @Query("""
        SELECT p FROM Produto p
        JOIN FETCH p.categoria c
        JOIN FETCH p.fabricante f
        WHERE (:ativo IS NULL OR p.ativo = :ativo)
          AND (:categoriaId IS NULL OR c.id = :categoriaId)
          AND (:fabricanteId IS NULL OR f.id = :fabricanteId)
        ORDER BY p.nome ASC
    """)
    List<Produto> buscarEstoque(
            @Param("ativo") Boolean ativo,
            @Param("categoriaId") Long categoriaId,
            @Param("fabricanteId") Long fabricanteId
    );

    @Query("""
        SELECT p FROM Produto p
        JOIN FETCH p.categoria c
        JOIN FETCH p.fabricante f
        WHERE (:categoriaId IS NULL OR c.id = :categoriaId)
          AND (:fabricanteId IS NULL OR f.id = :fabricanteId)
        ORDER BY c.nome ASC, p.nome ASC
    """)
    List<Produto> buscarPorCategoriaOuFabricante(
            @Param("categoriaId") Long categoriaId,
            @Param("fabricanteId") Long fabricanteId
    );

    @Query("""
        SELECT m FROM Movimentacao m
        JOIN FETCH m.produto p
        JOIN FETCH m.lote l
        JOIN FETCH m.usuario u
        WHERE m.tipo = 'ENTRADA'
          AND (:usuarioId IS NULL OR u.id = :usuarioId)
          AND (:dataInicio IS NULL OR m.timestamp >= :dataInicio)
          AND (:dataFim IS NULL OR m.timestamp <= :dataFim)
        ORDER BY u.nome ASC, m.timestamp DESC
    """)
    List<Movimentacao> buscarHistoricoEntradas(
            @Param("usuarioId") Long usuarioId,
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim
    );

    @Query("""
        SELECT p FROM Produto p
        WHERE p.id NOT IN (
            SELECT DISTINCT l.produto.id FROM Lote l
        )
        ORDER BY p.nome ASC
    """)
    List<Produto> buscarProdutosSemMovimentacao();
}