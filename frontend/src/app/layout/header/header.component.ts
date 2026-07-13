import { Component, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatToolbarModule, MatButtonModule,
    MatMenuModule, MatIconModule, MatDividerModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  menuAberto = false;

  nomeUsuario = computed(() => this.auth.nomeUsuario());
  role        = computed(() => this.auth.role());
  iniciais    = computed(() => {
    return this.auth.nomeUsuario()
      .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  });

  constructor(private auth: AuthService) {}

  toggleMenu() { this.menuAberto = !this.menuAberto; }
  fecharMenu() { this.menuAberto = false; }
  sair()       { this.fecharMenu(); this.auth.logout(); }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768) this.menuAberto = false;
  }
}