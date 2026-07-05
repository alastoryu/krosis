export interface ProdutoFiltro {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';

  nome?: string;
  ativo?: boolean;

  categoriaId?: number;
  fabricanteId?: number;
}