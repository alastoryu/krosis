import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Chart, registerables } from 'chart.js';

import { DashboardService } from '../service/dashboard.service';
import { DashboardResumo } from '../models/dashboard-resumo';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatIconModule, MatProgressSpinnerModule,
    MatButtonModule, MatTableModule, MatTooltipModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('barCanvas')  barCanvas!:  ElementRef<HTMLCanvasElement>;
  @ViewChild('pieCanvas')  pieCanvas!:  ElementRef<HTMLCanvasElement>;

  loading = true;
  resumo: DashboardResumo | null = null;

  private barChart?: Chart;
  private pieChart?: Chart;

  colunasAlertas = ['nomeProduto', 'numeroLote', 'validade', 'diasRestantes', 'quantidade'];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void { this.carregarDados(); }
  ngAfterViewInit(): void {}

  carregarDados() {
    this.loading = true;
    this.dashboardService.getResumo().subscribe({
      next: res => {
        this.resumo  = res;
        this.loading = false;
        setTimeout(() => this.renderizarGraficos(), 100);
      },
      error: () => { this.loading = false; }
    });
  }

  renderizarGraficos() {
    if (!this.resumo) return;
    this.renderizarBarras();
    this.renderizarPizza();
  }

  renderizarBarras() {
    if (this.barChart) this.barChart.destroy();
    const ctx = this.barCanvas?.nativeElement?.getContext('2d');
    if (!ctx || !this.resumo) return;

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.resumo.vencimentosPorMes.map(v => v.mes),
        datasets: [{
          label: 'Lotes vencendo',
          data: this.resumo.vencimentosPorMes.map(v => v.lotes),
          backgroundColor: [
            'rgba(229,57,53,.75)',
            'rgba(245,124,0,.75)',
            'rgba(251,192,45,.75)',
            'rgba(30,136,180,.75)',
            'rgba(30,136,180,.6)',
            'rgba(30,136,180,.45)',
          ],
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} lotes` } }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  renderizarPizza() {
    if (this.pieChart) this.pieChart.destroy();
    const ctx = this.pieCanvas?.nativeElement?.getContext('2d');
    if (!ctx || !this.resumo) return;

    const cores = ['#1e3a5f','#1e88b4','#4fc3f7','#0288d1','#01579b','#81d4fa','#b3e5fc'];

    this.pieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.resumo.estoquePorCategoria.map(e => e.categoria),
        datasets: [{
          data: this.resumo.estoquePorCategoria.map(e => e.quantidade),
          backgroundColor: cores,
          borderWidth: 2,
          borderColor: '#fff',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { font: { size: 11 }, padding: 12 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} unid.` } }
        },
        cutout: '65%',
      }
    });
  }

  badgeClass(dias: number): string {
    if (dias < 0)   return 'badge-vencido';
    if (dias <= 7)  return 'badge-critico';
    if (dias <= 15) return 'badge-atencao';
    return 'badge-ok';
  }

  badgeLabel(dias: number): string {
    if (dias < 0)   return `Vencido há ${Math.abs(dias)}d`;
    if (dias === 0) return 'Vence hoje';
    return `${dias} dias`;
  }

  get totalProdutos()    { return this.resumo?.totalProdutos    ?? 0; }
  get totalCategorias()  { return this.resumo?.totalCategorias  ?? 0; }
  get totalFabricantes() { return this.resumo?.totalFabricantes ?? 0; }
  get totalUsuarios()    { return this.resumo?.totalUsuarios    ?? 0; }
}