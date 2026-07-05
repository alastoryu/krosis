import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  senha = '';
  senhaVisivel = signal(false);
  carregando = signal(false);
  erro = signal('');

  constructor(private auth: AuthService, private router: Router) { }

  toggleSenha() {
    this.senhaVisivel.update(v => !v);
  }

  entrar() {
    if (!this.email || !this.senha) {
      this.erro.set('Preencha e-mail e senha.');
      return;
    }
    this.erro.set('');
    this.carregando.set(true);

    this.auth.login({ email: this.email, senha: this.senha }).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.erro.set('E-mail ou senha inválidos.');
        this.carregando.set(false);
      },
    });
  }
}