import { Overlay } from '@angular/cdk/overlay';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { GTAccion } from 'ngx-generic-tools/models';
import { SharedService } from 'ngx-generic-tools/shared';
import { GTTablaMaestra } from '../TablaMaestra';
/** Componente de la Tabla encargada del listado y tratado de elementos */
@Component({
    selector: 'gt-table',
    templateUrl: './tabla.component.html',
    styleUrls: ['./tabla.component.scss'],
    inputs: GTTablaMaestra.commonInputs
})
export class GTTableComponent extends GTTablaMaestra implements OnInit, AfterViewInit {
    /** Referencia a la propia tabla */
    override matTableRef: any;
    constructor(
        public override sharedService: SharedService,
        public override renderer: Renderer2,
        private elRef: ElementRef,
        public override overlay:Overlay,
        public override viewContainerRef: ViewContainerRef

    ) {
        super(sharedService,null, renderer,overlay,viewContainerRef);
    }


    ngOnInit(): void {
        console.log('xdd')
        this.preparaTabla();
        this.idTabla = `tabla${this.sharedService.recuperaIdTabla()}`;
        this.sharedService.identificadorTabla++;
    }

    ngAfterViewInit(): void {
        if (this.preselectedElement) this.seleccion(this.preselectedElement.data, this.preselectedElement.primaryKey, true);
        if (this.subjectLoaded) this.subjectLoaded.next(this);


        //console.log(this.searchApp)
      //  if(this.searchApp) this.searchApp.nuevoValor.subscribe(()=> console.log('dawdawdaw'));
        this.matTableRef = this.elRef.nativeElement.querySelector(`#${this.idTabla}`);
        this.seteaColumnasTamanios(this.matTableRef.clientWidth);
    }

    /** Preparación inicial de herramientas necesarias para la tabla */
    preparaTabla(): void {
        this.data = this.data ? this.data : [];
        this.datosAMostrar = this.data.slice();
        this.accionesParsed = this.conditionalActions ? this.conditionalActions : GTAccion.parseAcciones(this.actions);

        //Si contiene la acción de configurar, se debe permitir la selección, usado por las tablas infinitas
        const index = this.accionesParsed.findIndex(accion => accion.funcion === 'configurar');
        if (index !== -1) this.selectable = true;

        this.pageEvent.length = this.datosAMostrar?.length;
        this.pageEvent.pageIndex = 0;
        if (!this.paginator) this.pageEvent.pageSize = 99999;

        if (this.asyncPagination) {
            this.pageEvent.length = this.asyncPagination.paginacion.numeroRegistrosTotal;
        } else {
            this.paginacion(this.pageEvent);
        }

        if (this.checkboxMode) {
            const marcados: any[] = this.datosAMostrar.filter(dato => dato.tSeleccionado === true);
            this.casillaMaestra.all = marcados.length === this.datosAMostrar.length;
            this.casillaMaestra.indeterminate = !this.casillaMaestra.all ? marcados.length > 0 : false;
        }

    }
    /**
     * Lógica para el refresco de la tabla entera según datos que haya recibido
     *
     * @param datos Datos nuevos
     * @param bloqueaPagina En caso de true no se reincia la paginación
     */
    refrescaTabla(datos: any, bloqueaPagina?: boolean): void {
        this.data = datos ? datos : [];
        this.datosAMostrar = this.data.slice();
        if (this.searchApp) this.searchApp.form.reset();
        if (!bloqueaPagina) this.reiniciaPaginacion();
    }
    /**
     * Evento de notificación de cuando se ha realizado una acción
     *
     * @param elemento Elemento sobre el cual se va a realizar la acción
     * @param accion Acción a realizar y devolver
     */
    doAccion(elemento: any, accion: string): void {
        console.log(this.searchApp)
        if (!this.accionesAutoGestionadas.includes(accion)) {
            this.notify.emit({ accion, elemento });
        } else {
            switch (accion) {
                case 'eliminarT':
                    this.sharedService.muestraConfirmacionCK(this.prepareMessage(elemento, this.model[0], this.visual[0])).subscribe(accept => {
                        if (accept) {
                            this.data.splice(this.data.indexOf(elemento), 1);
                            this.datosAMostrar.splice(this.datosAMostrar.indexOf(elemento), 1);
                            this.notify.emit({ accion, elemento });
                        }
                    });
                    break;
                case 'eliminar':
                    this.sharedService.muestraConfirmacionCK(this.prepareMessage(elemento, this.model[0], this.visual[0])).subscribe(accept => {
                        if (accept) {
                            this.notify.emit({ accion, elemento });
                        }
                    });
                    break;
                case 'subir':
                    const elementoSuperior = this.data.find(elementoEnPosicionDestino => elementoEnPosicionDestino[this.order] === elemento[this.order] - 1);
                    if (elementoSuperior) this.cambiarOrdenElementos(elemento, elementoSuperior);
                    else this.sharedService.openSnackBar('No se ha podido cambiar el orden del elemento', 3);
                    this.notify.emit({ accion, elemento });
                    break;
                case 'bajar':
                    const elementoInferior = this.data.find(elementoEnPosicionDestino => elementoEnPosicionDestino[this.order] === elemento[this.order] + 1);
                    if (elementoInferior) this.cambiarOrdenElementos(elemento, elementoInferior);
                    else this.sharedService.openSnackBar('No se ha podido cambiar el orden del elemento', 3);
                    this.notify.emit({ accion, elemento });
                    break;
            }
        }
        if(this.overlayRef) this.close();
    }




    /**
     * Lógica de selección de un elemento
     *
     * @param elemento Elemento a seleccionar
     * @param atributo Por el que filtrar
     * @param preSeleccion Si es true, es que es en el inicio de la tabla que ha detectado que ha de preseleccionar, y no debe devolver evento
     */
    seleccion(elemento: any, atributo?: string, preSeleccion?: boolean): void {
        if (this.selectable) {
            if (atributo) {
                const elementoEncontrado: any = this.datosAMostrar.find(dato => dato[atributo] === elemento[atributo]);
                this.elementoSeleccionado = elementoEncontrado;
            } else {
                this.elementoSeleccionado = this.elementoSeleccionado === elemento ? null : elemento;
            }
            if (preSeleccion) this.searchApp.form.get('busqueda').setValue(elemento[this.model[0]])

            this.notify.emit({ accion: 'configurar', elemento: this.elementoSeleccionado });
        }
    }

    /**
     * Recoge la acción de clicado de la casillaMaestra y pone todas al nuevo estado
     *
     * @param event
     */
    clickTodasCasillas(event: MatCheckboxChange): void {
        this.casillaMaestra.all = event.checked;
        this.casillaMaestra.indeterminate = false;

        const accion: string = event.checked ? 'marcado' : 'desmarcado';
        const agrupacionEventos: any[] = [];
        this.datosAMostrar.forEach(dato => {
            if (dato.tSeleccionado !== event.checked) {
                dato.tSeleccionado = event.checked;
                // En el caso de ser una tabla hija, agrupa todos los elementos y los envia
                if (this.subjectLoaded) agrupacionEventos.push(dato);
                else this.doAccion(dato, accion);
            }
        });
        if (this.subjectLoaded) this.notify.emit({ elemento: agrupacionEventos, accion: accion + 's' });

    }

    /**
     * Recoge la acción de clicado de una casilla, asigna el nuevo valor al elemento, y si todas
     * estan marcadas, marca la casilla maestra
     *
     * @param elemento Elemento clicado
     * @param event Evento del checkbox
     */
    clickCasilla(elemento: any, event: MatCheckboxChange): void {
        elemento.tSeleccionado = event.checked;
        const marcados: any[] = this.datosAMostrar.filter(dato => dato.tSeleccionado === true);
        this.casillaMaestra.all = marcados.length === this.datosAMostrar.length;
        this.casillaMaestra.indeterminate = !this.casillaMaestra.all ? marcados.length > 0 : false;

        this.doAccion(elemento, event.checked ? 'marcado' : 'desmarcado');

    }
}
