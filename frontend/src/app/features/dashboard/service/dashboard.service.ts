import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardResumo {
  totalProdutos: number;
  totalCategorias: number;
  totalFabricantes: number;
  totalUsuarios: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'http://localhost:8081/dashboard';

  constructor(private http: HttpClient) {}

  getResumo(): Observable<DashboardResumo> {
    return this.http.get<DashboardResumo>(this.baseUrl);
  }
}