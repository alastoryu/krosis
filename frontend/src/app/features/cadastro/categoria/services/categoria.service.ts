import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Page } from "../../../../core/models/page.model";
import { environment } from "../../../../environments/environment";
import { CategoriaFiltro } from "../models/categoria-filtro.model";
import { Categoria } from "../models/categoria.model";
import { CreateCategoriaDTO } from "../models/categoria-create.model";

@Injectable({
  providedIn: "root",
})
export class CategoriaService {
  private readonly API = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  listarCategorias(filtro?: CategoriaFiltro): Observable<Page<Categoria>> {
    let params = new HttpParams();

    if (filtro) {
      if (filtro.page !== undefined) {
        params = params.set("page", filtro.page.toString());
      }

      if (filtro.size !== undefined) {
        params = params.set("size", filtro.size.toString());
      }

      if (filtro.sort) {
        params = params.set(
          "sort",
          `${filtro.sort},${filtro.direction || "asc"}`,
        );
      }

      if (filtro.nome) {
        params = params.set("nome", filtro.nome);
      }

      if (filtro.ativo !== undefined) {
        params = params.set("ativo", filtro.ativo.toString());
      }
    }

    return this.http.get<Page<Categoria>>(this.API, { params });
  }

  buscarPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.API}/${id}`);
  }

  criarCategoria(categoria: CreateCategoriaDTO): Observable<Categoria> {
    return this.http.post<Categoria>(this.API, categoria);
  }

  editarCategoria(
    id: number,
    categoria: CreateCategoriaDTO,
  ): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.API}/${id}`, categoria);
  }

  excluirCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
