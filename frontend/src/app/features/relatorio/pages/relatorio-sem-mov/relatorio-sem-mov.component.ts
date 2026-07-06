import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RelatorioService } from '../../services/relatorio.service';
import { RelatorioPorCategoria } from '../../models/relatorio.model';

@Component({
  selector: 'app-relatorio-sem-mov',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './relatorio-sem-mov.component.html',
  styleUrl: './relatorio-sem-mov.component.scss',
})
export class RelatorioSemMovComponent implements OnInit {

  colunas = ['nomeProduto', 'categoria', 'fabricante', 'alerta'];
  dados = signal<RelatorioPorCategoria[]>([]);
  carregando = signal(false);

  constructor(private relatorioService: RelatorioService) {}

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando.set(true);
    this.relatorioService.semMovimentacao().subscribe({
      next: d => { this.dados.set(d); this.carregando.set(false); },
      error: () => this.carregando.set(false)
    });
  }
}