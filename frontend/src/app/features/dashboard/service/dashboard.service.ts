import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { DashboardResumo } from "../models/dashboard-resumo";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private readonly API = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getResumo(): Observable<DashboardResumo> {
    return this.http.get<DashboardResumo>(this.API);
  }
}
