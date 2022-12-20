import { Component, OnInit, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Chips Si/No */
@Component({
  selector: 'gt-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: GTChipsComponent,
      multi: true
    }]
})
export class GTChipsComponent implements ControlValueAccessor {
  field:boolean;
  onChange: any = () => {}
  onTouch: any = () => {}
  set value(val: boolean){
    this.field = val
    this.onChange(val)
    this.onTouch(val)
}
  writeValue(value: boolean): void {
    this.value = value
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(onTouched: Function): void {
    this.onTouch = onTouched;
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }
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
