import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Control de formulario Yes/No */
@Component({
  selector: 'gt-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GTChipsComponent),
      multi: true
    }]
})
export class GTChipsComponent implements ControlValueAccessor {
  /** Para saber si está deshabilitado */
  disabled:boolean
  /** Valor actual del control */
  field: boolean;
  /** Trigger de cuando cambia el valor */
  onChange: any = () => { };
  /** Trigger de cuando se toca el control */
  onTouch: any = () => { };
  /** Setter del valor */
  set value(val: boolean) {
    this.field = val
    this.onChange(val)
    this.onTouch(val)
  }
  /** Seteo del valor*/
  writeValue(value: boolean): void {
    //Si se ha seleccionado el mismo, deseleccionamos
    if(this.field === value) value = null;
    this.value = value;
  }
  /** Registra los cambios */
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  /** Registra el touched */
  registerOnTouched(onTouched: Function): void {
    this.onTouch = onTouched;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /** Descripción del chip */
  @Input() descripcion: string;


}
