import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';

/** Clase utilizada para mostrar un breve dialogo de confirmación */
@Component({
  selector: 'gt-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.scss']
})
export class GTConfirmacionComponent implements OnInit {
  /** Mensaje a mostrar */
  mensaje: string;
  /** Lista de opciones para crear dos botones */
  options: string[];
  constructor(public dialogRef: DialogRef<string | boolean>) { }

  ngOnInit(): void {
  }
  /** Confirmación del dialogo */
  save(option?: string): void {
    this.dialogRef.close(option ?? true);
  }
  /** Cancelación del dialogo */
  close(): void {
    this.dialogRef.close();
  }

}
