import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

/** Componente encargado de mostrar un slider según cierta configuración */
@Component({
    selector: 'app-slider-maestro',
    templateUrl: './slider-maestro.component.html',
    styleUrls: ['./slider-maestro.component.scss']
})
export class SliderMaestroComponent implements OnInit {
    /** Máximo valor del slider */
    @Input() max: number;
    /** Mínimo valor del slider */
    @Input() min: number = 0;
    /** Control asociado al slider */
    @Input() control: FormControl | AbstractControl;
    /** Label para mostrar */
    @Input() label: string;
    /** Mensaje inferior para mostrar */
    @Input() hint: string;
    /** Si el númerito del slider debe sufrir alguna transformación */
    @Input() formatSlider: (value: number) => string = null;
    /** Intervalo del slider */
    @Input() tickInterval: number = 1;
    /** Para mostrar o no el label con el número */
    @Input() thumbLabel: boolean = true;
    /** Atributo que, si el control estaba deshabilitado, lo habilita, y con SCSS, crea un módo de lectura */
    modoLectura: boolean;
    /** Función por defecto */
    formatDefault(value: number): string {return `${value}`  };
    /** Casting del formcontrol */
    controlFormat:FormControl;

    constructor() { 
        this.control = this.control ?? new FormControl();
        this.controlFormat = this.control as FormControl;
  
    }

    ngOnInit(): void {
        if (this.control.disabled) {
            this.control.enable();
            this.modoLectura = true;
        }
    }

    

}
