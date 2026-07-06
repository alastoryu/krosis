export interface AlertaVencimento {
  nomeProduto: string;
  numeroLote: string;
  validade: string;
  diasRestantes: number;
  quantidade: number;
}

export interface VencimentoMes {
  mes: string;
  lotes: number;
}

export interface EstoqueCategoria {
  categoria: string;
  quantidade: number;
}

export interface DashboardResumo {
  totalProdutos: number;
  totalCategorias: number;
  totalFabricantes: number;
  totalUsuarios: number;
  totalLotes: number;
  vencidosHoje: number;
  vencendoEm7Dias: number;
  vencendoEm30Dias: number;
  vencimentosPorMes: VencimentoMes[];
  estoquePorCategoria: EstoqueCategoria[];
  alertasCriticos: AlertaVencimento[];
}