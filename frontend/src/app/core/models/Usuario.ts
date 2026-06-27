export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  ativo: boolean;
  role: string;
  dataCriacao?: string;
}