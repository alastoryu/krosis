import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  RelatorioVencimento,
  RelatorioMovimentacao,
  RelatorioEstoque,
  RelatorioPorCategoria,
} from "../models/relatorio.model";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class RelatorioService {
  private readonly API = `${environment.apiUrl}/api/relatorios`;

  constructor(private http: HttpClient) {}

  vencimento(dias: number): Observable<RelatorioVencimento[]> {
    return this.http.get<RelatorioVencimento[]>(`${this.API}/vencimento`, {
      params: { dias },
    });
  }

  vencidos(filtros: {
    categoriaId?: number;
    fabricanteId?: number;
    dataInicio?: string;
    dataFim?: string;
  }): Observable<RelatorioVencimento[]> {
    let params = new HttpParams();
    if (filtros.categoriaId)
      params = params.set("categoriaId", filtros.categoriaId);
    if (filtros.fabricanteId)
      params = params.set("fabricanteId", filtros.fabricanteId);
    if (filtros.dataInicio)
      params = params.set("dataInicio", filtros.dataInicio);
    if (filtros.dataFim) params = params.set("dataFim", filtros.dataFim);
    return this.http.get<RelatorioVencimento[]>(`${this.API}/vencidos`, {
      params,
    });
  }

  movimentacoes(filtros: {
    tipo?: string;
    usuarioId?: number;
    dataInicio?: string;
    dataFim?: string;
  }): Observable<RelatorioMovimentacao[]> {
    let params = new HttpParams();
    if (filtros.tipo) params = params.set("tipo", filtros.tipo);
    if (filtros.usuarioId) params = params.set("usuarioId", filtros.usuarioId);
    if (filtros.dataInicio)
      params = params.set("dataInicio", filtros.dataInicio);
    if (filtros.dataFim) params = params.set("dataFim", filtros.dataFim);
    return this.http.get<RelatorioMovimentacao[]>(`${this.API}/movimentacoes`, {
      params,
    });
  }

  estoque(filtros: {
    ativo?: boolean;
    categoriaId?: number;
    fabricanteId?: number;
  }): Observable<RelatorioEstoque[]> {
    let params = new HttpParams();
    if (filtros.ativo != null) params = params.set("ativo", filtros.ativo);
    if (filtros.categoriaId)
      params = params.set("categoriaId", filtros.categoriaId);
    if (filtros.fabricanteId)
      params = params.set("fabricanteId", filtros.fabricanteId);
    return this.http.get<RelatorioEstoque[]>(`${this.API}/estoque`, { params });
  }

  porCategoria(filtros: {
    categoriaId?: number;
    fabricanteId?: number;
  }): Observable<RelatorioPorCategoria[]> {
    let params = new HttpParams();
    if (filtros.categoriaId)
      params = params.set("categoriaId", filtros.categoriaId);
    if (filtros.fabricanteId)
      params = params.set("fabricanteId", filtros.fabricanteId);
    return this.http.get<RelatorioPorCategoria[]>(`${this.API}/por-categoria`, {
      params,
    });
  }

  historicoOperador(filtros: {
    usuarioId?: number;
    dataInicio?: string;
    dataFim?: string;
  }): Observable<RelatorioMovimentacao[]> {
    let params = new HttpParams();
    if (filtros.usuarioId) params = params.set("usuarioId", filtros.usuarioId);
    if (filtros.dataInicio)
      params = params.set("dataInicio", filtros.dataInicio);
    if (filtros.dataFim) params = params.set("dataFim", filtros.dataFim);
    return this.http.get<RelatorioMovimentacao[]>(
      `${this.API}/historico-operador`,
      { params },
    );
  }

  semMovimentacao(): Observable<RelatorioPorCategoria[]> {
    return this.http.get<RelatorioPorCategoria[]>(
      `${this.API}/sem-movimentacao`,
    );
  }
}
