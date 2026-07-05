import { Categoria } from "../../categoria/models/categoria.model";
import { Fabricante } from "../../fabricante/models/fabricante.model";

export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  codigoDeBarras: string;

  categoria: Categoria;
  fabricante: Fabricante;

  ativo: boolean;
}