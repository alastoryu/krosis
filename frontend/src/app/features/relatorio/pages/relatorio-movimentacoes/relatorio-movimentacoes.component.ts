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

import { RelatorioService } from "../../services/relatorio.service";
import { RelatorioMovimentacao } from "../../models/relatorio.model";
import { UsuarioService } from "../../../cadastro/usuario/services/usuario.service";
import { Usuario } from "../../../../core/models/usuario.model";

@Component({
  selector: "app-relatorio-movimentacoes",
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
  ],
  templateUrl: "./relatorio-movimentacoes.component.html",
  styleUrl: "./relatorio-movimentacoes.component.scss",
})
export class RelatorioMovimentacoesComponent implements OnInit {
  colunas = [
    "timestamp",
    "nomeProduto",
    "numeroLote",
    "tipo",
    "quantidade",
    "operador",
  ];
  dados = signal<RelatorioMovimentacao[]>([]);
  carregando = signal(false);

  usuarios: Usuario[] = [];
  tipo?: string;
  usuarioId?: number;
  dataInicio?: string;
  dataFim?: string;

  tipoOpcoes = [
    { value: "ENTRADA", label: "Entrada", cor: "verde" },
    { value: "SAIDA", label: "Saída", cor: "vermelho" },
    { value: "AJUSTE", label: "Ajuste", cor: "azul" },
  ];

  get totalEntradas() {
    return this.dados().filter((d) => d.tipo === "ENTRADA").length;
  }
  get totalSaidas() {
    return this.dados().filter((d) => d.tipo === "SAIDA").length;
  }
  get totalAjustes() {
    return this.dados().filter((d) => d.tipo === "AJUSTE").length;
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
      .movimentacoes({
        tipo: this.tipo,
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
    this.tipo = undefined;
    this.usuarioId = undefined;
    this.dataInicio = undefined;
    this.dataFim = undefined;
    this.carregar();
  }

  tipoBadge(tipo: string): string {
    return tipo === "ENTRADA"
      ? "badge-verde"
      : tipo === "SAIDA"
        ? "badge-vencido"
        : "badge-azul";
  }
}
