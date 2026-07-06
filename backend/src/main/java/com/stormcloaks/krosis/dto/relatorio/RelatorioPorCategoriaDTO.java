package com.stormcloaks.krosis.dto.relatorio;

import java.time.LocalDate;

public class RelatorioPorCategoriaDTO {
    private Long produtoId;
    private String nomeProduto;
    private String categoria;
    private String fabricante;
    private Integer quantidadeEstoque;
    private Long totalLotes;
    private LocalDate validadeMaisProxima;

    public Long getProdutoId() { return produtoId; }
    public void setProdutoId(Long produtoId) { this.produtoId = produtoId; }

    public String getNomeProduto() { return nomeProduto; }
    public void setNomeProduto(String nomeProduto) { this.nomeProduto = nomeProduto; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getFabricante() { return fabricante; }
    public void setFabricante(String fabricante) { this.fabricante = fabricante; }

    public Integer getQuantidadeEstoque() { return quantidadeEstoque; }
    public void setQuantidadeEstoque(Integer quantidadeEstoque) { this.quantidadeEstoque = quantidadeEstoque; }

    public Long getTotalLotes() { return totalLotes; }
    public void setTotalLotes(Long totalLotes) { this.totalLotes = totalLotes; }

    public LocalDate getValidadeMaisProxima() { return validadeMaisProxima; }
    public void setValidadeMaisProxima(LocalDate validadeMaisProxima) { this.validadeMaisProxima = validadeMaisProxima; }
}