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
import { BarcodeFormat, DecodeHintType } from "@zxing/library";

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
  private track?: MediaStreamTrack;
  private readonly ZOOM_ALVO = 2; // ajuste: 1.5 a 3
  private cameras: MediaDeviceInfo[] = [];
  private cameraAtual = 0;

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

  async iniciarScan(): Promise<void> {
    if (this.scanAtivo()) return;
    this.scanAtivo.set(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const salva = localStorage.getItem("cameraId") ?? undefined;
      try {
        await this.abrirCamera(salva);
      } catch (e) {
        if (!salva) throw e;
        // câmera salva não existe mais: tenta a padrão
        localStorage.removeItem("cameraId");
        await this.abrirCamera();
      }
    } catch (error) {
      console.error("Erro ao iniciar câmera:", error);
      const mensagem =
        error instanceof Error
          ? `${error.name}: ${error.message}`
          : "Erro ao acessar a câmera.";
      this.snack.open(mensagem, "Fechar", { duration: 6000 });
      this.pararScan();
    }
  }

  private async abrirCamera(deviceId?: string): Promise<void> {
    const video = this.videoEl?.nativeElement;
    if (!video) throw new Error("Elemento de vídeo não encontrado.");

    this.controls?.stop();

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.ITF,
    ]);
    this.reader = new BrowserMultiFormatReader(hints);

    this.controls = await this.reader.decodeFromConstraints(
      {
        audio: false,
        video: {
          ...(deviceId
            ? { deviceId: { exact: deviceId } }
            : { facingMode: { ideal: "environment" } }),
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      },
      video,
      (result, _error, controls) => {
        if (controls) this.controls = controls;
        if (result) {
          const codigo = result.getText();
          this.pararScan();
          this.codigoManual = codigo;
          this.buscarProduto(codigo);
        }
      },
    );

    const stream = video.srcObject as MediaStream | null;
    this.track = stream?.getVideoTracks()[0];
    if (this.track) await this.otimizarCamera(this.track);

    // Só depois da permissão os nomes das câmeras aparecem
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.cameras = devices.filter(
      (d) => d.kind === "videoinput" && /back|traseira|rear/i.test(d.label),
    );
    const idAtual = this.track?.getSettings().deviceId;
    this.cameraAtual = Math.max(
      0,
      this.cameras.findIndex((c) => c.deviceId === idAtual),
    );
  }

  async trocarCamera(): Promise<void> {
    if (this.cameras.length < 2) return;

    this.cameraAtual = (this.cameraAtual + 1) % this.cameras.length;
    const cam = this.cameras[this.cameraAtual];

    try {
      await this.abrirCamera(cam.deviceId);
      localStorage.setItem("cameraId", cam.deviceId);
      this.snack.open(`Câmera: ${cam.label}`, "", { duration: 1500 });
    } catch (e) {
      console.error(e);
      this.snack.open("Não foi possível trocar de câmera.", "Fechar", {
        duration: 3000,
      });
    }
  }

  private async otimizarCamera(track: MediaStreamTrack): Promise<void> {
    const caps = (track.getCapabilities?.() ?? {}) as any;
    const avancado: any = {};

    if (caps.focusMode?.includes("continuous")) {
      avancado.focusMode = "continuous";
    }

    // Zoom permite afastar o aparelho do código e manter o foco nítido
    if (caps.zoom) {
      avancado.zoom = Math.min(
        caps.zoom.max,
        Math.max(caps.zoom.min, this.ZOOM_ALVO),
      );
    }

    if (Object.keys(avancado).length) {
      try {
        await track.applyConstraints({ advanced: [avancado] } as any);
      } catch (e) {
        console.warn("Não foi possível aplicar foco/zoom:", e);
      }
    }
  }

  // Toque no vídeo força um novo ciclo de foco
  async focarNoToque(): Promise<void> {
    const track = this.track;
    if (!track) return;

    const caps = (track.getCapabilities?.() ?? {}) as any;

    try {
      if (caps.focusMode?.includes("single-shot")) {
        await track.applyConstraints({
          advanced: [{ focusMode: "single-shot" } as any],
        });
        setTimeout(() => this.otimizarCamera(track), 1500);
      } else if (caps.focusMode?.includes("continuous")) {
        await track.applyConstraints({
          advanced: [{ focusMode: "manual" } as any],
        });
        await track.applyConstraints({
          advanced: [{ focusMode: "continuous" } as any],
        });
      }
    } catch {
      // sem suporte a controle de foco no navegador
    }
  }

  pararScan(): void {
    this.controls?.stop();
    this.controls = undefined;
    this.track = undefined;
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
