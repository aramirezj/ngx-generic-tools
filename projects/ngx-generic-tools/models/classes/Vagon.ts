import { FormGroup } from '@angular/forms';
import { GTAccion } from './Accion';

/** Clase utilizada para identificar un vagon de un stepper */
export class GTVagon {
    /** Nombre del vagon */
    nombreAMostrar?: string;
    /** Nombre identificativo del vagon */
    nombreModelo?: string;
    /** Si debe mostrarse el vagon o no */
    deshabilitado?: boolean;
    /** El formulario que tiene asociado */
    formulario?: FormGroup;
    /** Acciones disponibles, si está, la botonera mostrará estas acciones, si no, las de base */
    accionesDisponibles?: GTAccion[];
    constructor(
        public option?: string,
        public orden?: number,
    ) {
        this.nombreModelo = option;
        this.deshabilitado = false;
        this.formulario = new FormGroup({});
    }


    /** Deshabilita un vagon */
    deshabilita(): void {
        this.deshabilitado = true;
    }
}
