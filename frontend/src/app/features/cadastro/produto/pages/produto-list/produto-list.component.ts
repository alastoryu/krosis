import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { ProdutoService, Produto, ProdutoFiltro } from '../../services/produto.service';
import { Categoria, CategoriaService } from '../../../categoria/services/categoria.service';
import { Fabricante, FabricanteService } from '../../../fabricante/services/fabricante.service';
import { Page } from '../../../../../core/models/Page';

@Component({
  selector: 'app-produto-lista',
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
    MatAutocompleteModule,
  ],
  templateUrl: './produto-list.component.html',
  styleUrls: ['./produto-list.component.scss']
})
export class ProdutoListComponent implements OnInit {

  displayedColumns: string[] = [
    'id',
    'nome',
    'categoria',
    'codigoDeBarras',
    'fabricante',
    'ativo',
    'acoes'
  ];

  dataSource = new MatTableDataSource<Produto>([]);
  loading = false;

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  filtroNome = '';
  categorias: Categoria[] = [];
  fabricantes: Fabricante[] = [];

  categoriaSelecionada?: Categoria;
  fabricanteSelecionado?: Fabricante;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
displayCategoria: any;
displayFabricante: any;

  constructor(
    private produtoService: ProdutoService,
    private categoriaService: CategoriaService,
    private fabricanteService: FabricanteService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarFabricantes();
    this.carregarProdutos();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.carregarProdutos();
      });
    }

    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.carregarProdutos();
      });
    }
  }

  carregarProdutos(): void {
    this.loading = true;

    const filtro: ProdutoFiltro = {
      page: this.pageIndex,
      size: this.pageSize,
      nome: this.filtroNome || undefined,
      categoriaId: this.categoriaSelecionada?.id,
      fabricanteId: this.fabricanteSelecionado?.id
    };

    if (this.sort?.active) {
      filtro.sort = this.sort.active;
      filtro.direction = this.sort.direction as 'asc' | 'desc';
    }

    this.produtoService.listarProdutos(filtro).subscribe({
      next: (page: Page<Produto>) => {
        this.dataSource.data = page.content;
        this.totalElements = page.totalElements;

        if (this.paginator) {
          this.paginator.length = this.totalElements;
          this.paginator.pageIndex = page.number;
          this.paginator.pageSize = page.size;
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.showMessage('Erro ao carregar produtos');
        this.dataSource.data = [];
        this.totalElements = 0;
        this.loading = false;
      }
    });
  }

  carregarCategorias(): void {
  this.categoriaService.listarCategorias().subscribe({
    next: response => this.categorias = response.content
  });
}

carregarFabricantes(): void {
  this.fabricanteService.listarFabricantes().subscribe({
    next: response => this.fabricantes = response.content
  });
}

  limparFiltros(): void {
    this.filtroNome = '';
    this.categoriaSelecionada = undefined;
    this.fabricanteSelecionado = undefined;
    this.pageIndex = 0;
    this.carregarProdutos();
  }

  novoProduto(): void {
    this.router.navigate(['/produtos/novo']);
  }

  editarProduto(produto: Produto): void {
    this.router.navigate(['/produtos/editar', produto.id]);
  }

  excluirProduto(produto: Produto): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        titulo: 'Confirmar Exclusão',
        mensagem: `Deseja realmente excluir o produto "${produto.nome}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.produtoService.excluirProduto(produto.id).subscribe({
          next: () => {
            this.showMessage('Produto excluído com sucesso!');
            this.carregarProdutos();
          },
          error: () => {
            this.showMessage('Erro ao excluir produto');
          }
        });
      }
    });
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000
    });
  }
}

/* =========================
   CONFIRM DIALOG
========================= */

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.titulo }}</h2>

    <div mat-dialog-content>
      <p>{{ data.mensagem }}</p>
    </div>

    <div mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">
        Confirmar
      </button>
    </div>
  `,
  styles: [`
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}