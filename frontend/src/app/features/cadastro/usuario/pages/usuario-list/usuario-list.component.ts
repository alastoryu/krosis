import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "../../services/usuario.service";
import { Usuario } from "../../../../../core/models/usuario.model";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";

import { finalize } from "rxjs/operators";

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
  ],
  templateUrl: "./usuario-list.component.html",
  styleUrls: ["./usuario-list.component.scss"],
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];

  displayedColumns: string[] = [
    "id",
    "nome",
    "email",
    "role",
    "ativo",
    "acoes",
  ];

  loading = false;
  error = false;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading = true;
    this.error = false;

    this.usuarioService
      .listar()
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

  deletar(id: number): void {
    if (!confirm("Deseja realmente excluir este usuário?")) return;

    this.usuarioService.deletar(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter((u) => u.id !== id);
      },
      error: () => {
        alert("Erro ao excluir usuário");
      },
    });
  }
}
