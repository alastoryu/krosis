import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Page } from "../../../../core/models/page.model";
import { FabricanteFiltro } from "../models/fabricante-filtro.model";
import { Fabricante } from "../models/fabricante.model";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class FabricanteService {
  private readonly API = `${environment.apiUrl}/api/fabricantes`;

  constructor(private http: HttpClient) {}

  listarFabricantes(filtro?: FabricanteFiltro): Observable<Page<Fabricante>> {
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

      if (filtro.paisOrigem) {
        params = params.set("paisOrigem", filtro.paisOrigem);
      }

      if (filtro.ativo !== undefined) {
        params = params.set("ativo", filtro.ativo.toString());
      }
    }

    return this.http.get<Page<Fabricante>>(this.API, { params });
  }

  buscarPorId(id: number): Observable<Fabricante> {
    return this.http.get<Fabricante>(`${this.API}/${id}`);
  }

  criarFabricante(fabricante: Fabricante): Observable<Fabricante> {
    return this.http.post<Fabricante>(this.API, fabricante);
  }

  editarFabricante(fabricante: Fabricante): Observable<Fabricante> {
    return this.http.put<Fabricante>(
      `${this.API}/${fabricante.id}`,
      fabricante,
    );
  }

  excluirFabricante(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
