import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";

import { RelatorioService } from "../../services/relatorio.service";
import { RelatorioVencimento } from "../../models/relatorio.model";
import { CategoriaService } from "../../../cadastro/categoria/services/categoria.service";
import { FabricanteService } from "../../../cadastro/fabricante/services/fabricante.service";
import { Categoria } from "../../../cadastro/categoria/models/categoria.model";
import { Fabricante } from "../../../cadastro/fabricante/models/fabricante.model";

@Component({
  selector: "app-relatorio-vencidos",
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
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: "./relatorio-vencidos.component.html",
  styleUrl: "./relatorio-vencidos.component.scss",
})
export class RelatorioVencidosComponent implements OnInit {
  colunas = [
    "nomeProduto",
    "numeroLote",
    "validade",
    "diasVencido",
    "quantidade",
    "categoria",
    "fabricante",
    "prejuizo",
  ];
  dados = signal<RelatorioVencimento[]>([]);
  carregando = signal(false);

  categorias: Categoria[] = [];
  fabricantes: Fabricante[] = [];

  categoriaId?: number;
  fabricanteId?: number;
  dataInicio?: string;
  dataFim?: string;

  get totalItens() {
    return this.dados().reduce((s, d) => s + d.quantidade, 0);
  }
  get totalPrejuizo() {
    return this.dados().reduce((s, d) => s + d.quantidade * 10, 0);
  }

  constructor(
    private relatorioService: RelatorioService,
    private categoriaService: CategoriaService,
    private fabricanteService: FabricanteService,
  ) {}

  ngOnInit() {
    this.carregarFiltros();
    this.carregar();
  }

  carregarFiltros() {
    this.categoriaService.listarCategorias().subscribe({
      next: (page) => (this.categorias = page.content),
    });
    this.fabricanteService.listarFabricantes().subscribe({
      next: (page) => (this.fabricantes = page.content),
    });
  }

  carregar() {
    this.carregando.set(true);
    this.relatorioService
      .vencidos({
        categoriaId: this.categoriaId,
        fabricanteId: this.fabricanteId,
        dataInicio: this.dataInicio,
        dataFim: this.dataFim,
      })
      .subscribe({
        next: (d) => {
          this.dados.set(d);
          this.carregando.set(false);
        },
        error: () => this.carregando.set(false),
      });
  }

  limpar() {
    this.categoriaId = undefined;
    this.fabricanteId = undefined;
    this.dataInicio = undefined;
    this.dataFim = undefined;
    this.carregar();
  }

  diasVencido(dias: number) {
    return Math.abs(dias);
  }
}
