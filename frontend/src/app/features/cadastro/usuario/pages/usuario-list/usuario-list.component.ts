import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { filter, finalize, switchMap } from "rxjs";

import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";

import { UsuarioService } from "../../services/usuario.service";
import { ConfirmDialogService } from "../../../../../core/services/confirm-dialog.service";
import { Usuario } from "../../../../../core/models/usuario.model";

@Component({
  selector: "app-usuario-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: "./usuario-list.component.html",
  styleUrls: ["./usuario-list.component.scss"],
})
export class UsuarioListComponent implements OnInit, AfterViewInit {
  displayedColumns = ["id", "nome", "email", "role", "ativo", "acoes"];
  dataSource = new MatTableDataSource<Usuario>([]);
  loading = false;

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  filtroNome = "";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private confirmDialog: ConfirmDialogService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit() {
    this.carregarUsuarios();
  }

  ngAfterViewInit() {
    this.paginator?.page.subscribe(() => {
      this.pageIndex = this.paginator.pageIndex;
      this.pageSize = this.paginator.pageSize;
      this.carregarUsuarios();
    });

    this.sort?.sortChange.subscribe(() => {
      this.pageIndex = 0;
      this.carregarUsuarios();
    });
  }

  carregarUsuarios() {
    this.loading = true;
    this.usuarioService
      .listarUsuarios({
        page: this.pageIndex,
        size: this.pageSize,
        nome: this.filtroNome || undefined,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (page) => {
          this.dataSource.data = page.content;
          this.totalElements = page.totalElements;
          if (this.paginator) {
            this.paginator.length = page.totalElements;
            this.paginator.pageIndex = page.number;
            this.paginator.pageSize = page.size;
          }
        },
        error: () => this.showMessage("Erro ao carregar usuários"),
      });
  }

  limparFiltros() {
    this.filtroNome = "";
    this.pageIndex = 0;
    this.carregarUsuarios();
  }

  novoUsuario() {
    this.router.navigate(["/usuarios/novo"]);
  }
  editarUsuario(u: Usuario) {
    this.router.navigate(["/usuarios/editar", u.id]);
  }

  excluirUsuario(u: Usuario) {
    this.confirmDialog
      .confirmDelete(u.nome ?? "")
      .pipe(
        filter(Boolean),
        switchMap(() => this.usuarioService.excluirUsuario(u.id!)),
      )
      .subscribe({
        next: () => {
          this.showMessage("Usuário excluído!");
          this.carregarUsuarios();
        },
        error: () => this.showMessage("Erro ao excluir usuário"),
      });
  }

  iniciais(nome: string = "") {
    return nome
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  private showMessage(msg: string) {
    this.snackBar.open(msg, "Fechar", { duration: 3000 });
  }
}
