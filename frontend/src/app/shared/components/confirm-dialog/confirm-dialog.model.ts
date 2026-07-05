export interface ConfirmDialogData {
  titulo: string;
  mensagem: string;

  textoConfirmar?: string;
  textoCancelar?: string;

  corConfirmar?: 'primary' | 'accent' | 'warn';
  icone?: string;
}