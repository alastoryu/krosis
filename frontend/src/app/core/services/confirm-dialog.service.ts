import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.model';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(
    private dialog: MatDialog
  ) { }

  confirm(data: ConfirmDialogData): Observable<boolean> {

    return this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      data
    }).afterClosed();

  }

  confirmDelete(nome: string): Observable<boolean> {

    return this.confirm({
      titulo: 'Excluir registro',
      mensagem: `Deseja realmente excluir "${nome}"?`,
      textoConfirmar: 'Excluir',
      textoCancelar: 'Cancelar',
      corConfirmar: 'warn',
      icone: 'delete'
    });

  }

  confirmSave(): Observable<boolean> {

    return this.confirm({
      titulo: 'Salvar alterações',
      mensagem: 'Deseja salvar as alterações?',
      textoConfirmar: 'Salvar',
      textoCancelar: 'Cancelar',
      corConfirmar: 'primary',
      icone: 'save'
    });

  }

  confirmLogout(): Observable<boolean> {

    return this.confirm({
      titulo: 'Encerrar sessão',
      mensagem: 'Deseja realmente sair do sistema?',
      textoConfirmar: 'Sair',
      textoCancelar: 'Cancelar',
      corConfirmar: 'primary',
      icone: 'logout'
    });

  }

}