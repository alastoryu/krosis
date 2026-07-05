export interface CategoriaFiltro {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  nome?: string;
  ativo?: boolean;
}