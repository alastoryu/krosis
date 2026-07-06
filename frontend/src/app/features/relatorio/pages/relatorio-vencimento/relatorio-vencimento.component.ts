import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";

import { RelatorioService } from "../../services/relatorio.service";
import { RelatorioVencimento } from "../../models/relatorio.model";

@Component({
  selector: "app-relatorio-vencimento",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: "./relatorio-vencimento.component.html",
  styleUrl: "./relatorio-vencimento.component.scss",
})
export class RelatorioVencimentoComponent implements OnInit {
  diasOpcoes = [7, 15, 30, 60, 90];
  diasSelecionado = 30;

  colunas = [
    "nomeProduto",
    "numeroLote",
    "validade",
    "diasRestantes",
    "quantidade",
    "categoria",
    "fabricante",
  ];
  dados = signal<RelatorioVencimento[]>([]);
  carregando = signal(false);

  constructor(private relatorioService: RelatorioService) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando.set(true);
    this.relatorioService.vencimento(this.diasSelecionado).subscribe({
      next: (d) => {
        this.dados.set(d);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  badgeClass(dias: number): string {
    if (dias < 0) return "badge-vencido";
    if (dias <= 7) return "badge-critico";
    if (dias <= 15) return "badge-atencao";
    return "badge-ok";
  }

  badgeLabel(dias: number): string {
    if (dias < 0) return `Vencido há ${Math.abs(dias)}d`;
    if (dias === 0) return "Vence hoje";
    return `${dias} dias`;
  }
  get totalVencidos() {
    return this.dados().filter((d) => d.diasRestantes < 0).length;
  }
  get totalCriticos() {
    return this.dados().filter(
      (d) => d.diasRestantes >= 0 && d.diasRestantes <= 7,
    ).length;
  }
}
