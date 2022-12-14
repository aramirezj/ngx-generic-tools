import { FormGroup } from '@angular/forms';
import { Accion } from './Accion';

/** Clase utilizada para identificar un vagon de un stepper */
export class Vagon {
    /** Nombre del vagon */
    nombreAMostrar?: string;
    /** Nombre identificativo del vagon */
    nombreModelo?: string;
    /** Si debe mostrarse el vagon o no */
    deshabilitado?: boolean;
    /** El formulario que tiene asociado */
    formulario?: FormGroup;
    /** Acciones disponibles, si está, la botonera mostrará estas acciones, si no, las de base */
    accionesDisponibles?: Accion[];
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
