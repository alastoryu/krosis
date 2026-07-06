package com.stormcloaks.krosis.dto.relatorio;

import java.time.LocalDate;

public class RelatorioEstoqueDTO {
    private Long produtoId;
    private String nomeProduto;
    private String codigoBarras;
    private String categoria;
    private String fabricante;
    private Boolean ativo;
    private Integer quantidadeTotal;
    private Long lotesAtivos;
    private LocalDate validadeMaisProxima;

    public Long getProdutoId() { return produtoId; }
    public void setProdutoId(Long produtoId) { this.produtoId = produtoId; }

    public String getNomeProduto() { return nomeProduto; }
    public void setNomeProduto(String nomeProduto) { this.nomeProduto = nomeProduto; }

    public String getCodigoBarras() { return codigoBarras; }
    public void setCodigoBarras(String codigoBarras) { this.codigoBarras = codigoBarras; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getFabricante() { return fabricante; }
    public void setFabricante(String fabricante) { this.fabricante = fabricante; }

    public Boolean isAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }

    public Integer getQuantidadeTotal() { return quantidadeTotal; }
    public void setQuantidadeTotal(Integer quantidadeTotal) { this.quantidadeTotal = quantidadeTotal; }

    public Long getLotesAtivos() { return lotesAtivos; }
    public void setLotesAtivos(Long lotesAtivos) { this.lotesAtivos = lotesAtivos; }

    public LocalDate getValidadeMaisProxima() { return validadeMaisProxima; }
    public void setValidadeMaisProxima(LocalDate validadeMaisProxima) { this.validadeMaisProxima = validadeMaisProxima; }
}