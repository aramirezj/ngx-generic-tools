import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, EventEmitter, HostListener, Input, Optional, Output, Renderer2, TemplateRef, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { BehaviorSubject, filter, fromEvent, Subscription, take } from 'rxjs';
import { forkJoin } from 'rxjs';
import { GTAccion, GTForm, GT_TF, GTObjetoTabla, GTPeticionExpansion, GTPeticionPaginacion, GTSelectMaestroTabla, GTFormatosTabla } from 'ngx-generic-tools/models';
import { SharedService } from 'ngx-generic-tools/shared';
import { GTBuscadorComponent } from './buscador/buscador.component';
import { GTFormService } from 'ngx-generic-tools/forms';


/** Tabla Maestra de la que partirán las demás implementando sus atributos y funciones comunes */
@Component({
    selector: 'gt-TablaMaestra',
    template: ''
})
export abstract class GTTablaMaestra {
    public static commonInputs: string[] = ['data', 'visual', 'model', 'actions', 'conditionalActions', 'search',
        'formats', 'form', 'primaryKey', 'asyncPagination', 'selectable', 'paginator',
        'preselectedElement', 'objects', 'masterSelects', 'subjectLoaded', 'advancedFilter', 'checkboxMode', 'actionMenu', 'fxFlexes', 'order', 'updateRequest'];
    /** Visibility of the search component*/
    @ViewChild(GTBuscadorComponent, { static: false }) searchApp: GTBuscadorComponent;
    /**Visibility of the paginator*/
    @ViewChild(MatPaginator, { static: false }) paginatorC: MatPaginator;
    /**Attribute with the collection of data to show*/
    @Input() data: any[] = [];
    /**Columns to display in the table*/
    @Input() visual: string[];
    /**Columns of the model of the collection that is received*/
    @Input() model: string[];
    /**Actions that should be available*/
    @Input() actions: string[];
    /**List of actions with conditions*/
    @Input() conditionalActions: GTAccion[];
    /**Formats to use in the table (Euro, percentage, etc.)*/
    @Input() formats: GTFormatosTabla;
    /**Enables or disables the search of the table*/
    @Input() search: boolean = false;
    /**GTForm that can be included in the form, so that, if it calls editT, it invokes the form for its edition*/
    @Input() form: GTForm;
    /**Primary key that the table will have. It will be used in insertions by method and edition*/
    @Input() primaryKey: string;
    /**Attribute by which it is being ordered. It will be used in the up and down actions*/
    @Input() order: string;
    /**Asynchronous request to update the data when reordering elements*/
    @Input() updateRequest: GTPeticionExpansion = null;
    /**Asynchronous request to load data and paginator according to HTTP requests*/
    @Input() asyncPagination: GTPeticionPaginacion = null;
    /**Allows you to click on the table to select an element and send it*/
    @Input() selectable: boolean;
    /**Control of pagination*/
    @Input() paginator: boolean = true;
    /**Receives an element to be preselected and send the event when the table is loaded. It is searched by its primaryKey*/
    @Input() preselectedElement: { data: any, primaryKey: string };
    /**Attribute to load complex objects into tables*/
    @Input() objects: GTObjetoTabla[];
    /**Attribute to load master selects into tables*/
    @Input() masterSelects: GTSelectMaestroTabla[];
    /**In the case of being a child table, it will emit a value when loaded*/
    @Input() subjectLoaded: BehaviorSubject<any>;
    /**Mode to activate the checkbox mode of the table. With checkbox*/
    @Input() checkboxMode: boolean;
    /**Mode to activate the compression of actions in a menu*/
    @Input() actionMenu: boolean;
    /**Forces some sizes to the table, depending on the number of columns it has. It is used as a [fxFlex]*/
    @Input() fxFlexes: number[];
    /** Element to notify the component that invokes the table */
    @Output() notify: EventEmitter<any> = new EventEmitter<any>();
    /** Element to notify a request for data treatment after paging or filtering */
    @Output() tratamiento: EventEmitter<any[]> = new EventEmitter<any[]>();
    /** Reference to the table itself, filled later */
    protected matTableRef;
    /** Unique identifier of the table */
    protected idTabla: string;
    /** Ready actions to be processed */
    protected accionesParsed: GTAccion[];
    /** List of actions that the table is capable of managing on its own, if it is not, it will send the event and that's it */
    protected accionesAutoGestionadas: string[] = ['subir', 'bajar', 'eliminarT', 'eliminar', 'editarT'];
    /** Possible options for pagination */
    protected pageSizeOptions: number[] = [5, 10, 25, 100];
    /** Control of pagination configuration */
    protected pageEvent: PageEvent = { length: 0, pageSize: 5, pageIndex: 0 };
    /** To keep track of what order is currently being taken */
    protected ordenacionActual: Sort;
    /** Search string updated by the gt-search */
    protected cadenaBusqueda: string;
    /** Data to display in the table */
    datosAMostrar: any[] = this.data;
    /** Auxiliary attribute to keep track of which element has been selected */
    elementoSeleccionado: any;
    /** Control of the master checkbox */
    casillaMaestra: { all: boolean, indeterminate: boolean } = { all: false, indeterminate: false };
    /** Relationship between columns and their size */
    protected columnasTamanio: { field: string, width: number, index?: number }[] = [];
    /** To control that resizing has been pressed */
    protected isPulsado = false;
    /** To keep track of which column is currently being resized */
    protected posicionActualRedimension: number;
    /** To control the start of the resizing */
    protected startX: number;
    /** To control the initial size from which the column starts */
    protected startWidth: number;
    /** To know if it is resizing to the left (true) if not (false) */
    protected isDireccionDerecha: boolean;
    /** To assign the mouse movement event */
    protected resizableMousemove: () => void;
    /** To empty the mouse movement event later */
    protected resizableMouseup: () => void;
    /** Attribute to keep track of why the field is being sorted */
    protected ordenActual: { modelo?: string, direccion?: string } = {};
    /** Will save record of the initial size of the table. This helps us know if it was hidden before and had 0PX, when trying to resize it will recalculate to leave it clean */
    protected tamanioInicial: number;

    //Context menu
    @ViewChild('menuContextual') protected menuContextual: TemplateRef<any>;
    protected overlayRef: OverlayRef;
    protected subMenu: Subscription;
    /** EventEmitter to control that even in several tables, only one menu can be open */
    protected subscriptionMenuService: Subscription;


    constructor(
        public sharedService: SharedService,
        @Optional() public formService: GTFormService,
        public renderer: Renderer2,
        public overlay: Overlay,
        public viewContainerRef: ViewContainerRef
    ) {
    }


    /**
     * Lógica para la paginación. Si recibe una pagina, la asigna, si no, la crea según los datos actuales
     *
     * @param page Página recibida y a asignar
     */
    protected paginacion(page?: PageEvent): void {
        this.pageEvent = page ? page : this.pageEvent;
        // Mandamos evento de deselección
        if (this.elementoSeleccionado) this.deselecciona();
        if (this.asyncPagination) {
            const paramsR: string[] = this.asyncPagination.params;
            let filterValue = this.cadenaBusqueda;
            filterValue = filterValue ? filterValue.trim().toUpperCase() : '';
            this.asyncPagination.peticion(
                this.pageEvent.pageIndex,
                this.pageEvent.pageSize,
                this.ordenacionActual?.active ? this.ordenacionActual.active : this.asyncPagination?.orden?.campos ? this.asyncPagination.orden.campos[0] : null,
                this.ordenacionActual?.direction ? this.ordenacionActual.direction : 'DESC',
                [filterValue],
                ...paramsR
            ).subscribe(newData => {
                this.datosAMostrar = newData.datos;
                this.asyncPagination.paginacion = newData.pagina;
                this.asyncPagination.orden = newData.orden;
                this.pageEvent.length = this.asyncPagination.paginacion.numeroRegistrosTotal;
                if (this.asyncPagination.funcionalidadExterna) { this.tratamiento.emit(this.datosAMostrar) };
            });
        } else {
            if (!this.paginator) this.pageEvent.pageSize = 99999;
        }
    }

    /** Restablece la paginación */
    protected reiniciaPaginacion(): void {
        this.pageEvent.pageIndex = 0;
        this.pageEvent.length = this.asyncPagination ? this.asyncPagination.paginacion.numeroRegistrosTotal : this.datosAMostrar.length;
    }

    /**
     * Lógica para la ordenación de los datos
     *
     * @param ordena
     */
    protected ordenacion(ordena: Sort): void {
        this.ordenacionActual = ordena;
        if (this.asyncPagination) {
            this.paginacion();
        } else {
            if (this.ordenacionActual) {
                if (!this.cadenaBusqueda) {
                    if (ordena.direction === 'asc') this.datosAMostrar = this.data.sort((a, b) => (a[ordena.active] > b[ordena.active]) ? 1 : -1);
                    else this.datosAMostrar = this.data.sort((a, b) => (a[ordena.active] < b[ordena.active]) ? 1 : -1);
                } else {
                    if (ordena.direction === 'asc') this.datosAMostrar.sort((a, b) => (a[ordena.active] > b[ordena.active]) ? 1 : -1);
                    else this.datosAMostrar.sort((a, b) => (a[ordena.active] < b[ordena.active]) ? 1 : -1);
                }
            }

        }
    }

    /**
     * Lógica para el filtrado de datos. Básicamente crea una copia original, sobre la que trabaja
     * convirtiendo luego en json para un mejor filtrado de datos
     *
     * @param valor Valor sobre el que filtrar
     */
    protected busqueda(result: any): void {
        this.cadenaBusqueda = result;
        if (!this.asyncPagination) {
            this.datosAMostrar = this.data.filter((data) => JSON.stringify(data).toLowerCase().includes(this.cadenaBusqueda));
            this.reiniciaPaginacion();
        } else {
            this.pageEvent.pageIndex = 0;
            this.paginacion(this.pageEvent);
        }
        if (this.elementoSeleccionado) {
            this.elementoSeleccionado = null;
            this.notify.emit({ accion: 'configurar', elemento: null });
        }
    }

    /**
     * Realiza la sustitución de un nuevo elemento. Se utiliza por ejemplo cuando no se usa EditorGenerico, o cuando hay que hacerle rollback a un elemento
     *
     * @param viejoElemento Elemento antiguo que buscar
     * @param nuevoElemento Elemento nuevo
     */
    sustituyeElemento(viejoElemento: any, nuevoElemento: any): void {
        const index: number = this.data.indexOf(viejoElemento);
        if (index !== -1) {
            this.data[index] = nuevoElemento;
            this.datosAMostrar = this.data.slice();
        } else {
            this.sharedService.openSnackBar('No se ha encontrado el elemento a sustituir', 3);
        }
    }

    /**
     * Lógica para añadir a la tabla un nuevo elemento. Si lleva clave primaria, no lo insertará si su clave está repetida
     *
     * @param elemento Elemento a añadir
     */
    addNuevoElemento(elemento: any): void {
        if (this.primaryKey) {
            if (!this.sharedService.findRepeatRecursivo(this.data.slice(), this.primaryKey, elemento)) {
                this.inserta(elemento);
            }
        } else {
            this.inserta(elemento);
        }
    }

    /**
     * Realiza una insercción
     *
     * @param elemento Elemento a insertar
     */
    protected inserta(elemento: any): void {
        this.data.push(elemento);
        this.datosAMostrar = this.data.slice();
        this.pageEvent.length = this.data.length;
        this.ordenacion(this.ordenacionActual);
    }

    /**
     * Borra un elemento de la tabla
     *
     * @param elemento Elemento a borrar
     */
    borraElemento(elemento: any): void {
        const result = this.datosAMostrar.splice(this.datosAMostrar.indexOf(elemento), 1);
        if (result) {
            this.data.splice(this.data.indexOf(elemento), 1);
            this.pageEvent.length--;
        }
        const isEmpty: boolean = (this.pageEvent.pageIndex * this.pageEvent.pageSize) >= this.pageEvent.length;
        if (isEmpty) {
            if (this.pageEvent.pageIndex > 0) this.pageEvent.pageIndex--;
            this.paginacion(this.pageEvent);
        }
    }

    /** Comprueba las condiciones de las acciones para volver a evaluar */
    compruebaCondiciones(): void {
        if (this.conditionalActions) {
            this.conditionalActions.forEach(accion => { if (accion.observerCondiciones) accion.observerCondiciones.next(1) });
        }
    }

    /**
     * Apertura de un modal para inspeccionar un atributo complejo del elemento principal
     *
     * @param elemento Elemento padre
     * @param posicion Posición del elemento
     */
    openInspeccion(elemento: any, posicion: number): void {
        const objTabla = this.objects[posicion];
        const form = new GTForm(GT_TF.INSPECTION, objTabla.columnasModelo, objTabla.columnasVisuales, `Inspección de ${objTabla.nombreVisual}`);
        form.controles = Object.assign(objTabla.formulario.controles);
        if (elemento[objTabla.nombreModelo]) {
            if (objTabla.peticion) {
                const params = objTabla.peticion.preparaParametros(elemento);
                objTabla.peticion.peticion(...params).subscribe(resp => {
                    form.elemento = resp;
                    this.formService.showForm(form).subscribe();
                }
                );
            } else {
                form.elemento = elemento[objTabla.nombreModelo];
                this.formService.showForm(form).subscribe();
            }
        } else {
            this.sharedService.openSnackBar('Este elemento no tiene ' + objTabla.nombreVisual, 3);
        }
    }

    /** Función para ejecutar desde componentes padres para emitir una deselección */
    deselecciona(): void {
        this.elementoSeleccionado = null;
        this.notify.emit({ accion: 'configurar', elemento: this.elementoSeleccionado });
    }

    /**
     * Método para buscar un elemento y recuperarlo
     *
     * @param field Campo por el que filtrar
     * @param value Valor
     * @returns Elemento en cuestión
     */
    recuperaElemento(field: string, value: any): any {
        const elemento: any = this.datosAMostrar.find(dato => dato[field] === value);
        if (elemento) return elemento;
        else this.sharedService.openSnackBar('No se ha encontrado el elemento a recuperar', 3);
    }

    /**
     * Intercambia la posicion de dos elementos de la tabla, realiza la llamada asíncrona de actualización
     * y actualiza la tabla al terminar.
     *
     * @param elemento1
     * @param elemento2
     */
    protected cambiarOrdenElementos(elemento1: any, elemento2: any): void {
        const intercambioDeOrden = elemento1[this.order];

        elemento1[this.order] = elemento2[this.order];
        elemento2[this.order] = intercambioDeOrden;

        if (this.updateRequest) {
            const valoresPeticion1: any[] = this.updateRequest.preparaParametros(elemento1);
            const valoresPeticion2: any[] = this.updateRequest.preparaParametros(elemento2);

            forkJoin({
                update1: this.updateRequest.peticion(elemento1, ...valoresPeticion1),
                update2: this.updateRequest.peticion(elemento2, ...valoresPeticion2),
            }).subscribe(() => {
                this.data.sort((a, b) => a.orden - b.orden);
                this.datosAMostrar = this.data.slice();
            })

        } else {
            this.data.sort((a, b) => a.orden - b.orden);
            this.datosAMostrar = this.data.slice();
        }
    }


    /**
     * Se encarga de establecer calcular el width que deberá tener cada columna, luego al haber actualizado el columns,
     * llama a otra función que lo aplica en el HTML
     *
     * @param anchuraTabla Anchura actual de la tabla
     */
    protected seteaColumnasTamanios(anchuraTabla: number): void {
        //Si no se ha detectado el tamaño de la tabla por la razón que sea, la seteamos a 5000 para que tenga de sobra
        this.tamanioInicial = anchuraTabla;
        let iTotal: number = 0;
        console.log(this)
        let numeroColumnas = (this.model.length + (this.objects ? this.objects.length : 0)) + (this.masterSelects ? this.masterSelects.length : 0);
        if (this.actions || this.conditionalActions && (!this.fxFlexes)) numeroColumnas += 0.5;
        const widthBase: number = 100 / numeroColumnas;
        for (let i = 0; i < this.model.length; i++) {
            this.columnasTamanio.push({ field: this.model[i], width: this.fxFlexes ? this.fxFlexes[i] : widthBase });
            iTotal++;
        }
        if (this.objects) {
            for (let i = 0; i < this.objects.length; i++) {
                this.columnasTamanio.push({ field: this.objects[i].nombreModelo, width: this.fxFlexes ? this.fxFlexes[iTotal] : widthBase });
                iTotal++;
            }
        }
        if (this.masterSelects) {
            for (let i = 0; i < this.masterSelects.length; i++) {
                this.columnasTamanio.push({ field: this.masterSelects[i].columnaModelo, width: this.fxFlexes ? this.fxFlexes[iTotal] : widthBase });
                iTotal++;
            }
        }

        if (this.actions || this.conditionalActions) this.columnasTamanio.push({ field: 'acciones', width: this.fxFlexes ? this.fxFlexes.pop() : widthBase / 2 });
        let totWidth = 0;
        this.columnasTamanio.forEach((column) => {
            totWidth += column.width;
        });
        const scale = (anchuraTabla - 5) / totWidth;
        this.columnasTamanio.forEach((column) => {
            column.width *= scale;
            this.seteaColumnaTamanioHTML(column);
        });
    }

    /**
     * Función que comienza a recoger información sobre la columna que se está redimensionando ahora mismo
     *
     * @param event Evento JS
     * @param index Posición de la columna
     */
    protected onRedimensionarColumna(event: any, index: number): void {
        this.compruebaDireccion(event, index);
        this.posicionActualRedimension = index;
        this.isPulsado = true;
        this.startX = event.pageX;
        this.startWidth = event.target.parentElement.clientWidth;
        event.preventDefault();
        this.seteaEventosRaton(index);
    }
    /**
     * Lógica para averiguar si está redimensionando a la izquierda o a la derecha
     *
     * @param event Evento JS
     * @param index Posición de la columna
     */
    protected compruebaDireccion(event: any, index: number): void {
        const cellData: DOMRect = this.recuperaCeldaCabecera(index);
        if ((index === 0) || (Math.abs(event.pageX - cellData.right) < cellData.width / 2 && index !== this.columnasTamanio.length - 1)) {
            this.isDireccionDerecha = true;
        } else {
            this.isDireccionDerecha = false;
        }
    }

    /**
     * Obtiene la información de la cabecera de la tabla, que columna en concreto
     *
     * @param index Celda en concreto
     * @returns El tamaño y posición actual de la celda
     */
    protected recuperaCeldaCabecera(index: number): DOMRect {
        const headerRow = this.matTableRef.children[0];
        const cell = headerRow.children[index];
        return cell.getBoundingClientRect();
    }

    /**
     * En el momento de clic de una de las paredes de redimensionamiento, asigna los eventos de movimiento de ratón y clic liberado para con
     * el primero hacer ejecutar el seteo de tamaño de columna, y con el segúndo, limpiar todo
     *
     * @param index Posición de la columna
     */
    protected seteaEventosRaton(index: number): void {
        this.resizableMousemove = this.renderer.listen('document', 'mousemove', (event) => {
            if (this.isPulsado && event.buttons) {
                const dx = (this.isDireccionDerecha) ? (event.pageX - this.startX) : (-event.pageX + this.startX);
                const width = this.startWidth + dx;
                if (this.posicionActualRedimension === index && width > 50) {
                    this.seteaNuevasColumnasTamanio(index, width);
                }
            }
        });

        // Para limpiar los eventos
        this.resizableMouseup = this.renderer.listen('document', 'mouseup', (event) => {
            if (this.isPulsado) {
                this.isPulsado = false;
                this.posicionActualRedimension = -1;
                this.resizableMousemove();
                this.resizableMouseup();
            }
        });
    }

    /**
     * Calcula y setea en el array el nuevo tamaño que tendrá la columna
     *
     * @param index Posición de la columna
     * @param width Tamaño nuevo
     */
    protected seteaNuevasColumnasTamanio(index: number, width: number): void {
        const orgWidth: number = this.columnasTamanio[index].width;
        const dx: number = width - orgWidth;
        if (dx !== 0) {
            const j: number = this.isDireccionDerecha ? index + 1 : index - 1;
            const newWidth: number = this.columnasTamanio[j].width - dx;
            if (newWidth > 50) {
                this.columnasTamanio[index].width = width;
                this.seteaColumnaTamanioHTML(this.columnasTamanio[index]);
                this.columnasTamanio[j].width = newWidth;
                this.seteaColumnaTamanioHTML(this.columnasTamanio[j]);
            }
        }
    }
    /**
     * Setea en la columna HTML el nuevo tamaño a través de la clase
     *
     * @param column Columna a modificar
     */
    protected seteaColumnaTamanioHTML(column: any): void {
        const columnEls = Array.from(this.matTableRef.getElementsByClassName(`${this.idTabla}-columna-${column.field}`));
        columnEls.forEach((el: any) => el.style.width = column.width + 'px');
    }

    /**
     * Cambia el orden actual, recibe para que campo se trata, ejecuta la logica pertinente y llama al evento original
     * de ordenación que teniamos con un objeto de tipo Sort
     *
     * @param modelo Campo a ordenar
     */
    protected cambiaOrden(modelo: string): void {
        if (this.ordenActual.modelo && this.ordenActual.modelo !== modelo) {
            this.ordenActual.direccion = null;
        }
        this.ordenActual.modelo = this.ordenActual.modelo && this.ordenActual.modelo !== modelo ? null : modelo;
        this.ordenActual.direccion = this.ordenActual.direccion ? this.ordenActual.direccion === 'DESC' ? null : 'DESC' : 'ASC';
        this.ordenActual.modelo = this.ordenActual.direccion ? modelo : null;
        const objSort = { active: this.ordenActual.modelo, direction: this.ordenActual.direccion?.toLowerCase() };
        this.ordenacion(objSort as Sort);
    }

    //Menu contextual
    /**
     * 
     * @param param0 Posición clicada
     * @param elemento Elemento clicado
     */
    protected open({ x, y }: MouseEvent, elemento: any) {
        this.close();
        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo({ x, y })
            .withPositions([{ originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' }]);

        this.overlayRef = this.overlay.create({ positionStrategy, scrollStrategy: this.overlay.scrollStrategies.close() });
        this.overlayRef.attach(new TemplatePortal(this.menuContextual, this.viewContainerRef, { $implicit: elemento }));

        this.subMenu = fromEvent<MouseEvent>(document, 'click').pipe(filter(event => {
            const clickTarget = event.target as HTMLElement;
            return !!this.overlayRef && !this.overlayRef.overlayElement.contains(clickTarget);
        }), take(1)
        ).subscribe(() => this.close());

        //Emito un valor para que todas las demás tablas se cierren
        this.sharedService.menuContextualAbierto.emit(true);
        this.subscriptionMenuService = this.sharedService.menuContextualAbierto.subscribe(() => this.close());

    }
    /** Cierra el menú */
    protected close() {
        this.subMenu && this.subMenu.unsubscribe();
        //Si estoy suscrito, me desuscribo porque al abrir no me interesa autocerrarme
        if (this.subscriptionMenuService) {
            this.subscriptionMenuService.unsubscribe();
            this.subscriptionMenuService = null;
        }
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }


    /**
    * Escucha del evento de resize de la ventana para recalcular los tamaños de la tabla
    *
    * @param event Evento de redimensión
    */
    @HostListener('window:resize', ['$event'])
    onResize(): void {
        this.seteaColumnasTamanios(this.matTableRef.clientWidth);
    }


    /**
     * Prepare the message for deleting
     * @param element Element to delete
     * @param model From where should it take the information
     * @param visual How should it show it to the user
     * @returns The message
     */
    protected prepareMessage(element: any, model: string, visual: string): string {

        return `Are you sure about deleting the element with the ${visual} : ${element[model]}?`;


    }





}
