package com.stormcloaks.krosis.dto;

public class DashboardResumoDTO {

    private Long totalProdutos;
    private Long totalCategorias;
    private Long totalFabricantes;
    private Long totalUsuarios;

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
}