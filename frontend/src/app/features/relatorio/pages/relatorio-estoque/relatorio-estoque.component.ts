import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { RelatorioService } from "../../services/relatorio.service";
import { RelatorioEstoque } from "../../models/relatorio.model";
import { CategoriaService } from "../../../cadastro/categoria/services/categoria.service";
import { FabricanteService } from "../../../cadastro/fabricante/services/fabricante.service";
import { Categoria } from "../../../cadastro/categoria/models/categoria.model";
import { Fabricante } from "../../../cadastro/fabricante/models/fabricante.model";

@Component({
  selector: "app-relatorio-estoque",
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
  templateUrl: "./relatorio-estoque.component.html",
  styleUrl: "./relatorio-estoque.component.scss",
})
export class RelatorioEstoqueComponent implements OnInit {
  colunas = [
    "nomeProduto",
    "codigoBarras",
    "categoria",
    "fabricante",
    "quantidadeTotal",
    "lotesAtivos",
    "validadeMaisProxima",
    "status",
  ];
  dados = signal<RelatorioEstoque[]>([]);
  carregando = signal(false);

  categorias: Categoria[] = [];
  fabricantes: Fabricante[] = [];
  categoriaId?: number;
  fabricanteId?: number;
  ativo?: boolean;

  get totalProdutos() {
    return this.dados().length;
  }
  get totalUnidades() {
    return this.dados().reduce((s, d) => s + d.quantidadeTotal, 0);
  }
  get produtosVazios() {
    return this.dados().filter((d) => d.quantidadeTotal === 0).length;
  }

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
      .estoque({
        ativo: this.ativo,
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
    this.ativo = undefined;
    this.categoriaId = undefined;
    this.fabricanteId = undefined;
    this.carregar();
  }

  statusEstoque(qtd: number): string {
    if (qtd === 0) return "badge-vencido";
    if (qtd <= 5) return "badge-atencao";
    return "badge-ok";
  }

  statusLabel(qtd: number): string {
    if (qtd === 0) return "Sem estoque";
    if (qtd <= 5) return "Estoque baixo";
    return "Normal";
  }
}
