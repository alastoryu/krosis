import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';

import { CategoriaService } from '../../services/categoria.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';

import { Categoria } from '../../models/categoria.model';
import { CategoriaFiltro } from '../../models/categoria-filtro.model';
import { Router } from '@angular/router';
import { filter, finalize, switchMap } from 'rxjs';

@Component({
  selector: 'app-categoria-lista',
  standalone: true,
  imports: [
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
export class CategoriaListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nome', 'ativo', 'acoes'];
  dataSource = new MatTableDataSource<Categoria>([]);
  loading = false;

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  filtroNome = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoriaService: CategoriaService,
    private confirmDialog: ConfirmDialogService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.carregarCategorias();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.carregarCategorias();
      });
    }

    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
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

    this.categoriaService
      .listarCategorias(filtro)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: page => {
          this.dataSource.data = page.content;
          this.totalElements = page.totalElements;

          if (this.paginator) {
            this.paginator.length = page.totalElements;
            this.paginator.pageIndex = page.number;
            this.paginator.pageSize = page.size;
          }
        },
        error: error => {
          console.error(error);
          this.dataSource.data = [];
          this.totalElements = 0;
          this.showMessage('Erro ao carregar categorias');
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filtroNome = filterValue.trim();
    this.pageIndex = 0;
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

  excluirCategoria(categoria: Categoria): void {

    this.confirmDialog
      .confirmDelete(categoria.nome)
      .pipe(
        filter(Boolean),
        switchMap(() =>
          this.categoriaService.excluirCategoria(categoria.id)
        )
      )
      .subscribe({
        next: () => {
          this.showMessage('Categoria excluída com sucesso!');
          this.carregarCategorias();
        },
        error: (error) => {
          console.error(error);
          this.showMessage('Erro ao excluir categoria');
        }
      });

  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000
    });
  }
}