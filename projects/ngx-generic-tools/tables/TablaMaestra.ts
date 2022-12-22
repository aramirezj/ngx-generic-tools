import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, EventEmitter, HostListener, Input, Output, Renderer2, TemplateRef, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { BehaviorSubject, filter, fromEvent, Subscription, take } from 'rxjs';
import { forkJoin } from 'rxjs';
import { GTAccion, GTForm, GT_TF, GTObjetoTabla, GTPeticionExpansion, GTPeticionPaginacion, GTSelectMaestroTabla, GTFormatosTabla } from 'ngx-generic-tools/models';
import { SharedService } from 'ngx-generic-tools/shared';
import { GTBuscadorComponent } from './buscador/buscador.component';


/** Tabla Maestra de la que partirán las demás implementando sus atributos y funciones comunes */
@Component({
    selector: 'gt-TablaMaestra',
    template: ''
})
export abstract class GTTablaMaestra {
    public static inputComunes: string[] = ['datos', 'visual', 'modelo', 'acciones', 'accionesCondicionales', 'buscador',
        'formatos', 'formulario', 'clavePrimaria', 'paginacionAsincrona', 'seleccionable', 'paginador',
        'elementoPreseleccionado', 'objetos', 'selectsPro', 'subjectLoaded', 'filtroAvanzado', 'modoCasillas', 'menuAcciones', 'fxFlexes'];
    //'orden', 'peticionActualizacion'];
    /** Visibilidad del componente de busqueda */
    @ViewChild(GTBuscadorComponent, { static: false }) buscadorApp: GTBuscadorComponent;
    /** Visibilidad del paginador */
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    /** Atributo con la colección de datos a mostrar */
    @Input() datos: any[] = [];
    /** Columnas a mostrar en la tabla */
    @Input() visual: string[];
    /** Columnas del modelo de la colección que recibe */
    @Input() modelo: string[];
    /** Acciones que deberán estar disponibles */
    @Input() acciones: string[];
    /** Listado de acciones con condiciones */
    @Input() accionesCondicionales: GTAccion[];
    /** Formatos a utilizar en la tabla (Euro,porcentaje,etc) */
    @Input() formatos: GTFormatosTabla;
    /** Habilita o deshabilita el buscador de la tabla */
    @Input() buscador: boolean = false;
    /** GTForm que se podrá incluir en el formulario, para, si llama a editarT, invoque el formulario para su edición */
    @Input() formulario: GTForm;
    /** Clave primaria que tendrá la tabla. Se utilizará en las inserciones por método y edición */
    @Input() clavePrimaria: string;
    /** Atributo por el cuál se está ordenando. Se utilizará en las acciones de subir y bajar */
    @Input() orden: string;
    /** Petición asincrona para actualizar los datos al reordenar elementos */
    @Input() peticionActualizacion: GTPeticionExpansion = null;
    /** Petición asincrona para cargar datos y paginador según peticiones HTTP */
    @Input() paginacionAsincrona: GTPeticionPaginacion = null;
    /** Permite que en la tabla, se puede hacer clic para seleccionar un elemento, y enviarlo */
    @Input() seleccionable: boolean;
    /** Control de paginación */
    @Input() paginador: boolean = true;
    /** Recibe un elemento para que, al cargar la tabla, se preseleccione y mande el evento. Se busca por su primaryKey */
    @Input() elementoPreseleccionado: { dato: any, primaryKey: string };
    /** Atributo para cargar objetos complejos a las tablas */
    @Input() objetos: GTObjetoTabla[];
    /** Atributo para cargar selects pro a las tablas */
    @Input() selectsMaestros: GTSelectMaestroTabla[];
    /** En el caso de ser una tabla hija, emitira valor al cargar */
    @Input() subjectLoaded: BehaviorSubject<any>;
    /** Modo para activar el modo casillas de la tabla. Con checkbox */
    @Input() modoCasillas: boolean;
    /** Módo para activar la compresión de acciones en un menú */
    @Input() menuAcciones: boolean;
    /** Fuerza unos tamaños de columnas predeterminados */
    @Input() fxFlexes: number[];
    /** Elemento para notificar al componente que invoca la tabla */
    @Output() notify: EventEmitter<any> = new EventEmitter<any>();
    /** Elemento para notificar un requerimiento de tratamiento de datos después de paginar o filtrar */
    @Output() tratamiento: EventEmitter<any[]> = new EventEmitter<any[]>();
    /** Referencia a la propia tabla, se rellena más tarde */
    matTableRef;
    /** Identificador único de la tabla */
    idTabla: string;
    /** Acciones listas para recorrerlas */
    accionesParsed: GTAccion[];
    /** Lista de acciones que es capaz de gestionar la tabla por si sola, si no está, enviará el evento y yasta */
    accionesAutoGestionadas: string[] = ['subir', 'bajar', 'eliminarT', 'eliminar', 'editarT'];
    /** Opciones posible para la paginación */
    pageSizeOptions: number[] = [5, 10, 25, 100];
    /** Control de la configuración de la paginación */
    pageEvent: PageEvent = { length: 0, pageSize: 5, pageIndex: 0 };
    /** Para tener constancia de cual es la ordenación que se está teniendo ahora mismo */
    ordenacionActual: Sort;
    /** Cadena de busqueda actualizada por la gt-buscador */
    cadenaBusqueda: string;
    /** Datos a visualizar en la tabla */
    datosAMostrar: any[] = this.datos;
    /** Atributo auxiliar para tener en constancia que elemento ha sido seleccionado */
    elementoSeleccionado: any;
    /** Control del checkbox maestro */
    casillaMaestra: { all: boolean, indeterminate: boolean } = { all: false, indeterminate: false };
    /** Relación columnas y su tamaño */
    columnasTamanio: { field: string, width: number, index?: number }[] = [];
    /** Para controlar que se ha presionado el redimensionamiento */
    isPulsado = false;
    /** Para tener en cuenta cual es la columna que se está redimensionando ahora mismo */
    posicionActualRedimension: number;
    /** Para controlar el inicio de la redimensión */
    startX: number;
    /** Para controlar el tamaño inicial del que parte la columna */
    startWidth: number;
    /** Para saber si está redimensionando a la izquierda (true) si no (false) */
    isDireccionDerecha: boolean;
    /** Para asignar el evento de movimiento de ratón */
    resizableMousemove: () => void;
    /** Para vaciar luego el evento de movimiento */
    resizableMouseup: () => void;
    /** Atributo para tener constancia de porque campo se está ordenando */
    ordenActual: { modelo?: string, direccion?: string } = {};
    /** Guardará registro del tamaño inicial de la tabla. Esto nos sirve para saber si antes estaba oculta y tenía 0PX, al intentar redimensionar hará recalculo para dejarla limpa */
    tamanioInicial: number;

    //Menú contextual
    @ViewChild('menuContextual') menuContextual: TemplateRef<any>;
    overlayRef: OverlayRef;
    subMenu: Subscription;
    /** EventEmitter para controlar que aún en varias tablas, solo pueda haber un menú abierto */
    subscriptionMenuService: Subscription;
    constructor(
        public sharedService: SharedService,
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
    paginacion(page?: PageEvent): void {
        this.pageEvent = page ? page : this.pageEvent;
        // Mandamos evento de deselección
        if (this.elementoSeleccionado) this.deselecciona();
        if (this.paginacionAsincrona) {
            const paramsR: string[] = this.paginacionAsincrona.params;
            let filterValue = this.cadenaBusqueda;
            filterValue = filterValue ? filterValue.trim().toUpperCase() : '';
            this.paginacionAsincrona.peticion(
                this.pageEvent.pageIndex,
                this.pageEvent.pageSize,
                this.ordenacionActual?.active ? this.ordenacionActual.active : this.paginacionAsincrona?.orden?.campos ? this.paginacionAsincrona.orden.campos[0] : null,
                this.ordenacionActual?.direction ? this.ordenacionActual.direction : 'DESC',
                [filterValue],
                ...paramsR
            ).subscribe(newData => {
                this.datosAMostrar = newData.datos;
                this.paginacionAsincrona.paginacion = newData.pagina;
                this.paginacionAsincrona.orden = newData.orden;
                this.pageEvent.length = this.paginacionAsincrona.paginacion.numeroRegistrosTotal;
                if (this.paginacionAsincrona.funcionalidadExterna) { this.tratamiento.emit(this.datosAMostrar) };
            });
        } else {
            if (!this.paginador) this.pageEvent.pageSize = 99999;
        }
    }

    /** Restablece la paginación */
    reiniciaPaginacion(): void {
        this.pageEvent.pageIndex = 0;
        this.pageEvent.length = this.paginacionAsincrona ? this.paginacionAsincrona.paginacion.numeroRegistrosTotal : this.datosAMostrar.length;
    }

    /**
     * Lógica para la ordenación de los datos
     *
     * @param ordena
     */
    ordenacion(ordena: Sort): void {
        this.ordenacionActual = ordena;
        if (this.paginacionAsincrona) {
            this.paginacion();
        } else {
            if (this.ordenacionActual) {
                if (!this.cadenaBusqueda) {
                    if (ordena.direction === 'asc') this.datosAMostrar = this.datos.sort((a, b) => (a[ordena.active] > b[ordena.active]) ? 1 : -1);
                    else this.datosAMostrar = this.datos.sort((a, b) => (a[ordena.active] < b[ordena.active]) ? 1 : -1);
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
    busqueda(result: any): void {
        this.cadenaBusqueda = result;
        if (!this.paginacionAsincrona) {
            this.datosAMostrar = this.datos.filter((data) => JSON.stringify(data).toLowerCase().includes(this.cadenaBusqueda));
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
        const index: number = this.datos.indexOf(viejoElemento);
        if (index !== -1) {
            this.datos[index] = nuevoElemento;
            this.datosAMostrar = this.datos.slice();
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
        if (this.clavePrimaria) {
            if (!this.sharedService.findRepeatRecursivo(this.datos.slice(), this.clavePrimaria, elemento)) {
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
    inserta(elemento: any): void {
        this.datos.push(elemento);
        this.datosAMostrar = this.datos.slice();
        this.pageEvent.length = this.datos.length;
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
            this.datos.splice(this.datos.indexOf(elemento), 1);
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
        if (this.accionesCondicionales) {
            this.accionesCondicionales.forEach(accion => { if (accion.observerCondiciones) accion.observerCondiciones.next(1) });
        }
    }

    /**
     * Apertura de un modal para inspeccionar un atributo complejo del elemento principal
     *
     * @param elemento Elemento padre
     * @param posicion Posición del elemento
     */
    openInspeccion(elemento: any, posicion: number): void {
        const objTabla = this.objetos[posicion];
        const form = new GTForm(GT_TF.INSPECCION, objTabla.columnasModelo, objTabla.columnasVisuales, `Inspección de ${objTabla.nombreVisual}`);
        form.controles = Object.assign(objTabla.formulario.controles);
        if (elemento[objTabla.nombreModelo]) {
            if (objTabla.peticion) {
                const params = objTabla.peticion.preparaParametros(elemento);
                objTabla.peticion.peticion(...params).subscribe(resp => {
                    form.elemento = resp;
                    this.sharedService.muestraFormulario(form).subscribe();
                }
                );
            } else {
                form.elemento = elemento[objTabla.nombreModelo];
                this.sharedService.muestraFormulario(form).subscribe();
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
    cambiarOrdenElementos(elemento1: any, elemento2: any): void {
        const intercambioDeOrden = elemento1[this.orden];

        elemento1[this.orden] = elemento2[this.orden];
        elemento2[this.orden] = intercambioDeOrden;

        if (this.peticionActualizacion) {
            const valoresPeticion1: any[] = this.peticionActualizacion.preparaParametros(elemento1);
            const valoresPeticion2: any[] = this.peticionActualizacion.preparaParametros(elemento2);

            forkJoin({
                update1: this.peticionActualizacion.peticion(elemento1, ...valoresPeticion1),
                update2: this.peticionActualizacion.peticion(elemento2, ...valoresPeticion2),
            }).subscribe(() => {
                this.datos.sort((a, b) => a.orden - b.orden);
                this.datosAMostrar = this.datos.slice();
            })

        } else {
            this.datos.sort((a, b) => a.orden - b.orden);
            this.datosAMostrar = this.datos.slice();
        }
    }


    /**
     * Se encarga de establecer calcular el width que deberá tener cada columna, luego al haber actualizado el columns,
     * llama a otra función que lo aplica en el HTML
     *
     * @param anchuraTabla Anchura actual de la tabla
     */
    seteaColumnasTamanios(anchuraTabla: number): void {
        //Si no se ha detectado el tamaño de la tabla por la razón que sea, la seteamos a 5000 para que tenga de sobra
        this.tamanioInicial = anchuraTabla;
        let iTotal: number = 0;
        console.log(this)
        let numeroColumnas = (this.modelo.length + (this.objetos ? this.objetos.length : 0)) + (this.selectsMaestros ? this.selectsMaestros.length : 0);
        if (this.acciones || this.accionesCondicionales && (!this.fxFlexes)) numeroColumnas += 0.5;
        const widthBase: number = 100 / numeroColumnas;
        for (let i = 0; i < this.modelo.length; i++) {
            this.columnasTamanio.push({ field: this.modelo[i], width: this.fxFlexes ? this.fxFlexes[i] : widthBase });
            iTotal++;
        }
        if (this.objetos) {
            for (let i = 0; i < this.objetos.length; i++) {
                this.columnasTamanio.push({ field: this.objetos[i].nombreModelo, width: this.fxFlexes ? this.fxFlexes[iTotal] : widthBase });
                iTotal++;
            }
        }
        if (this.selectsMaestros) {
            for (let i = 0; i < this.selectsMaestros.length; i++) {
                this.columnasTamanio.push({ field: this.selectsMaestros[i].columnaModelo, width: this.fxFlexes ? this.fxFlexes[iTotal] : widthBase });
                iTotal++;
            }
        }

        if (this.acciones || this.accionesCondicionales) this.columnasTamanio.push({ field: 'acciones', width: this.fxFlexes ? this.fxFlexes.pop() : widthBase / 2 });
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
    onRedimensionarColumna(event: any, index: number): void {
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
    compruebaDireccion(event: any, index: number): void {
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
    recuperaCeldaCabecera(index: number): DOMRect {
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
    seteaEventosRaton(index: number): void {
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
    seteaNuevasColumnasTamanio(index: number, width: number): void {
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
    seteaColumnaTamanioHTML(column: any): void {
        const columnEls = Array.from(this.matTableRef.getElementsByClassName(`${this.idTabla}-columna-${column.field}`));
        columnEls.forEach((el: any) => el.style.width = column.width + 'px');
    }

    /**
     * Cambia el orden actual, recibe para que campo se trata, ejecuta la logica pertinente y llama al evento original
     * de ordenación que teniamos con un objeto de tipo Sort
     *
     * @param modelo Campo a ordenar
     */
    cambiaOrden(modelo: string): void {
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
    open({ x, y }: MouseEvent, elemento: any) {
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
    close() {
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





}
