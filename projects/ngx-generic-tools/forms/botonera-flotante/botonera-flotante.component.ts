import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { GTAccion, GTVagon } from 'ngx-generic-tools/models';

/** Botonera utilizada en steppers */
@Component({
    selector: 'gt-botonera-flotante',
    templateUrl: './botonera-flotante.component.html',
    styleUrls: ['./botonera-flotante.component.scss']
})
export class GTBotoneraComponent implements OnInit {
    /** Acciones para cuando está al principio del stepper */
    accionesInicio: GTAccion[] = [new GTAccion('guardar'), new GTAccion('continuar'), new GTAccion('salirBotonera')];
    /** Acciones para cuando está a la mitad del stepper */
    accionesMitad: GTAccion[] = [new GTAccion('guardar'), new GTAccion('volver'), new GTAccion('continuar'), new GTAccion('salirBotonera')];
    /** Acciones para cuando está al final del stepper */
    accionesFinal: GTAccion[] = [new GTAccion('guardar'), new GTAccion('volver'), new GTAccion('salirBotonera')];
    /** Serán las acciones que actualmente se deban mostrar */
    accionesActuales: GTAccion[];

    /** Acciones que deberán estar disponibles */
    @Input() acciones: string[]
    /** Listado de vagones */
    @Input() vagones: GTVagon[];
    /** Para saber que vagon se está mostrando actualmente */
    @Input() vagonActivo: number;
    /** Lista de acciones extras constantes de un determinado componente */
    @Input() accionesConstantes: GTAccion[];
    /** Elemento para notificar al componente que invoca la tabla */
    @Output() notify: EventEmitter<any> = new EventEmitter<any>();



    ngOnInit(): void {
        //Si no hay acciones estaticas, se hace los calculos dinamicos
        if (!this.acciones) {
            //Si al empezar, no hay suficientes vagones, quitamos por ejemplo el continuar
            this.calculaAccionesPorLongitud();
            //Si hay acciones constantes, se añaden para que se vean siempre
            if (this.accionesConstantes) this.addAccionesConstantes();
        }



        this.accionesActuales = this.acciones ? GTAccion.parseAcciones(this.acciones) : this.accionesInicio;
    }


    /** Añade las acciones constantes */
    addAccionesConstantes() {
        this.accionesInicio = this.accionesConstantes.concat(this.accionesInicio);
        this.accionesMitad = this.accionesConstantes.concat(this.accionesMitad);
        this.accionesFinal = this.accionesConstantes.concat(this.accionesFinal);
    }

    /** Quita la primera y ultima accion de las acciones, es decir, guardar y cancelar */
    generaAccionesPreview() {
        this.accionesInicio.pop();
        this.accionesInicio.shift();
        this.accionesMitad.pop();
        this.accionesMitad.shift();
        this.accionesFinal.pop();
        this.accionesFinal.shift();
    }

    /** Quita acciones según la longitud, si por ejemplo no hay más de un vagón, no queremos el continuar del inicio */
    calculaAccionesPorLongitud() {
        if (this.vagones?.length < 2) this.accionesInicio.splice(this.accionesInicio.length - 2, 1);

    }

    /** Según la posición del vagón activo, gestiona si debe poner las acciones del comienzo
     * mitad o del final
     */
    calculaBotonera() {

        if (this.vagonActivo === 0) {
            //Si está al comienzo
            this.accionesActuales = this.accionesInicio.slice();
        } else if (this.vagonActivo === this.vagones.length - 1) {
            //Si está al final
            this.accionesActuales = this.accionesFinal.slice();
        } else {
            //Si está a la mitad
            this.accionesActuales = this.accionesMitad.slice();
        }
    }

    /**
     * S triggerea cuando se cambia de vagón. Si tiene el nuevo vagón acciones definidas, se setearan esas, si no
     * se setearan las de base
     * @param changes 
     */
    ngOnChanges(changes: { vagonActivo: SimpleChange }): void {
        if (changes.vagonActivo) {
            //Si recibe un cambio de vagonActivo (indice del vagon, y no es su primer cambio, recalculamos los botones)
            if (!changes.vagonActivo.firstChange) {
                this.calculaBotonera();
            }
        }
    }

    /**
     * Función que recibe un elemento y una acción, y se la devuelve al componente padre.
     *
     * @param accion Cadena de texto que indica la acción.
     */
    doAccion(accion: string) {
        if (this.vagones) this.notify.emit({ accion: accion, vagon: this.vagones[this.vagonActivo] });
        else this.notify.emit({ accion });
    }

}
