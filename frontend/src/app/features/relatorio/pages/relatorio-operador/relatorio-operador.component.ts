import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { RelatorioService } from "../../services/relatorio.service";
import { RelatorioMovimentacao } from "../../models/relatorio.model";
import { UsuarioService } from "../../../cadastro/usuario/services/usuario.service";
import { Usuario } from "../../../../core/models/usuario.model";

@Component({
  selector: "app-relatorio-operador",
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
  templateUrl: "./relatorio-operador.component.html",
  styleUrl: "./relatorio-operador.component.scss",
})
export class RelatorioOperadorComponent implements OnInit {
  colunas = [
    "operador",
    "timestamp",
    "nomeProduto",
    "numeroLote",
    "quantidade",
  ];
  dados = signal<RelatorioMovimentacao[]>([]);
  carregando = signal(false);

  usuarios: Usuario[] = [];
  usuarioId?: number;
  dataInicio?: string;
  dataFim?: string;

  get totalEntradas() {
    return this.dados().length;
  }
  get totalUnidades() {
    return this.dados().reduce((s, d) => s + d.quantidade, 0);
  }
  get operadoresAtivos() {
    return new Set(this.dados().map((d) => d.operador)).size;
  }

  constructor(
    private relatorioService: RelatorioService,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit() {
    this.usuarioService.listarUsuarios().subscribe({
      next: (page) => (this.usuarios = page.content),
    });
    this.carregar();
  }

  carregar() {
    this.carregando.set(true);
    this.relatorioService
      .historicoOperador({
        usuarioId: this.usuarioId,
        dataInicio: this.dataInicio ? `${this.dataInicio}T00:00:00` : undefined,
        dataFim: this.dataFim ? `${this.dataFim}T23:59:59` : undefined,
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
    this.usuarioId = undefined;
    this.dataInicio = undefined;
    this.dataFim = undefined;
    this.carregar();
  }

  iniciais(nome: string) {
    return nome
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }
}
