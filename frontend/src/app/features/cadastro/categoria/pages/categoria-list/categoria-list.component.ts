import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';

import { CategoriaService, Categoria, CategoriaFiltro } from '../../services/categoria.service';

@Component({
  selector: 'app-categoria-lista',
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
  ],
  templateUrl: './categoria-list.component.html',
  styleUrls: ['./categoria-list.component.scss']
})
export class CategoriaListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'ativo', 'acoes'];
  dataSource = new MatTableDataSource<Categoria>([]);
  loading = false;
  
  // Propriedades para paginação
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  
  // Filtros
  filtroNome = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.carregarCategorias();
  }

  ngAfterViewInit() {
    // Configurar paginação manual
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.carregarCategorias();
      });
    }

    // Configurar ordenação manual
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0; // Resetar para primeira página ao ordenar
        this.carregarCategorias();
      });
    }
  }

   carregarCategorias() {
    this.loading = true;
    
    const filtro: CategoriaFiltro = {
      page: this.pageIndex,
      size: this.pageSize,
      nome: this.filtroNome || undefined,
    };

    if (this.sort?.active) {
      filtro.sort = this.sort.active;
      filtro.direction = this.sort.direction as 'asc' | 'desc';
    }

    this.categoriaService.listarCategorias(filtro).subscribe({
      next: (page: Page<Categoria>) => {
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
        console.error('Erro ao carregar categorias:', error);
        this.showMessage('Erro ao carregar categorias');
        this.dataSource.data = [];
        this.totalElements = 0;
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filtroNome = filterValue.trim();
    this.pageIndex = 0; // Resetar para primeira página
    this.carregarCategorias();
  }

  limparFiltros() {
    this.filtroNome = '';
    this.pageIndex = 0;
    this.carregarCategorias();
  }

  novoCategoria() {
    this.router.navigate(['/categorias/novo']);
  }

  editarCategoria(categoria: Categoria) {
    this.router.navigate(['/categorias/editar', categoria.id]);
  }

  excluirCategoria(categoria: Categoria) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        titulo: 'Confirmar Exclusão',
        mensagem: `Deseja realmente excluir a categoria "${categoria.nome}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoriaService.excluirCategoria(categoria.id).subscribe({
          next: () => {
            this.showMessage('Categoria excluída com sucesso!');
            this.carregarCategorias();
          },
          error: (error) => {
            console.error('Erro ao excluir categoria:', error);
            this.showMessage('Erro ao excluir categoria');
          }
        });
      }
    });
  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000
    });
  }
}

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Page } from '../../../../../core/models/Page';

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
      <button mat-raised-button color="warn" (click)="onConfirm()">Confirmar</button>
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
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}