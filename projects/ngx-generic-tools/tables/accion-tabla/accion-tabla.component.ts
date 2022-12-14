import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Accion, AccionCondicion, LogicaCondicion, TipoCondicion } from 'ngx-generic-tools/models';

/** Componente encargado de la lógica de acciones con condiciones */
@Component({
    selector: 'app-accion-tabla',
    templateUrl: './accion-tabla.component.html',
    styleUrls: ['./accion-tabla.component.scss']
})

export class AccionTablaComponent implements OnInit {
    /** Acción con la que se trabaja */
    @Input() accion: Accion;
    /** Elemento sobre el que se evalua */
    @Input() elemento: any;
    /** Para saber si se van a pintar en un menú o no */
    @Input() menuAcciones: boolean;
    /** Evento de notificación de la acción */
    @Output() clicked: EventEmitter<string> = new EventEmitter<string>();
    /** Para saber si está deshabilitado o no */
    disabled = true;
    constructor(
        private cdRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        if (this.accion.observerCondiciones) {
            this.accion.observerCondiciones.subscribe(() => this.checkConditions());
        } else {
            this.disabled = this.accion.disabled;
        }
    }
    ngAfterViewChecked(): void {
        this.cdRef.detectChanges();
    }
    /** Envía la notificación */
    doAccion() {
        this.clicked.emit(this.accion.funcion);
    }


    /** Comprueba todas las condiciones. En caso de cumplirse todas, se habilita la acción */
    checkConditions() {

        let condicionesCumplidas: boolean = true;

        //Primero nos aseguramos de que la acción tenga condiciones
        if (this.accion.condiciones) {
            //Recorremos todas sus condiciones
            for (const condicion of this.accion.condiciones) {
                condicionesCumplidas = condicionesCumplidas && this.compruebaCondicion(condicion);
            }
            //Si las condiciones no se cumplen, y la acción tiene asignada una sustituta, la intercambiamos
            if (!condicionesCumplidas && this.accion.accionSustituta) {
                //La acción original pasará a ser la nueva sustituta.
                const reemplazoSustituta = Object.assign({}, this.accion);
                //Intercambiamos las acciones
                this.accion = Object.assign({}, this.accion.accionSustituta);
                this.accion.accionSustituta = reemplazoSustituta;
                this.disabled = this.accion.disabled;
                this.checkConditions();


                //Si las condiciones se cumplen, habilitamos la acción
            } else if (condicionesCumplidas && this.accion.accionSustituta) {
                this.disabled = this.accion.disabled;

                //Las condiciones no fueron cumplidas
            } else if (condicionesCumplidas) {
                this.disabled = false;
            }
            else {
                this.disabled = true;
            }
            //Si no tiene condiciones, habilitamos la acción
        } else {
            this.disabled = this.accion.disabled;
        }

    }

    /**
     * Lógica para comprobar una condición
     * @param condicion Condición a comprobar
     * @returns Si la comprobación ha sido satisfactoria
     */
    compruebaCondicion(condicion: AccionCondicion): boolean {
        let seCumple: boolean = false;
        const valor: any = this.preparaValor(condicion.atributo);
        switch (condicion.tipoCondicion) {
            case TipoCondicion.BOOLEAN:
                switch (condicion.logica) {
                    case LogicaCondicion.REQUIRED:
                        seCumple = valor ? true : false;
                        break;
                    case LogicaCondicion.MISSING:
                        seCumple = valor ? false : true;
                        break;
                }
                break;
            case TipoCondicion.EQUAL:
                seCumple = valor?.toLowerCase() === condicion.logica?.toLowerCase() ? true : false;
                break;
            case TipoCondicion.DIFFERENT:
                seCumple = valor?.toLowerCase() !== condicion.logica?.toLowerCase() ? true : false;
                break;
        }
        return seCumple;
    }


    /**
     * Prepara el valor a evaluar
     * @param atributo Atributo del que sacar el valor del elemento
     * @returns Valor final a evaluar
     */
    preparaValor(atributo: string): any {
        const spllited: string[] = atributo.split('.');
        if (spllited.length === 1) return this.elemento[atributo];

        let eleFinal = Object.assign({}, this.elemento);
        for (let i = 0; i < spllited.length; i++) {
            eleFinal = eleFinal[spllited[i]];
            if (!eleFinal) break;
        }
        return eleFinal;

    }


}
