export interface FabricanteFiltro {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  nome?: string;
  paisOrigem?: string;
  ativo?: boolean;
}