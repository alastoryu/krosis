package com.stormcloaks.krosis.dto.relatorio;

import java.time.LocalDateTime;

public class RelatorioMovimentacaoDTO {
    private Long id;
    private LocalDateTime timestamp;
    private String nomeProduto;
    private String numeroLote;
    private String tipo;
    private Integer quantidade;
    private String operador;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getNomeProduto() { return nomeProduto; }
    public void setNomeProduto(String nomeProduto) { this.nomeProduto = nomeProduto; }

    public String getNumeroLote() { return numeroLote; }
    public void setNumeroLote(String numeroLote) { this.numeroLote = numeroLote; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public String getOperador() { return operador; }
    public void setOperador(String operador) { this.operador = operador; }
}