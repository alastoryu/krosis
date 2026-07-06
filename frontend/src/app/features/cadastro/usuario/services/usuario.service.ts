import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Usuario } from "../../../../core/models/usuario.model";
import { PageResponse } from "../../../../core/models/page-response.model";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  private readonly API = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  listarUsuarios(): Observable<PageResponse<Usuario>> {
    return this.http.get<PageResponse<Usuario>>(this.API);
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
