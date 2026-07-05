import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";

import { UsuarioService } from "../../services/usuario.service";

import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: "app-usuario-form",
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
    MatSelectModule,
  ],
  templateUrl: "./usuario-form.component.html",
  styleUrls: ["./usuario-form.component.scss"],
})
export class UsuarioFormComponent implements OnInit {
  usuarioForm!: FormGroup;

  isEditMode = false;
  loading = false;
  id?: number;

  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private service: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get("id"));
    this.isEditMode = !!this.id;

    this.initForm();

    if (this.isEditMode) {
      this.loadUsuario();
    }
  }

  private initForm(): void {
    this.usuarioForm = this.fb.group({
      nome: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      senha: ["", this.isEditMode ? [] : [Validators.required]],
      role: ["USER", Validators.required],
      ativo: [true],
    });
  }

  private loadUsuario(): void {
    this.loading = true;

    this.service
      .buscarPorId(this.id!)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((usuario) => {
        this.usuarioForm.patchValue({
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role,
          ativo: usuario.ativo,
        });
      });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) return;

    this.loading = true;

    const data = this.usuarioForm.value;

    const request$ = this.isEditMode
      ? this.service.atualizar(this.id!, data)
      : this.service.criar(data);

    request$.pipe(finalize(() => (this.loading = false))).subscribe(() => {
      this.router.navigate(["/usuarios"]);
    });
  }

  onCancel(): void {
    this.router.navigate(["/usuarios"]);
  }

  get nome() {
    return this.usuarioForm.get("nome");
  }
  get email() {
    return this.usuarioForm.get("email");
  }
  get senha() {
    return this.usuarioForm.get("senha");
  }
}
