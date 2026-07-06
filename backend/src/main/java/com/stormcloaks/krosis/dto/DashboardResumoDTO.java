package com.stormcloaks.krosis.dto;

import java.util.List;
import java.util.Map;

public class DashboardResumoDTO {

    private Long totalProdutos;
    private Long totalCategorias;
    private Long totalFabricantes;
    private Long totalUsuarios;

    private long vencidosHoje;
    private long vencendoEm7Dias;
    private long vencendoEm30Dias;
    private long totalLotes;

    public DashboardResumoDTO() {
    }

    public DashboardResumoDTO(Long totalProdutos,
                              Long totalCategorias,
                              Long totalFabricantes,
                              Long totalUsuarios) {
        this.totalProdutos = totalProdutos;
        this.totalCategorias = totalCategorias;
        this.totalFabricantes = totalFabricantes;
        this.totalUsuarios = totalUsuarios;
    }

    public Long getTotalProdutos() {
        return totalProdutos;
    }

    public void setTotalProdutos(Long totalProdutos) {
        this.totalProdutos = totalProdutos;
    }

    public Long getTotalCategorias() {
        return totalCategorias;
    }

    public void setTotalCategorias(Long totalCategorias) {
        this.totalCategorias = totalCategorias;
    }

    public Long getTotalFabricantes() {
        return totalFabricantes;
    }

    public void setTotalFabricantes(Long totalFabricantes) {
        this.totalFabricantes = totalFabricantes;
    }

    public Long getTotalUsuarios() {
        return totalUsuarios;
    }

    public void setTotalUsuarios(Long totalUsuarios) {
        this.totalUsuarios = totalUsuarios;
    }

    private List<Map<String, Object>> vencimentosPorMes;

    private List<Map<String, Object>> estoquePorCategoria;

    private List<AlertaVencimentoDTO> alertasCriticos;

    public static class AlertaVencimentoDTO {
        private String nomeProduto;
        private String numeroLote;
        private String validade;
        private long diasRestantes;
        private int quantidade;

        public String getNomeProduto() { return nomeProduto; }
        public void setNomeProduto(String nomeProduto) { this.nomeProduto = nomeProduto; }

        public String getNumeroLote() { return numeroLote; }
        public void setNumeroLote(String numeroLote) { this.numeroLote = numeroLote; }

        public String getValidade() { return validade; }
        public void setValidade(String validade) { this.validade = validade; }

        public long getDiasRestantes() { return diasRestantes; }
        public void setDiasRestantes(long diasRestantes) { this.diasRestantes = diasRestantes; }

        public int getQuantidade() { return quantidade; }
        public void setQuantidade(int quantidade) { this.quantidade = quantidade; }
    }

    public long getVencidosHoje() { return vencidosHoje; }
    public void setVencidosHoje(long vencidosHoje) { this.vencidosHoje = vencidosHoje; }

    public long getVencendoEm7Dias() { return vencendoEm7Dias; }
    public void setVencendoEm7Dias(long vencendoEm7Dias) { this.vencendoEm7Dias = vencendoEm7Dias; }

    public long getVencendoEm30Dias() { return vencendoEm30Dias; }
    public void setVencendoEm30Dias(long vencendoEm30Dias) { this.vencendoEm30Dias = vencendoEm30Dias; }

    public long getTotalLotes() { return totalLotes; }
    public void setTotalLotes(long totalLotes) { this.totalLotes = totalLotes; }

    public List<Map<String, Object>> getVencimentosPorMes() { return vencimentosPorMes; }
    public void setVencimentosPorMes(List<Map<String, Object>> vencimentosPorMes) { this.vencimentosPorMes = vencimentosPorMes; }

    public List<Map<String, Object>> getEstoquePorCategoria() { return estoquePorCategoria; }
    public void setEstoquePorCategoria(List<Map<String, Object>> estoquePorCategoria) { this.estoquePorCategoria = estoquePorCategoria; }

    public List<AlertaVencimentoDTO> getAlertasCriticos() { return alertasCriticos; }
    public void setAlertasCriticos(List<AlertaVencimentoDTO> alertasCriticos) { this.alertasCriticos = alertasCriticos; }

}