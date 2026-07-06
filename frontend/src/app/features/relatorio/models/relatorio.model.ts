export interface RelatorioVencimento {
  loteId: number;
  nomeProduto: string;
  codigoBarras: string;
  numeroLote: string;
  validade: string;
  diasRestantes: number;
  quantidade: number;
  categoria: string;
  fabricante: string;
}

export interface RelatorioMovimentacao {
  id: number;
  timestamp: string;
  nomeProduto: string;
  numeroLote: string;
  tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
  quantidade: number;
  operador: string;
}

export interface RelatorioEstoque {
  produtoId: number;
  nomeProduto: string;
  codigoBarras: string;
  categoria: string;
  fabricante: string;
  ativo: boolean;
  quantidadeTotal: number;
  lotesAtivos: number;
  validadeMaisProxima: string | null;
}

export interface RelatorioPorCategoria {
  produtoId: number;
  nomeProduto: string;
  categoria: string;
  fabricante: string;
  quantidadeEstoque: number;
  totalLotes: number;
  validadeMaisProxima: string | null;
}