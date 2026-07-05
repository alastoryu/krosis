import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse } from '../models/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/api/auth`;
  private readonly TOKEN_KEY = 'auth_token';

  private _usuario = signal<LoginResponse | null>(this.carregarDoStorage());

  readonly usuario = this._usuario.asReadonly();
  readonly logado = computed(() => !!this._usuario());
  readonly nomeUsuario = computed(() => this._usuario()?.nome ?? '');
  readonly role = computed(() => this._usuario()?.role ?? '');

  constructor(private http: HttpClient, private router: Router) {}

  login(req: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.API}/login`, req).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, JSON.stringify(res));
        this._usuario.set(res);
      })
    );
  }

  register(dados: { nome: string; email: string; senha: string }) {
    return this.http.post(`${this.API}/register`, dados);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this._usuario.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._usuario()?.token ?? null;
  }

  private carregarDoStorage(): LoginResponse | null {
    try {
      const raw = localStorage.getItem(this.TOKEN_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}