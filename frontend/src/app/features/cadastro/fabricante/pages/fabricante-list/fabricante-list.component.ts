import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CommonModule } from "@angular/common";

import { FormsModule } from "@angular/forms";

import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatChipsModule } from "@angular/material/chips";

import { FabricanteService } from "../../services/fabricante.service";
import { Page } from "../../../../../core/models/page.model";
import { Fabricante } from "../../models/fabricante.model";
import { FabricanteFiltro } from "../../models/fabricante-filtro.model";
import { ConfirmDialogService } from "../../../../../core/services/confirm-dialog.service";
import { filter, finalize, switchMap } from "rxjs";

@Component({
  selector: "app-fabricante-lista",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
  ],
  templateUrl: "./fabricante-list.component.html",
  styleUrls: ["./fabricante-list.component.scss"],
})
export class FabricanteListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["id", "nome", "paisOrigem", "ativo", "acoes"];

  dataSource = new MatTableDataSource<Fabricante>([]);
  loading = false;

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  filtroNome = "";
  filtroPaisOrigem = "";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fabricanteService: FabricanteService,
    private router: Router,
    private confirmDialog: ConfirmDialogService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.carregarFabricantes();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.carregarFabricantes();
      });
    }

    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.carregarFabricantes();
      });
    }
  }

  carregarFabricantes(): void {
    this.loading = true;

    const filtro: FabricanteFiltro = {
      page: this.pageIndex,
      size: this.pageSize,
      nome: this.filtroNome || undefined,
      paisOrigem: this.filtroPaisOrigem || undefined,
    };

    if (this.sort?.active) {
      filtro.sort = this.sort.active;
      filtro.direction = this.sort.direction as "asc" | "desc";
    }

    this.fabricanteService
      .listarFabricantes(filtro)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (page: Page<Fabricante>) => {
          this.dataSource.data = page.content;
          this.totalElements = page.totalElements;

          if (this.paginator) {
            this.paginator.length = page.totalElements;
            this.paginator.pageIndex = page.number;
            this.paginator.pageSize = page.size;
          }
        },
        error: (error) => {
          console.error(error);

          this.dataSource.data = [];
          this.totalElements = 0;

          this.showMessage("Erro ao carregar fabricantes");
        },
      });
  }

  limparFiltros(): void {
    this.filtroNome = "";
    this.filtroPaisOrigem = "";
    this.pageIndex = 0;
    this.carregarFabricantes();
  }

  novoFabricante(): void {
    this.router.navigate(["/fabricantes/novo"]);
  }

  editarFabricante(fabricante: Fabricante): void {
    this.router.navigate(["/fabricantes/editar", fabricante.id]);
  }

  excluirFabricante(fabricante: Fabricante): void {
    this.confirmDialog
      .confirmDelete(fabricante.nome)
      .pipe(
        filter(Boolean),
        switchMap(() =>
          this.fabricanteService.excluirFabricante(fabricante.id!),
        ),
      )
      .subscribe({
        next: () => {
          this.showMessage("Fabricante excluído com sucesso!");
          this.carregarFabricantes();
        },
        error: (error) => {
          console.error(error);
          this.showMessage("Erro ao excluir fabricante");
        },
      });
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, "Fechar", {
      duration: 3000,
    });
  }
}
