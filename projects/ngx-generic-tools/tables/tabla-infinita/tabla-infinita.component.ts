import { trigger, transition, style, animate } from '@angular/animations';
import { Overlay } from '@angular/cdk/overlay';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { BehaviorSubject } from 'rxjs';
import { GTAccion, GTFormulario, GTTF, GTPeticionExpansion, GTSelectMaestroTabla } from 'ngx-generic-tools/models';
import { SharedService } from 'ngx-generic-tools/shared';
import { GTTablaComponent } from '../tabla/tabla.component';
import { GTTablaMaestra } from '../TablaMaestra';

/** Componente de la Tabla encargada del listado y tratado de elementos */
@Component({
    selector: 'gt-tabla-infinita',
    templateUrl: './tabla-infinita.component.html',
    styleUrls: ['./tabla-infinita.component.scss'],
    animations: [
        trigger('inOutAnimation',
            [transition(':enter',
                [
                    style({ opacity: 0 }),
                    animate('0.1s ease-out',
                        style({ opacity: 1 }))
                ]),
            transition(':leave',
                [
                    style({ opacity: 1 }),
                    animate('0.1s ease-in',
                        style({ opacity: 0 }))
                ]
            )])
    ],
    inputs: GTTablaMaestra.inputComunes
})
export class TablaInfinitaComponent extends GTTablaMaestra implements OnInit, AfterViewInit {
    /** Instancia de la Tabla Hija */
    @ViewChild(GTTablaComponent, { static: false }) tablaHija: GTTablaComponent;
    /** Instancia de la Tabla Infinita hija */
    @ViewChild(TablaInfinitaComponent, { static: false }) tablaInfinitaHija: TablaInfinitaComponent;
    /** Acciones con condiciones */
    @Input() nivelesAccionesCondicionales: GTAccion[][];
    /** Acciones que se iran sumando a las tablas hijas */
    @Input() nivelesAcciones: Array<string[]>;
    /** Niveles de conjuntos de selects pro para ir transmitiendoselas a las tablas hijas */
    @Input() nivelesSelectsMaestro: GTSelectMaestroTabla[][];
    /** Columnas a mostrar en la tabla */
    @Input() visuales: string[][];
    /** Columnas del modelo de la colección que recibe */
    @Input() modelos: string[][];
    /** Colección para saber los nombres de los atributos de los cuales ir sacando las anidaciones */
    @Input() niveles: string[];
    /** Colección para saber los titulos de las siguientes tablas */
    @Input() nivelesTitulos: string[];
    /** Colección para saber los nombres de los atributos por los que ordenar para las acciones de subir y bajar */
    @Input() nivelesOrden: string[];
    /** Petición que se ejecutará al expandir la tabla */
    @Input() peticionExpansion: GTPeticionExpansion;
    /** Atributo para ir teniendo constancia de en que paso de la anidación estamos, comienza en 0 */
    @Input() indiceAnidacion: number = 0;
    /** Colección de peticiones de expansion de las cuales ir anidando */
    @Input() peticionesInfinitas: GTPeticionExpansion[];
    /** Colección de peticiones de actualización para la ordenacion */
    @Input() peticionesActualizacion: GTPeticionExpansion[];
    /** Flag que indicará si los hijos siempre serán iguales al padre */
    @Input() herencia: boolean;
    /** Colección para saber el modoNumeroHijos de las siguientes tablas */
    @Input() nivelesModoNumeroHijos: boolean[];
    /** Si se activa, evaluará si los elementos tienen la propiedad numeroElementosHijos, si es más que 0, muestra expandir, si no no */
    @Input() modoNumeroHijos: boolean = false;
    /** Si se activa, la petición expansión solo se cargará la primera vez que se abre, está pensado para guardar los contenidos en bloque */
    @Input() recargaEnFrio: boolean = false;
    /** Para indicar los niveles de los fxFlexes a la tabla infinita  */
    @Input() nivelesFxFlexes: number[][];
    /** Emite un evento cuando se ha cargado una tabla hija */
    @Output() hijaCargada: EventEmitter<any> = new EventEmitter<any>();
    /** Titulo usado para dar informacion de las tablas hijas */
    tituloHijo: string;
    /** Atributo para tener constancia cual será la siguiente anidación */
    nextTabla: string;
    /** Si está a true, significa que la siguiente anidación, es otra tabla de expansión */
    nextTablaInfinita: boolean = false;
    /** Subject para controlar cuando la tabla hija se ha cargado */
    childrenLoaded: BehaviorSubject<any> = new BehaviorSubject(0);

    constructor(
        public override sharedService: SharedService,
        public override renderer: Renderer2,
        public override overlay: Overlay,
        public override viewContainerRef: ViewContainerRef,
        private elRef: ElementRef,

    ) {
        super(sharedService, renderer, overlay, viewContainerRef);
    }

    ngOnInit(): void {
        this.seleccionable = this.seleccionable === false ? false : true;
        this.idTabla = `tabla${this.sharedService.recuperaIdTabla()}`;
        this.sharedService.identificadorTabla++;
        this.preparaTabla();
    }

    ngAfterViewInit(): void {
        if (this.elementoPreseleccionado) this.seleccion(this.elementoPreseleccionado.dato);
        this.matTableRef = this.elRef.nativeElement.querySelector(`#${this.idTabla}`);
        this.seteaColumnasTamanios(this.matTableRef.clientWidth);

    }

    /** Preparación inicial de herramientas necesarias para la tabla */
    preparaTabla(): void {
        this.datos = this.datos ? this.datos : [];
        this.datosAMostrar = this.datos.slice();

        this.pageEvent.length = this.datosAMostrar?.length;
        this.pageEvent.pageIndex = 0;
        if (this.paginacionAsincrona) {
            this.pageEvent.length = this.paginacionAsincrona.paginacion.numeroRegistrosTotal;
        } else {
            this.paginacion(this.pageEvent);
        }

        this.modelo = this.modelos[this.indiceAnidacion].slice();
        this.visual = this.visuales[this.indiceAnidacion].slice();
        this.nivelesAcciones = this.nivelesAcciones ? this.nivelesAcciones : [];
        this.selectsMaestros = this.nivelesSelectsMaestro ? this.nivelesSelectsMaestro[this.indiceAnidacion] : null;
        this.acciones = [];
        this.modoNumeroHijos = this.nivelesModoNumeroHijos ? this.nivelesModoNumeroHijos[this.indiceAnidacion] : this.modoNumeroHijos;
        this.accionesParsed = this.nivelesAccionesCondicionales ? this.nivelesAccionesCondicionales[this.indiceAnidacion] : GTAccion.parseAcciones(this.nivelesAcciones[this.indiceAnidacion]);
        this.accionesCondicionales = this.nivelesAccionesCondicionales ? this.nivelesAccionesCondicionales[this.indiceAnidacion] : this.accionesCondicionales;
        this.orden = this.nivelesOrden ? this.nivelesOrden[this.indiceAnidacion] : this.orden;
        this.peticionActualizacion = this.peticionesActualizacion ? this.peticionesActualizacion[this.indiceAnidacion] : this.peticionActualizacion;
        this.nextTabla = this.niveles?.[this.indiceAnidacion];
        this.tituloHijo = this.nivelesTitulos[this.indiceAnidacion];
        this.fxFlexes = this.nivelesFxFlexes ? this.nivelesFxFlexes[this.indiceAnidacion] : null;
        if (this.peticionesInfinitas) this.peticionExpansion = this.peticionesInfinitas[this.indiceAnidacion]
        if (!this.herencia) this.indiceAnidacion++;
        if (this.niveles?.[this.indiceAnidacion]) this.nextTablaInfinita = true;
        if (this.modoCasillas) this.refrescaCasillas();

    }
    /**
     * Lógica para el refresco de la tabla entera según datos que haya recibido
     *
     * @param datos Datos nuevos
     */
    refrescaTabla(datos: any): void {
        this.datos = datos ? datos : [];
        this.datosAMostrar = this.datos.slice();
        if (this.buscadorApp) this.buscadorApp.form.reset();
        this.reiniciaPaginacion();
        this.refrescaTablasHijas();
    }

    /** Refresca las tablas hijas que tengan */
    refrescaTablasHijas(): void {
        if (this.tablaHija) this.tablaHija.refrescaTabla(this.tablaHija.datos);
        if (this.tablaInfinitaHija) this.tablaInfinitaHija.refrescaTabla(this.tablaInfinitaHija.datos);
    }

    /**
     * Evento de notificación de cuando se ha realizado una acción
     *
     * @param elemento Elemento sobre el cual se va a realizar la acción
     * @param accion Acción a realizar y devolver
     */
    doAccion(elemento: any, accion: string): void {
        if (!this.accionesAutoGestionadas.includes(accion)) {
            this.enviaNotificacion({ accion, elemento });
        } else {
            switch (accion) {
                case 'eliminarT':
                    this.sharedService.muestraConfirmacion('eliminarGenerico2', elemento, this.modelo[0], this.visual[0]).subscribe(accept => {
                        if (accept) {
                            this.borraElemento(elemento)
                            this.enviaNotificacion({ accion, elemento });
                        }
                    });
                    break;
                case 'eliminar':
                    this.sharedService.muestraConfirmacion('eliminarGenerico2', elemento, this.modelo[0], this.visual[0]).subscribe(accept => {
                        if (accept) {
                            this.enviaNotificacion({ accion, elemento });
                        }
                    });
                    break;
                case 'editarT':
                    if (this.formulario) {
                        this.formulario.elemento = elemento;
                        this.sharedService.muestraFormulario(this.formulario).subscribe(elementModified => {
                            if (elementModified) {
                                elemento = elementModified;
                                this.enviaNotificacion({ accion, elemento });
                            }
                        });
                    } else {
                        const form = new GTFormulario(GTTF.EDICION, this.modelo, this.visual, 'Edición del elemento');
                        form.elemento = elemento;
                        this.sharedService.muestraFormulario(form).subscribe(resp => {
                            if (resp) {
                                if (this.clavePrimaria) {
                                    if (!this.sharedService.findRepeat(this.datos.slice().concat([resp]), this.clavePrimaria)) {
                                        this.enviaNotificacion({ accion, elemento });
                                    }
                                } else {
                                    this.enviaNotificacion({ accion, elemento });
                                }
                            }
                        });
                    }
                    break;
                case 'subir':
                    const elementoSuperior = this.datos.find(elementoEnPosicionDestino => elementoEnPosicionDestino[this.orden] === elemento[this.orden] - 1);
                    if (elementoSuperior) this.cambiarOrdenElementos(elemento, elementoSuperior);
                    else this.sharedService.openSnackBar('No se ha podido cambiar el orden del elemento', 3);
                    this.notify.emit({ accion, elemento });
                    break;
                case 'bajar':
                    const elementoInferior = this.datos.find(elementoEnPosicionDestino => elementoEnPosicionDestino[this.orden] === elemento[this.orden] + 1);
                    if (elementoInferior) this.cambiarOrdenElementos(elemento, elementoInferior);
                    else this.sharedService.openSnackBar('No se ha podido cambiar el orden del elemento', 3);
                    this.notify.emit({ accion, elemento });
                    break;
            }
        }
        if (this.overlayRef) this.close();
    }


    /**
     * Realiza insercciones a elementos hijos
     *
     * @param raiz Elemento padre
     * @param elementoNuevo Elemento a añadir
     */
    addNuevoElementoHijo(raiz: any, elementoNuevo: any): void {
        const pos = this.datos.indexOf(raiz);
        if (pos !== -1) {
            this.datos[pos][this.nextTabla] ? this.datos[pos][this.nextTabla].push(elementoNuevo) : this.datos[pos][this.nextTabla] = [elementoNuevo];
            this.refrescaTablasHijas();
            if (this.modoNumeroHijos && raiz.numeroElementosHijos == 0) raiz.numeroElementosHijos++;
        }
        else {
            if (this.tablaInfinitaHija) this.tablaInfinitaHija.addNuevoElementoHijo(raiz, elementoNuevo);
        }
    }

    /**
     * Lógica de selección de un elemento
     *
     * @param elemento Elemento a seleccionar
     * @param forzado Si está a true, fuerza la ejecución de la lógica de selección aunque ya estuviera
     */
    seleccion(elemento: any, forzado?: boolean): void {
        if (this.seleccionable) {
            if (this.peticionExpansion && (!this.recargaEnFrio || !elemento[this.nextTabla])) {
                if (this.elementoSeleccionado === elemento && !forzado) {
                    this.elementoSeleccionado = null;
                    this.enviaNotificacion({ accion: 'configurar', elemento: this.elementoSeleccionado });
                } else {
                    // Lógica de expansión asincrona
                    const valoresPeticion: any[] = this.peticionExpansion.preparaParametros(elemento);
                    try {
                        this.peticionExpansion.peticion(...valoresPeticion).subscribe(result => {
                            this.elementoSeleccionado = elemento;
                            if (this.peticionExpansion.herencias) {
                                for (const fila of result) {
                                    for (const herencia of this.peticionExpansion.herencias) {
                                        fila[herencia] = elemento[herencia];
                                    }
                                }
                            }
                            elemento[this.nextTabla] = result;
                            this.enviaNotificacion({ accion: 'configurar', elemento: this.elementoSeleccionado });
                            this.childrenLoaded.subscribe(tabla => {
                                if (tabla !== 0) this.tablaHija = tabla;
                                this.hijaCargada.emit(this.tablaHija);
                            });

                            if (result?.length === 0 || !result) {
                                this.sharedService.openSnackBar(`No se han recuperado ${this.tituloHijo}`, 1);
                            }
                        });
                    } catch (error) {
                        //Si da un error, es posiblemente porque la petición pedía un parametro obligatorio y no ha sido satisfecho
                        this.sharedService.openSnackBar(`No se ha podido recuperar ${this.tituloHijo}`, 1);
                    }



                }
            } else {
                this.elementoSeleccionado = this.elementoSeleccionado === elemento ? null : elemento;
                this.childrenLoaded.subscribe(tabla => {
                    this.enviaNotificacion({ accion: 'configurar', elemento: this.elementoSeleccionado });
                    if (this.recargaEnFrio) this.tablaHija = tabla;
                    this.hijaCargada.emit(this.tablaHija);
                })
            }
        }
    }


    /**
     * Prepara el envío de datos al componente que haya invocado la tabla
     *
     * @param event Información a enviar
     * @param nivel Si procede de una tabla hija
     */
    enviaNotificacion(event: { accion: string, elemento: any }, nivel?: string, isExpansion?: boolean): void {
        const envio: object = Object.assign({}, event);
        envio['raiz'] = nivel ? this.elementoSeleccionado : event.elemento;
        if (nivel) envio[nivel] = event.elemento;
        if (isExpansion) envio[nivel] = event['raiz'];
        /** Si es una tabla de recursión infinita, dejamos el atributo elemento para no perderlo */
        if (!this.herencia) delete envio['elemento'];
        this.notify.emit(envio);
    }

    /**
     * Prepara el envío de datos a la tabla hija
     *
     * @param event Información a enviar
     * @param nivel nivel de anidación
     * @param isExpansion Si es expansión
     * @param elementoPadre elementoPadre del que parte la tabla
     */
    notifyTablaHija(event: { accion: string, elemento: any }, nivel: string, isExpansion: boolean, elementoPadre: any): void {
        if (this.modoCasillas) {
            if (event.accion === 'marcados' || event.accion === 'desmarcados') {
                const evento = { accion: event.accion, raiz: elementoPadre };
                evento[this.nextTabla] = event.elemento;
                this.notify.emit(evento);
                const marcadosHijos: any[] = elementoPadre[this.nextTabla].filter(dato => dato.tSeleccionado === true);
                elementoPadre.tSeleccionado = marcadosHijos.length === elementoPadre[this.nextTabla].length;
                elementoPadre.tIndeterminate = marcadosHijos.length > 0 && elementoPadre.tSeleccionado === false;
            } else {
                const datosAMostrarHijos: any[] = elementoPadre[this.nextTabla] ?? [];
                const marcadosHijos: any[] = datosAMostrarHijos.filter(dato => dato.tSeleccionado === true);
                if (this.elementoSeleccionado) {
                    this.elementoSeleccionado.tSeleccionado = marcadosHijos.length === datosAMostrarHijos.length;
                    this.elementoSeleccionado.tIndeterminate = marcadosHijos.length > 0 && marcadosHijos.length < datosAMostrarHijos.length;
                }
                const marcados: any[] = this.datosAMostrar.filter(dato => dato.tSeleccionado === true);
                this.casillaMaestra.all = marcados.length === this.datosAMostrar.length;
                this.casillaMaestra.indeterminate = !this.casillaMaestra.all ? marcados.length > 0 : false;
                this.enviaNotificacion(event, nivel, isExpansion);
            }
        } else {
            this.enviaNotificacion(event, nivel, isExpansion);
        }

    }

    /**
     * Obtiene la ultima tabla que esté abierta
     *
     * @returns La instancia de la última tabla
     */
    obtenUltimaTabla(): TablaInfinitaComponent | GTTablaComponent {
        if (this.tablaHija) return this.tablaHija
        else if (this.tablaInfinitaHija) return this.tablaInfinitaHija.obtenUltimaTabla();
        else return this;
    }

    /** Recorre todas las casillas buscando los marcados, de ahí filtra los que tienen hijos
     * y si los hijos no tienen todos marcados, cambía el estado a indeterminate
     */
    refrescaCasillas(): void {
        const marcados: any[] = this.datosAMostrar.filter(dato => dato.tSeleccionado === true);
        this.casillaMaestra.all = marcados.length === this.datosAMostrar.length;
        this.casillaMaestra.indeterminate = !this.casillaMaestra.all ? marcados.length > 0 : false;
    }


    /**
     * Recoge la acción de clicado de la casillaMaestra y pone todas al nuevo estado
     *
     * @param event Evento del checkbox
     */
    clickTodasCasillas(event: MatCheckboxChange): void {
        this.datosAMostrar.forEach(dato => {
            if (event.checked !== dato.tSeleccionado) this.clickCasilla(dato, event)
        });
        this.casillaMaestra.all = event.checked;
        this.casillaMaestra.indeterminate = false;

    }
    /**
     * Recoge la acción de clicado de una casilla, asigna el nuevo valor al elemento, y si todas
     * estan marcadas, marca la casilla maestra
     *
     * @param elemento Elemento clicado
     * @param event Evento del checkbox
     */
    clickCasilla(elemento: any, event: MatCheckboxChange): void {
        const accion: string = event.checked ? 'marcado' : 'desmarcado';
        elemento.tSeleccionado = event.checked;
        const marcados: any[] = this.datosAMostrar.filter(dato => dato.tSeleccionado === true);
        this.casillaMaestra.all = marcados.length === this.datosAMostrar.length;
        this.casillaMaestra.indeterminate = !this.casillaMaestra.all ? marcados.length > 0 : false;

        if (!elemento[this.nextTabla]?.length) {
            this.notify.emit({ raiz: elemento, accion });
        } else {
            const agrupacionEventos: any[] = [];
            elemento[this.nextTabla].forEach(dato => {
                // Si ya estaba marcado o desmarcado el hijo, no añado su valor
                if (dato.tSeleccionado !== event.checked) {
                    dato.tSeleccionado = event.checked;
                    agrupacionEventos.push(dato);
                }
            });
            const evento = { accion: accion + 's', raiz: elemento };
            evento[this.nextTabla] = agrupacionEventos;
            const marcadosHijos = elemento[this.nextTabla].filter(dato => dato.tSeleccionado === true);
            elemento.tIndeterminate = marcadosHijos > 0 && marcadosHijos < elemento[this.nextTabla].length;
            this.notify.emit(evento);

            // Si tiene tablaHija actualmente abierta, actualizo su casilla maestra
            const tablaHija = this.tablaHija ?? this.tablaInfinitaHija;
            if (tablaHija) {
                tablaHija.casillaMaestra.all = event.checked;
                tablaHija.casillaMaestra.indeterminate = false;
            }
        }
    }
}
