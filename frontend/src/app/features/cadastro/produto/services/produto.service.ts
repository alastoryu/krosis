import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../../../core/models/Page';

export interface Categoria {
  id: number;
  nome: string;
}

export interface Fabricante {
  id: number;
  nome: string;
}

export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  codigoDeBarras: string;

  categoria: Categoria;
  fabricante: Fabricante;

  ativo: boolean;
}

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

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private readonly baseUrl = 'http://localhost:8081/produtos';

  constructor(private http: HttpClient) {}

  listarProdutos(filtro?: ProdutoFiltro): Observable<Page<Produto>> {

    let params = new HttpParams();

    if (filtro) {
      if (filtro.page !== undefined)
        params = params.set('page', filtro.page.toString());

      if (filtro.size !== undefined)
        params = params.set('size', filtro.size.toString());

      if (filtro.sort)
        params = params.set('sort', `${filtro.sort},${filtro.direction || 'asc'}`);

      if (filtro.nome)
        params = params.set('nome', filtro.nome);

      if (filtro.ativo !== undefined)
        params = params.set('ativo', filtro.ativo.toString());

      if (filtro.categoriaId)
        params = params.set('categoriaId', filtro.categoriaId.toString());

      if (filtro.fabricanteId)
        params = params.set('fabricanteId', filtro.fabricanteId.toString());
    }

    return this.http.get<Page<Produto>>(this.baseUrl, { params });
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/${id}`);
  }

  criarProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.baseUrl, produto);
  }

  editarProduto(produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(
      `${this.baseUrl}/${produto.id}`,
      produto
    );
  }

  excluirProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}