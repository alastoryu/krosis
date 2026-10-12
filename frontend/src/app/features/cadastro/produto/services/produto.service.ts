import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Page } from "../../../../core/models/page.model";
import { environment } from "../../../../environments/environment";
import { ProdutoFiltro } from "../models/produto-filtro.model";
import { Produto } from "../models/produto.model";

@Injectable({
  providedIn: "root",
})
export class ProdutoService {
  private readonly API = `${environment.apiUrl}/api/produtos`;

  constructor(private http: HttpClient) {}

  listarProdutos(filtro?: ProdutoFiltro): Observable<Page<Produto>> {
    let params = new HttpParams();

    if (filtro) {
      if (filtro.page !== undefined)
        params = params.set("page", filtro.page.toString());

      if (filtro.size !== undefined)
        params = params.set("size", filtro.size.toString());

      if (filtro.sort)
        params = params.set(
          "sort",
          `${filtro.sort},${filtro.direction || "asc"}`,
        );

      if (filtro.nome) params = params.set("nome", filtro.nome);

      if (filtro.ativo !== undefined)
        params = params.set("ativo", filtro.ativo.toString());

      if (filtro.categoriaId)
        params = params.set("categoriaId", filtro.categoriaId.toString());

      if (filtro.fabricanteId)
        params = params.set("fabricanteId", filtro.fabricanteId.toString());
    }

    return this.http.get<Page<Produto>>(this.API, { params });
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.API}/${id}`);
  }

  criarProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.API, produto);
  }

  editarProduto(produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.API}/${produto.id}`, produto);
  }

  excluirProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
