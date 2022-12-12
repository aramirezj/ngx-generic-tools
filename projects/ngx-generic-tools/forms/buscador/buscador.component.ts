import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


/** Componente encargado de mostrar un formulario de busqueda */
@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss']
})
export class BuscadorComponent implements OnInit {
  /** Elemento para notificar al componente que invoca la tabla */
  @Output() notify: EventEmitter<any> = new EventEmitter<{ tipo: string, resultado: any }>();
  /** Formulario para el buscador simple */
  form: FormGroup;
  /** Booleano para controlar el mostrado del buscador avanzado */
  muestraAvanzado: boolean = false;
  constructor() { }

  ngOnInit(): void {
    console.log('xd');
    this.form = new FormGroup({
      busqueda: new FormControl()
    });
  }

  /**
 * Envio de la busqueda
 * @param valor Valor sobre el que filtrar
 */
  busqueda(valor: string): void {
    if (valor) valor = valor.toLowerCase();
    this.notify.emit({ tipo: 'simple', resultado: valor });
  }

}