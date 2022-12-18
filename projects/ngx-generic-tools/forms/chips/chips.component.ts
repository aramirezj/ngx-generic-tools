import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

/** Chips Si/No */
@Component({
  selector: 'gt-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss']
})
export class GTChipsComponent implements OnInit {
  /** Si los chips deben poder seleccionarse*/
  @Input() seleccionable = true;
  /** Vinculación al formulario */
  @Input() control: FormControl;
  /** Nombre clave para identificarlo */
  @Input() clave: string;
  /** Descripción del chip */
  @Input() descripcion: string;
  /** Si debe estar deshabilitado */
  @Input() disabled: boolean = false;


  ngOnInit(): void {
    if (!this.control) this.control = new FormControl();
  }

  /**
   * Setea un nuevo valor y marca su control como touched y dirty para que lo cojan las detecciones de cambios
   * @param newValue Nuevo valor
   */
  setNewValue(newValue: boolean) {
    this.control.setValue(this.control.value !== newValue ? newValue : null);
    this.control.markAsTouched();
    this.control.markAsDirty();
  }

}
