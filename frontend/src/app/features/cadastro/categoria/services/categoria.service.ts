import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../../../core/models/Page';

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
  dataCriacao?: string;
  dataAtualizacao?: string;
}

export interface CreateCategoriaDTO {
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export interface CategoriaFiltro {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  nome?: string;
  ativo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private readonly baseUrl = 'http://localhost:8081/categorias';

  constructor(private http: HttpClient) {}

  listarCategorias(
    filtro?: CategoriaFiltro
  ): Observable<Page<Categoria>> {

    let params = new HttpParams();

    if (filtro) {
      if (filtro.page !== undefined) {
        params = params.set('page', filtro.page.toString());
      }

      if (filtro.size !== undefined) {
        params = params.set('size', filtro.size.toString());
      }

      if (filtro.sort) {
        params = params.set(
          'sort',
          `${filtro.sort},${filtro.direction || 'asc'}`
        );
      }

      if (filtro.nome) {
        params = params.set('nome', filtro.nome);
      }

      if (filtro.ativo !== undefined) {
        params = params.set('ativo', filtro.ativo.toString());
      }
    }

    return this.http.get<Page<Categoria>>(
      this.baseUrl,
      { params }
    );
  }

  buscarPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(
      `${this.baseUrl}/${id}`
    );
  }

  criarCategoria(
    categoria: CreateCategoriaDTO
  ): Observable<Categoria> {
    return this.http.post<Categoria>(
      this.baseUrl,
      categoria
    );
  }

  editarCategoria(
    id: number,
    categoria: CreateCategoriaDTO
  ): Observable<Categoria> {
    return this.http.put<Categoria>(
      `${this.baseUrl}/${id}`,
      categoria
    );
  }

  excluirCategoria(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${id}`
    );
  }
}