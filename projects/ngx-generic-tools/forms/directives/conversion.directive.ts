import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { GT_TC_F } from 'ngx-generic-tools/models';

@Directive({
    selector: '[gtConversion]'
})
/** Directiva que hace conversiones de texto. Opciones: Mayuscula, minuscula y número */
export class GTConversionDirective {
    /** Tipo de conversión que ha de realizar */
    @Input('gtConversion') type: GT_TC_F;
    constructor(private _el: ElementRef) { }
    /** Escucha de evento de input */
    @HostListener('input', ['$event']) onInputChange(event): void {
        const initalValue: string = this._el.nativeElement.value;
        if (this.type) {
            switch (this.type) {
                case 'mayuscula':
                    this._el.nativeElement.value = initalValue.toUpperCase();
                    break;
                case 'minuscula':
                    this._el.nativeElement.value = initalValue.toLowerCase();
                    break;
                case 'numero':
                    this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
                    break;
                case 'espacio':
                    this._el.nativeElement.value = initalValue.replace(/\s+/g, '');
                    break;
                case 'mayusculaEspacio':
                    this._el.nativeElement.value = initalValue.toUpperCase().replace(/\s+/g, '');
                    break;
                case 'minusculaEspacio':
                    this._el.nativeElement.value = initalValue.toLowerCase().replace(/\s+/g, '');
                    break;
                case 'identificador':
                    this._el.nativeElement.value = initalValue.toUpperCase().replace(/[^0-9ABCDEFGHJKLMNPQRSUVWXYZTI]*/g, '');
                    break;
                case 'NIF':
                    this._el.nativeElement.value = initalValue.toUpperCase().replace(/[^0-9TRWAGMYFPDXBNJZSQVHLCKE]*/g, '');
                    break;
                case 'NIE':
                    this._el.nativeElement.value = initalValue.toUpperCase().replace(/[^0-9TRWAGMYFPDXBNJZSQVHLCKEXYZ]*/g, '');
                    break;
                case 'CIF':
                    this._el.nativeElement.value = initalValue.toUpperCase().replace(/[^0-9ABCDEFGHJKLMNPQRSUVWI]*/g, '');
                    break;
            }
            if (initalValue !== this._el.nativeElement.value) event.stopPropagation();
        }
    }
}
