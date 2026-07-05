export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
  dataCriacao?: string;
  dataAtualizacao?: string;
}