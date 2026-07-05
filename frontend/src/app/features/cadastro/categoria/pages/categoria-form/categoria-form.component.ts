import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';
import { CreateCategoriaDTO } from '../../models/categoria-create.model';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.scss']
})
export class CategoriaFormComponent implements OnInit {

  categoriaForm: FormGroup;
  isEditMode = false;
  categoriaId?: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.categoriaForm = this.createForm();
  }

  ngOnInit(): void {
    this.categoriaId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.categoriaId;

    if (this.isEditMode) {
      this.carregarCategoria();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],
      descricao: [
        '',
        [
          Validators.maxLength(500)
        ]
      ],
      ativo: [true]
    });
  }

  private carregarCategoria(): void {

    if (!this.categoriaId) {
      return;
    }

    this.loading = true;

    this.categoriaService.buscarPorId(this.categoriaId)
      .subscribe({
        next: (categoria: Categoria) => {

          this.categoriaForm.patchValue({
            nome: categoria.nome,
            descricao: categoria.descricao,
            ativo: categoria.ativo
          });

          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar categoria:', error);

          this.showMessage('Erro ao carregar categoria');
          this.loading = false;
        }
      });
  }

  onSubmit(): void {

    if (this.categoriaForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;

    const categoriaData: CreateCategoriaDTO = this.categoriaForm.value;

    const request = this.isEditMode
      ? this.categoriaService.editarCategoria(
        this.categoriaId!,
        categoriaData
      )
      : this.categoriaService.criarCategoria(
        categoriaData
      );

    request.subscribe({
      next: () => {

        this.showMessage(
          this.isEditMode
            ? 'Categoria atualizada com sucesso!'
            : 'Categoria criada com sucesso!'
        );

        this.router.navigate(['/categorias']);
      },
      error: (error) => {

        console.error(
          'Erro ao salvar categoria:',
          error
        );

        this.showMessage(
          'Erro ao salvar categoria'
        );

        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/categorias']);
  }

  private markFormGroupTouched(): void {

    Object.keys(this.categoriaForm.controls)
      .forEach(key => {
        this.categoriaForm
          .get(key)
          ?.markAsTouched();
      });
  }

  private showMessage(message: string): void {

    this.snackBar.open(
      message,
      'Fechar',
      {
        duration: 3000
      }
    );
  }

  get nome() {
    return this.categoriaForm.get('nome');
  }

  get descricao() {
    return this.categoriaForm.get('descricao');
  }

  get ativo() {
    return this.categoriaForm.get('ativo');
  }
}