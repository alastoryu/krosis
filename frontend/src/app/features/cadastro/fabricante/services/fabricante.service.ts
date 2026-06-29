import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../../../core/models/page.model';

export interface Fabricante {
  id?: number;
  nome: string;
  descricao?: string;
  paisOrigem?: string;
  ativo: boolean;
}

export interface FabricanteFiltro {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  nome?: string;
  paisOrigem?: string;
  ativo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FabricanteService {

  private readonly baseUrl = 'http://localhost:8081/fabricantes';

  constructor(private http: HttpClient) { }

  listarFabricantes(filtro?: FabricanteFiltro): Observable<Page<Fabricante>> {
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

      if (filtro.paisOrigem) {
        params = params.set('paisOrigem', filtro.paisOrigem);
      }

      if (filtro.ativo !== undefined) {
        params = params.set('ativo', filtro.ativo.toString());
      }
    }

    return this.http.get<Page<Fabricante>>(this.baseUrl, { params });
  }

  buscarPorId(id: number): Observable<Fabricante> {
    return this.http.get<Fabricante>(`${this.baseUrl}/${id}`);
  }

  criarFabricante(fabricante: Fabricante): Observable<Fabricante> {
    return this.http.post<Fabricante>(this.baseUrl, fabricante);
  }

  editarFabricante(fabricante: Fabricante): Observable<Fabricante> {
    return this.http.put<Fabricante>(
      `${this.baseUrl}/${fabricante.id}`,
      fabricante
    );
  }

  excluirFabricante(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}