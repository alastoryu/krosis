import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { LoginComponent } from "./pages/login/login.component";
import { MainLayoutComponent } from "./layout/main-layout/main-layout.component";

import { ProdutoListComponent } from "./features/cadastro/produto/pages/produto-list/produto-list.component";
import { ProdutoFormComponent } from "./features/cadastro/produto/pages/produto-form/produto-form.component";

import { CategoriaListComponent } from "./features/cadastro/categoria/pages/categoria-list/categoria-list.component";
import { CategoriaFormComponent } from "./features/cadastro/categoria/pages/categoria-form/categoria-form.component";

import { FabricanteListComponent } from "./features/cadastro/fabricante/pages/fabricante-list/fabricante-list.component";
import { FabricanteFormComponent } from "./features/cadastro/fabricante/pages/fabricante-form/fabricante-form.component";

import { UsuarioListComponent } from "./features/cadastro/usuario/pages/usuario-list/usuario-list.component";
import { UsuarioFormComponent } from "./features/cadastro/usuario/pages/usuario-form/usuario-form.component";

import { DashboardComponent } from "./features/dashboard/pages/dashboard.component";
import { EntradaLoteComponent } from "./features/prevencao/entrada-lote/entrada-lote.component";
import { RelatorioVencimentoComponent } from "./features/relatorio/pages/relatorio-vencimento/relatorio-vencimento.component";
import { RelatorioVencidosComponent } from "./features/relatorio/pages/relatorio-vencidos/relatorio-vencidos.component";
import { RelatorioMovimentacoesComponent } from "./features/relatorio/pages/relatorio-movimentacoes/relatorio-movimentacoes.component";
import { RelatorioEstoqueComponent } from "./features/relatorio/pages/relatorio-estoque/relatorio-estoque.component";
import { RelatorioCategoriaComponent } from "./features/relatorio/pages/relatorio-categoria/relatorio-categoria.component";
import { RelatorioOperadorComponent } from "./features/relatorio/pages/relatorio-operador/relatorio-operador.component";
import { RelatorioSemMovComponent } from "./features/relatorio/pages/relatorio-sem-mov/relatorio-sem-mov.component";

export const routes: Routes = [
  { path: "login", component: LoginComponent, title: "Login" },

  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },

      { path: "dashboard", component: DashboardComponent, title: "Dashboard" },

      {
        path: "produtos",
        children: [
          {
            path: "",
            component: ProdutoListComponent,
            title: "Lista de Produtos",
          },
          {
            path: "novo",
            component: ProdutoFormComponent,
            title: "Novo Produto",
          },
          {
            path: "editar/:id",
            component: ProdutoFormComponent,
            title: "Editar Produto",
          },
        ],
      },

      {
        path: "categorias",
        children: [
          {
            path: "",
            component: CategoriaListComponent,
            title: "Lista de Categorias",
          },
          {
            path: "novo",
            component: CategoriaFormComponent,
            title: "Nova Categoria",
          },
          {
            path: "editar/:id",
            component: CategoriaFormComponent,
            title: "Editar Categoria",
          },
        ],
      },

      {
        path: "fabricantes",
        children: [
          {
            path: "",
            component: FabricanteListComponent,
            title: "Lista de Fabricantes",
          },
          {
            path: "novo",
            component: FabricanteFormComponent,
            title: "Novo Fabricante",
          },
          {
            path: "editar/:id",
            component: FabricanteFormComponent,
            title: "Editar Fabricante",
          },
        ],
      },

      {
        path: "usuarios",
        children: [
          {
            path: "",
            component: UsuarioListComponent,
            title: "Lista de Usuários",
          },
          {
            path: "novo",
            component: UsuarioFormComponent,
            title: "Novo Usuário",
          },
          {
            path: "editar/:id",
            component: UsuarioFormComponent,
            title: "Editar Usuário",
          },
        ],
      },

      {
        path: "entrada",
        component: EntradaLoteComponent,
        title: "Entrada de Produto",
      },

      {
        path: "relatorios",
        children: [
          {
            path: "vencimento",
            component: RelatorioVencimentoComponent,
            title: "Vencimento",
          },
          {
            path: "vencidos",
            component: RelatorioVencidosComponent,
            title: "Vencidos",
          },
          {
            path: "movimentacoes",
            component: RelatorioMovimentacoesComponent,
            title: "Movimentações",
          },
          {
            path: "estoque",
            component: RelatorioEstoqueComponent,
            title: "Estoque",
          },
          {
            path: "por-categoria",
            component: RelatorioCategoriaComponent,
            title: "Por Categoria",
          },
          {
            path: "historico-operador",
            component: RelatorioOperadorComponent,
            title: "Histórico Operador",
          },
          {
            path: "sem-movimentacao",
            component: RelatorioSemMovComponent,
            title: "Sem Movimentação",
          },
        ],
      },
    ],
  },

  { path: "**", redirectTo: "" },
];
