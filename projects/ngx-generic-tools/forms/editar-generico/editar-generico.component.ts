import { Component, OnInit, ChangeDetectorRef, Inject, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GTFormulario, GTElementoFormulario, GTTC, GTTF,GTTC_F, GTPeticionExpansion } from 'ngx-generic-tools/models';
import { Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

/** Componente encargado de mostrar el modelo GTFormulario en un modal */
@Component({
    selector: 'gt-editar-generico',
    templateUrl: './editar-generico.component.html',
    styleUrls: ['./editar-generico.component.scss']
})
export class GTEditarGenericoComponent implements OnInit, AfterViewChecked {
    GTTC_F:typeof GTTC_F = GTTC_F;
    /** Evento de click de borrado  */
    @Output() eventoBorrado = new EventEmitter<string>();
    /** Elemento a modificar */
    dato: any;
    /** Modelo que se estaba mostrando del elemento a modificar */
    modeloDato: string[];
    /** Columnas visuales del dato que se estaba mostrando */
    visualDato: string[];
    /** Titulo del formulario a mostrar */
    titulo: string;
    /** Configura el formulario para que sea de solo lectura o editable */
    soloLectura: boolean;
    /** Si debe aparecer el botón borrar */
    borrar: boolean = false;
    /** Si debe aparecer el botón aceptar */
    aceptar: boolean;
    /** GTFormulario del componente */
    tableForm: FormGroup;
    /** Instancia del modelo formulario a cargar */
    formulario: GTFormulario;
    /** Flex que asignarle a los elementos del formulario, es dinamico según el número de columnas inpuesto por el formulario */
    fxFlex: number = 100;
    /** Fecha máxima para los campos fechas para evitar 5 digitos en años */
    maxDate: Date = new Date(9999, 12, 31);
    constructor(
        private dialogRef: DialogRef<GTEditarGenericoComponent>,
        private cdRef: ChangeDetectorRef,
        @Inject(DIALOG_DATA) data,
        private snackBar: MatSnackBar,
        public dialog: Dialog
    ) {
        if (data) {
            this.formulario = data;
            this.modeloDato = this.formulario.modelo;
            this.visualDato = this.formulario.visual;
            this.dato = this.formulario.tipo === GTTF.CREACION ? {} : this.formulario.elemento;
            this.titulo = this.formulario.titulo;
            this.soloLectura = this.formulario.tipo === GTTF.INSPECCION;
            this.aceptar = this.formulario.aceptar;
            this.borrar = this.formulario.permiteBorrado && this.formulario.tipo === GTTF.EDICION;
        }
    }

    ngOnInit(): void {
        if (this.compruebaEnums()) {
            this.calculaFlex();
            this.creaFormulario();
            this.titulo = this.titulo ? this.titulo : 'Creación / Edición del elemento';
        }
    }

    ngAfterViewChecked(): void {
        this.cdRef.detectChanges();
    }


    /** Comprueba que los controles del formulario tienen bien los enums
     *
     * @returns Si está todo correcto
     */
    compruebaEnums(): boolean {
        let campoErroneo: string;
        for (const modelo of this.formulario.modelo) {
            let ele = this.formulario.getElemento(modelo);
            if (!ele) {
                ele = this.formulario.addElemento(modelo, new GTElementoFormulario(modelo));
            }
            const tipo: GTTC = ele.tipo as GTTC;
            if (!Object.values(GTTC).includes(tipo)) {
                campoErroneo = modelo;
            }
        }
        if (campoErroneo) this.snackBar.open(`Error en construcción de formulario: ${campoErroneo} tiene mal el tipado`, 'Cerrar', { duration: 3000, panelClass: 'customSnackbar' });
        else return true;
    }


    /** Detecta los campos que debe crear */
    creaFormulario(): void {
        this.tableForm = new FormGroup({});
        switch (this.formulario.tipo) {
            case GTTF.EDICION:
            case GTTF.INSPECCION:
                this.formulario.elementoOriginal = Object.assign({}, this.formulario.elemento);
                for (const atributo of this.modeloDato) {
                    const eleFormulario: GTElementoFormulario = this.formulario.getElemento(atributo);
                    this.tableForm.addControl(atributo, eleFormulario.control);
                    this.tableForm.get(atributo).setValue(this.formulario.elemento[atributo]);
                    this.tableForm.get(atributo).enable();
                    if (eleFormulario.tipo === GTTC.CHECKBOX) this.tableForm.get(atributo).setValue(this.formulario.elemento[atributo] === true ? true : null);
                    if (eleFormulario.disabled || this.formulario.tipo === GTTF.INSPECCION) this.tableForm.get(atributo).disable();
                }
                break;
            case GTTF.CREACION:
                for (const atributo of this.modeloDato) {
                    const eleFormulario: GTElementoFormulario = this.formulario.getElemento(atributo);
                    this.tableForm.addControl(atributo, eleFormulario.control);
                    this.tableForm.get(atributo).enable();
                    this.tableForm.get(atributo).setValue(this.formulario.getElemento(atributo).control.value);
                    if (eleFormulario.disabled) this.tableForm.get(atributo).disable();
                }
                break;
        }
    }


    /** Función para cerrar el modal enviando el resultado de la edición */
    save(): void {
        this.tableForm.markAllAsTouched();
        this.tableForm.markAsDirty();
        if (this.tableForm.valid) {
            for (const atributo of this.modeloDato) {
                switch (this.formulario.getElemento(atributo).tipo) {
                    case GTTC.FECHA:
                        this.dato[atributo] = this.tableForm.get(atributo).value !== null ? this.dateFormatBackend(this.tableForm.get(atributo).value) : null;
                        break;
                    case GTTC.SELECTBOOLEAN:
                    case GTTC.CHECKBOX:
                        this.dato[atributo] = this.tableForm.get(atributo).value === true;
                        break;
                    default:
                        this.dato[atributo] = this.tableForm.get(atributo).value !== '' ? this.tableForm.get(atributo).value : null;
                        break;
                }
            }
            if (this.formulario.peticionesAPI[this.formulario.tipo]) {
                this.ejecutaAPI();
            } else {
                this.close(this.dato);
            }

        } else {
            this.snackBar.open('Los campos contienen errores', 'Cerrar', { duration: 3000, panelClass: 'customSnackbar' });
        }

    }


    /** Función para cerrar el modal cancelando la edición */
    close(element?: any): void {
        if (this.tableForm) this.tableForm.reset();
        this.dialogRef.close(element ? element : false);
    }


    /**
     * Formatea una fecha al formato correspondiente
     *
     * @param date Fecha a formatear
     * @returns Fecha formateada
     */
    dateFormatBackend(date: any): string {
        return formatDate(date, 'yyyy-MM-dd', 'es-es');
    }

    /** Función para ejecutar la API asignada al formulario */
    ejecutaAPI(borrado?: boolean): void {

        const peticionAPI: GTPeticionExpansion = this.formulario.peticionesAPI[borrado ? 'borrado' : this.formulario.tipo];

        const params: any[] = peticionAPI.preparaParametros(this.dato);
        // Si la petición tiene asignado parametros extras predefinidos, se setean al this.dato para prepararlo en caso de ser un param
        peticionAPI.peticion(...params).subscribe(
            {
                next: (response) => {
                    this.dato = borrado ? 'BORRADO' : response;
                    this.tableForm.reset();
                    this.dialogRef.close(this.dato);
                },
                error: () => {
                    if (this.formulario.tipo === GTTF.EDICION) {
                        this.rollbackElement();
                    }
                }
            }
        )
    }

    /** Setea un flex dependiendo del número de columnas inpuesto por el GTFormulario */
    calculaFlex(): void {
        switch (this.formulario.numeroColumnas) {
            case 2:
                this.fxFlex = 50;
                break;
            case 3:
                this.fxFlex = 33;
                break;
            case 4:
                this.fxFlex = 25;
                break;
            case 5:
                this.fxFlex = 20;
                break;
            default:
                this.fxFlex = 100;
                break;
        }
    }

    /** En caso de error durante una petición PUT, hace rollback al elemento sobre el elementoOriginal para que por fuera
     * no se reflejen los cambios de una petición que realmente ha sido erronea
     */
    rollbackElement(): void {
        for (const key of Object.keys(this.dato)) {
            this.dato[key] = this.formulario.elementoOriginal[key];
        }
    }

    /**
     * Realiza una acción extra asignada
     * @param extraAction Acción a ejecutar y su función
     */
    doExtraAction(extraAction: { label: string, function: Function, close: boolean }) {
        extraAction.function();
        if (extraAction.close) {
            this.dialogRef.close();
        }
    }


}
