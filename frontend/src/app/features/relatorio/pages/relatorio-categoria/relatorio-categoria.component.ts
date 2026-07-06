import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { RelatorioService } from "../../services/relatorio.service";
import { RelatorioPorCategoria } from "../../models/relatorio.model";
import { FabricanteService } from "../../../cadastro/fabricante/services/fabricante.service";
import { CategoriaService } from "../../../cadastro/categoria/services/categoria.service";
import { Categoria } from "../../../cadastro/categoria/models/categoria.model";
import { Fabricante } from "../../../cadastro/fabricante/models/fabricante.model";

@Component({
  selector: "app-relatorio-categoria",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./relatorio-categoria.component.html",
  styleUrl: "./relatorio-categoria.component.scss",
})
export class RelatorioCategoriaComponent implements OnInit {
  colunas = [
    "nomeProduto",
    "categoria",
    "fabricante",
    "quantidadeEstoque",
    "totalLotes",
    "validadeMaisProxima",
  ];
  dados = signal<RelatorioPorCategoria[]>([]);
  carregando = signal(false);

  categorias: Categoria[] = [];
  fabricantes: Fabricante[] = [];
  categoriaId?: number;
  fabricanteId?: number;

  constructor(
    private relatorioService: RelatorioService,
    private categoriaService: CategoriaService,
    private fabricanteService: FabricanteService,
  ) {}

  ngOnInit() {
    this.categoriaService.listarCategorias().subscribe({
      next: (page) => (this.categorias = page.content),
    });
    this.fabricanteService.listarFabricantes().subscribe({
      next: (page) => (this.fabricantes = page.content),
    });
    this.carregar();
  }

  carregar() {
    this.carregando.set(true);
    this.relatorioService
      .porCategoria({
        categoriaId: this.categoriaId,
        fabricanteId: this.fabricanteId,
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
    this.carregar();
  }
}
