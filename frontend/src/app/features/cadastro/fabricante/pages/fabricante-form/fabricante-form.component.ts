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
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

import { FabricanteService } from "../../services/fabricante.service";
import { Fabricante } from "../../models/fabricante.model";

@Component({
  selector: "app-fabricante-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: "./fabricante-form.component.html",
  styleUrls: ["./fabricante-form.component.scss"],
})
export class FabricanteFormComponent implements OnInit {
  fabricanteForm: FormGroup;
  isEditMode = false;
  fabricanteId?: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private fabricanteService: FabricanteService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.fabricanteForm = this.createForm();
  }

  ngOnInit(): void {
    this.fabricanteId = Number(this.route.snapshot.paramMap.get("id"));
    this.isEditMode = !!this.fabricanteId;

    if (this.isEditMode) {
      this.carregarFabricante();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nome: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(150),
        ],
      ],
      descricao: ["", [Validators.maxLength(500)]],
      paisOrigem: ["", [Validators.maxLength(100)]],
      ativo: [true],
    });
  }

  private carregarFabricante(): void {
    if (!this.fabricanteId) {
      return;
    }

    this.loading = true;

    this.fabricanteService.buscarPorId(this.fabricanteId).subscribe({
      next: (fabricante: Fabricante) => {
        this.fabricanteForm.patchValue(fabricante);
        this.loading = false;
      },
      error: (error) => {
        console.error("Erro ao carregar fabricante:", error);
        this.showMessage("Erro ao carregar fabricante");
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.fabricanteForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;

    const fabricanteData: Fabricante = {
      ...this.fabricanteForm.value,
    };

    if (this.isEditMode && this.fabricanteId) {
      fabricanteData.id = this.fabricanteId;
    }

    const request = this.isEditMode
      ? this.fabricanteService.editarFabricante(fabricanteData)
      : this.fabricanteService.criarFabricante(fabricanteData);

    request.subscribe({
      next: () => {
        const message = this.isEditMode
          ? "Fabricante atualizado com sucesso!"
          : "Fabricante criado com sucesso!";

        this.showMessage(message);
        this.router.navigate(["/fabricantes"]);
      },
      error: (error) => {
        console.error("Erro ao salvar fabricante:", error);
        this.showMessage("Erro ao salvar fabricante");
        this.loading = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(["/fabricantes"]);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.fabricanteForm.controls).forEach((key) => {
      this.fabricanteForm.get(key)?.markAsTouched();
    });
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, "Fechar", {
      duration: 3000,
    });
  }

  get nome() {
    return this.fabricanteForm.get("nome");
  }

  get descricao() {
    return this.fabricanteForm.get("descricao");
  }

  get paisOrigem() {
    return this.fabricanteForm.get("paisOrigem");
  }

  get ativo() {
    return this.fabricanteForm.get("ativo");
  }
}
