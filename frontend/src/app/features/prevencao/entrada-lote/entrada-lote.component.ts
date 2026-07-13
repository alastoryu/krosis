import {
  Component,
  ElementRef,
  OnDestroy,
  signal,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Produto } from "../../cadastro/produto/models/produto.model";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-entrada-lote",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./entrada-lote.component.html",
  styleUrl: "./entrada-lote.component.scss",
})
export class EntradaLoteComponent implements OnDestroy {
  private readonly API = `${environment.apiUrl}/api`;
  private reader = new BrowserMultiFormatReader();
  private controls?: IScannerControls;

  @ViewChild("videoEl") videoEl!: ElementRef<HTMLVideoElement>;

  etapa = signal<"scan" | "form">("scan");
  scanAtivo = signal(false);
  buscando = signal(false);
  salvando = signal(false);

  codigoManual = "";
  produto = signal<Produto | null>(null);

  numeroLote = "";
  validade = "";
  quantidade: number | null = null;

  constructor(
    private http: HttpClient,
    private snack: MatSnackBar,
  ) {}

  async iniciarScan() {
    this.scanAtivo.set(true);
    await new Promise((r) => setTimeout(r, 100));

    try {
      this.controls = await this.reader.decodeFromVideoDevice(
        undefined,
        this.videoEl.nativeElement,
        (result, err) => {
          if (result) {
            this.pararScan();
            this.buscarProduto(result.getText());
          }
        },
      );
    } catch {
      this.snack.open("Câmera não disponível.", "Fechar", { duration: 3000 });
      this.scanAtivo.set(false);
    }
  }

  pararScan() {
    this.controls?.stop();
    this.scanAtivo.set(false);
  }

  buscarManual() {
    if (!this.codigoManual.trim()) return;
    this.buscarProduto(this.codigoManual.trim());
  }

  buscarProduto(codigo: string) {
    this.buscando.set(true);
    this.produto.set(null);

    this.http.get<Produto>(`${this.API}/entrada/produto/${codigo}`).subscribe({
      next: (p) => {
        this.produto.set(p);
        this.etapa.set("form");
        this.buscando.set(false);
      },
      error: () => {
        this.snack.open("Produto não encontrado para esse código.", "Fechar", {
          duration: 3000,
        });
        this.buscando.set(false);
      },
    });
  }

  salvar() {
    if (!this.numeroLote || !this.validade || !this.quantidade) {
      this.snack.open("Preencha todos os campos.", "Fechar", {
        duration: 2500,
      });
      return;
    }

    this.salvando.set(true);
    const body = {
      codigoBarras: this.produto()!.codigoDeBarras,
      numeroLote: this.numeroLote,
      validade: this.validade,
      quantidade: this.quantidade,
    };

    this.http.post(`${this.API}/entrada`, body).subscribe({
      next: () => {
        this.snack.open("✅ Entrada registrada com sucesso!", "", {
          duration: 3000,
        });
        this.resetar();
      },
      error: () => {
        this.snack.open("Erro ao salvar. Tente novamente.", "Fechar", {
          duration: 3000,
        });
        this.salvando.set(false);
      },
    });
  }

  resetar() {
    this.etapa.set("scan");
    this.produto.set(null);
    this.codigoManual = "";
    this.numeroLote = "";
    this.validade = "";
    this.quantidade = null;
    this.salvando.set(false);
  }

  ngOnDestroy() {
    this.controls?.stop();
  }
}
