import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { UsuarioService } from "../../services/usuario.service";
import { Usuario } from "../../../../../core/models/usuario.model";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";

import { filter, finalize, switchMap } from "rxjs/operators";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ConfirmDialogService } from "../../../../../core/services/confirm-dialog.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-usuario-list",
  standalone: true,
  imports: [
    MatSelectModule,
    FormsModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: "./usuario-list.component.html",
  styleUrls: ["./usuario-list.component.scss"],
})
export class UsuarioListComponent implements OnInit, AfterViewInit {
  usuarios: Usuario[] = [];

  displayedColumns: string[] = [
    "id",
    "nome",
    "email",
    "role",
    "ativo",
    "acoes",
  ];
  dataSource = new MatTableDataSource<Usuario>([]);

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  loading = false;
  error = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private confirmDialog: ConfirmDialogService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.carregarUsuarios();
      });
    }

    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.carregarUsuarios();
      });
    }
  }

  carregarUsuarios(): void {
    this.loading = true;
    this.error = false;

    this.usuarioService
      .listarUsuarios()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          this.usuarios = data.content;
        },
        error: () => {
          this.error = true;
        },
      });
  }

  novoUsuario() {
    this.router.navigate(["/usuarios/novo"]);
  }

  editarUsuario(usuario: Usuario) {
    this.router.navigate(["/usuarios/editar", usuario.id]);
  }

  excluirUsuario(usuario: Usuario): void {
    this.confirmDialog
      .confirmDelete(usuario.nome)
      .pipe(
        filter(Boolean),
        switchMap(() => this.usuarioService.excluirUsuario(usuario.id)),
      )
      .subscribe({
        next: () => {
          this.showMessage("Usuário excluído com sucesso!");
          this.carregarUsuarios();
        },
        error: (error) => {
          console.error(error);
          this.showMessage("Erro ao excluir usuário");
        },
      });
  }

  private showMessage(message: string) {
    this.snackBar.open(message, "Fechar", {
      duration: 3000,
    });
  }
}