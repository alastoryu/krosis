package com.stormcloaks.krosis.service;

import com.stormcloaks.krosis.dto.EntradaLoteRequest;
import com.stormcloaks.krosis.dto.LoteDTO;
import com.stormcloaks.krosis.model.Lote;
import com.stormcloaks.krosis.model.Movimentacao;
import com.stormcloaks.krosis.model.Produto;
import com.stormcloaks.krosis.repository.LoteRepository;
import com.stormcloaks.krosis.repository.MovimentacaoRepository;
import com.stormcloaks.krosis.repository.ProdutoRepository;
import com.stormcloaks.krosis.security.UsuarioAutenticado;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EntradaService {

    private final ProdutoRepository produtoRepository;
    private final LoteRepository loteRepository;
    private final MovimentacaoRepository movimentacaoRepository;
    private final UsuarioAutenticado usuarioAutenticado;

    public EntradaService(ProdutoRepository produtoRepository,
                          LoteRepository loteRepository,
                          MovimentacaoRepository movimentacaoRepository,
                          UsuarioAutenticado usuarioAutenticado) {
        this.produtoRepository      = produtoRepository;
        this.loteRepository         = loteRepository;
        this.movimentacaoRepository = movimentacaoRepository;
        this.usuarioAutenticado     = usuarioAutenticado;
    }

    public Produto buscarPorCodigoBarras(String codigoBarras) {
        return produtoRepository.findByCodigoDeBarras(codigoBarras)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Produto não encontrado para o código: " + codigoBarras));
    }

    @Transactional
    public LoteDTO registrarEntrada(EntradaLoteRequest req) {
        Produto produto = buscarPorCodigoBarras(req.getCodigoBarras());

        Lote lote = new Lote();
        lote.setProduto(produto);
        lote.setNumeroLote(req.getNumeroLote());
        lote.setValidade(req.getValidade());
        lote.setQuantidade(req.getQuantidade());
        lote = loteRepository.save(lote);

        Movimentacao mov = new Movimentacao();
        mov.setTipo(Movimentacao.Tipo.ENTRADA);
        mov.setProduto(produto);
        mov.setLote(lote);
        mov.setQuantidade(req.getQuantidade());
        mov.setUsuario(usuarioAutenticado.get());
        movimentacaoRepository.save(mov);

        return toDTO(lote);
    }

    private LoteDTO toDTO(Lote lote) {
        LoteDTO dto = new LoteDTO();
        dto.setId(lote.getId());
        dto.setProdutoId(lote.getProduto().getId());
        dto.setNomeProduto(lote.getProduto().getNome());
        dto.setNumeroLote(lote.getNumeroLote());
        dto.setValidade(lote.getValidade());
        dto.setQuantidade(lote.getQuantidade());
        dto.setDataCriacao(lote.getDataCriacao());
        return dto;
    }
}