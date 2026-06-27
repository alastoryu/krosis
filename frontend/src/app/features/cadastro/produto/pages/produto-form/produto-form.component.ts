import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ProdutoService, Produto } from '../../services/produto.service';
import { Fabricante, FabricanteService } from '../../../fabricante/services/fabricante.service';
import { Categoria, CategoriaService } from '../../../categoria/services/categoria.service';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.scss']
})
export class ProdutoFormComponent implements OnInit {

  produtoForm: FormGroup;
  isEditMode = false;
  produtoId?: number;
  loading = false;

  categorias: Categoria[] = [];
  fabricantes: Fabricante[] = [];

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private fabricanteService: FabricanteService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.produtoForm = this.createForm();
  }

  ngOnInit(): void {
    this.produtoId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.produtoId;

    this.carregarDadosAuxiliares();

    if (this.isEditMode) {
      this.carregarProduto();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      descricao: [''],
      codigoDeBarras: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],

      categoria: [null, Validators.required],
      fabricante: [null, Validators.required],

      ativo: [true]
    });
  }

  private carregarDadosAuxiliares(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (res) => this.categorias = res.content,
      error: () => this.showMessage('Erro ao carregar categorias')
    });

    this.fabricanteService.listarFabricantes().subscribe({
      next: (res) => this.fabricantes = res.content,
      error: () => this.showMessage('Erro ao carregar fabricantes')
    });
  }

  private carregarProduto(): void {
    if (!this.produtoId) return;

    this.loading = true;

    this.produtoService.buscarPorId(this.produtoId).subscribe({
      next: (produto: Produto) => {

        this.produtoForm.patchValue({
          nome: produto.nome,
          descricao: produto.descricao,
          codigoDeBarras: produto.codigoDeBarras,
          ativo: produto.ativo,

          categoria: produto.categoria,
          fabricante: produto.fabricante
        });

        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produto:', error);
        this.showMessage('Erro ao carregar produto');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.produtoForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;

    const formValue = this.produtoForm.value;

    const payload: any = {
      nome: formValue.nome,
      descricao: formValue.descricao,
      codigoDeBarras: formValue.codigoDeBarras,
      ativo: formValue.ativo,

      categoriaId: formValue.categoria?.id,
      fabricanteId: formValue.fabricante?.id
    };

    const request = this.isEditMode
      ? this.produtoService.editarProduto({ ...payload, id: this.produtoId })
      : this.produtoService.criarProduto(payload);

    request.subscribe({
      next: () => {
        this.showMessage(
          this.isEditMode
            ? 'Produto atualizado com sucesso!'
            : 'Produto criado com sucesso!'
        );

        this.router.navigate(['/produtos']);
      },
      error: (error) => {
        console.error('Erro ao salvar produto:', error);
        this.showMessage('Erro ao salvar produto');
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/produtos']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.produtoForm.controls).forEach(key => {
      this.produtoForm.get(key)?.markAsTouched();
    });
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000
    });
  }

  get nome() { return this.produtoForm.get('nome'); }
  get descricao() { return this.produtoForm.get('descricao'); }
  get codigoDeBarras() { return this.produtoForm.get('codigoDeBarras'); }
  get categoria() { return this.produtoForm.get('categoria'); }
  get fabricante() { return this.produtoForm.get('fabricante'); }
  get ativo() { return this.produtoForm.get('ativo'); }
}