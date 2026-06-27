import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../../service/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loading = true;

  totalProdutos = 0;
  totalCategorias = 0;
  totalFabricantes = 0;
  totalUsuarios = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados() {
    this.loading = true;

    this.dashboardService.getResumo().subscribe({
      next: (res) => {
        this.totalProdutos = res.totalProdutos;
        this.totalCategorias = res.totalCategorias;
        this.totalFabricantes = res.totalFabricantes;
        this.totalUsuarios = res.totalUsuarios;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}