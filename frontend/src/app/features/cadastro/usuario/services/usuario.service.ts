import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Usuario } from "../../../../core/models/usuario.model";
import { PageResponse } from "../../../../core/models/page-response.model";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  private readonly API = `${environment.apiUrl}/api/usuarios`;

  constructor(private http: HttpClient) {}

  listarUsuarios(params?: {
    page?: number;
    size?: number;
    nome?: string;
  }): Observable<PageResponse<Usuario>> {
    let httpParams = new HttpParams();
    if (params?.page != null) httpParams = httpParams.set("page", params.page);
    if (params?.size != null) httpParams = httpParams.set("size", params.size);
    if (params?.nome) httpParams = httpParams.set("nome", params.nome);
    return this.http.get<PageResponse<Usuario>>(this.API, {
      params: httpParams,
    });
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/${id}`);
  }

  criarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.API, usuario);
  }

  editarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API}/${id}`, usuario);
  }

  excluirUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
