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

import {
  FabricanteService,
  Fabricante,
  FabricanteFiltro
} from '../../services/fabricante.service';
import { Page } from '../../../../../core/models/Page';

@Component({
  selector: 'app-fabricante-lista',
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
  templateUrl: './fabricante-list.component.html',
  styleUrls: ['./fabricante-list.component.scss']
})
export class FabricanteListComponent implements OnInit {

  displayedColumns: string[] = [
    'id',
    'nome',
    'paisOrigem',
    'ativo',
    'acoes'
  ];

  dataSource = new MatTableDataSource<Fabricante>([]);
  loading = false;

  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  filtroNome = '';
  filtroPaisOrigem = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fabricanteService: FabricanteService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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
      paisOrigem: this.filtroPaisOrigem || undefined
    };

    if (this.sort?.active) {
      filtro.sort = this.sort.active;
      filtro.direction = this.sort.direction as 'asc' | 'desc';
    }

    this.fabricanteService.listarFabricantes(filtro).subscribe({
      next: (page: Page<Fabricante>) => {
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
        console.error('Erro ao carregar fabricantes:', error);
        this.showMessage('Erro ao carregar fabricantes');
        this.dataSource.data = [];
        this.totalElements = 0;
        this.loading = false;
      }
    });
  }

  limparFiltros(): void {
    this.filtroNome = '';
    this.filtroPaisOrigem = '';
    this.pageIndex = 0;
    this.carregarFabricantes();
  }

  novoFabricante(): void {
    this.router.navigate(['/fabricantes/novo']);
  }

  editarFabricante(fabricante: Fabricante): void {
    this.router.navigate(['/fabricantes/editar', fabricante.id]);
  }

  excluirFabricante(fabricante: Fabricante): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        titulo: 'Confirmar Exclusão',
        mensagem: `Deseja realmente excluir o fabricante "${fabricante.nome}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fabricanteService.excluirFabricante(fabricante.id!).subscribe({
          next: () => {
            this.showMessage('Fabricante excluído com sucesso!');
            this.carregarFabricantes();
          },
          error: (error) => {
            console.error('Erro ao excluir fabricante:', error);
            this.showMessage('Erro ao excluir fabricante');
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
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}