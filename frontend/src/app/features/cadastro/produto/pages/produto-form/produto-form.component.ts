import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { ProdutoService } from "../../services/produto.service";
import { FabricanteService } from "../../../fabricante/services/fabricante.service";
import { CategoriaService } from "../../../categoria/services/categoria.service";
import { Categoria } from "../../../categoria/models/categoria.model";
import { Fabricante } from "../../../fabricante/models/fabricante.model";
import { Produto } from "../../models/produto.model";

@Component({
  selector: "app-produto-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./produto-form.component.html",
  styleUrls: ["./produto-form.component.scss"],
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
    private snackBar: MatSnackBar,
  ) {
    this.produtoForm = this.createForm();
  }

  ngOnInit(): void {
    this.produtoId =
      Number(this.route.snapshot.paramMap.get("id")) || undefined;
    this.isEditMode = !!this.produtoId;
    this.carregarDadosAuxiliares();
    if (this.isEditMode) this.carregarProduto();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nome: ["", [Validators.required, Validators.minLength(2)]],
      descricao: [""],
      codigoDeBarras: [
        "",
        [Validators.required, Validators.pattern(/^\d{13}$/)],
      ],
      categoriaId: [null, Validators.required],
      fabricanteId: [null, Validators.required],
      ativo: [true],
    });
  }

  private carregarDadosAuxiliares(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (res) => (this.categorias = res.content),
      error: () => this.showMessage("Erro ao carregar categorias"),
    });
    this.fabricanteService.listarFabricantes().subscribe({
      next: (res) => (this.fabricantes = res.content),
      error: () => this.showMessage("Erro ao carregar fabricantes"),
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
          categoriaId: produto.categoriaId,
          fabricanteId: produto.fabricanteId,
        });
        this.loading = false;
      },
      error: () => {
        this.showMessage("Erro ao carregar produto");
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.produtoForm.invalid) {
      Object.keys(this.produtoForm.controls).forEach((k) =>
        this.produtoForm.get(k)?.markAsTouched(),
      );
      return;
    }
    this.loading = true;
    const v = this.produtoForm.value;
    const payload: any = {
      nome: v.nome,
      descricao: v.descricao,
      codigoDeBarras: v.codigoDeBarras,
      ativo: v.ativo,
      categoriaId: v.categoriaId,
      fabricanteId: v.fabricanteId,
    };
    const req = this.isEditMode
      ? this.produtoService.editarProduto({ ...payload, id: this.produtoId })
      : this.produtoService.criarProduto(payload);

    req.subscribe({
      next: () => {
        this.showMessage(
          this.isEditMode ? "Produto atualizado!" : "Produto criado!",
        );
        this.router.navigate(["/produtos"]);
      },
      error: () => {
        this.showMessage("Erro ao salvar produto");
        this.loading = false;
      },
    });
  }

  onCancel() {
    this.router.navigate(["/produtos"]);
  }

  private showMessage(msg: string) {
    this.snackBar.open(msg, "Fechar", { duration: 3000 });
  }

  get nome() {
    return this.produtoForm.get("nome");
  }
  get descricao() {
    return this.produtoForm.get("descricao");
  }
  get codigoDeBarras() {
    return this.produtoForm.get("codigoDeBarras");
  }
  get categoriaId() {
    return this.produtoForm.get("categoriaId");
  }
  get fabricanteId() {
    return this.produtoForm.get("fabricanteId");
  }
  get ativo() {
    return this.produtoForm.get("ativo");
  }
}
