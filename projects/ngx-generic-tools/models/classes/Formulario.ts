import { ValidatorFn, Validators } from '@angular/forms';
import { GTFormElement } from './ElementoFormulario';
import { GTPeticionExpansion } from './PeticionExpansion';

/** List of formats for control types */
export enum GT_TC {
    TEXTO = 'text',
    NUMERO = 'number',
    EURO = 'euro',
    PORCENTAJE = 'percentage',
    ORDEN = 'order',
    CHECKBOX = 'checkbox',
    FECHA = 'date',
    SELECT = 'select',
    SELECTOBJETO = 'objectSelect',
    SELECTBOOLEAN = 'booleanSelect',
    SELECTMAESTRO = 'masterSelect',
    SELECTAUTOCOMPLETADO = 'autocompleteSelect',
    PLANO = 'flat',
    TEXTAREA = 'textArea',
    SLIDER = 'slider',
    IDENTIFICADOR = 'identifier',
    NIE = 'NIE',
    CIF = 'CIF'
}

/** List of formats for control types */
export enum GT_TC_F {
    UPPERCASE = 'uppercase',
    LOWERCASE = 'lowercase',
    NUMBER = 'number',
    EURO = 'euro',
    PERCENTAGE = 'percentage',
    ORDER = 'order',
    SPACE = 'space',
    UPPERCASESPACE = 'uppercaseSpace',
    LOWERCASESPACE = 'lowercaseSpace',
    IDENTIFIER = 'identifier',
    NIF = 'NIF',
    NIE = 'NIE',
    CIF = 'CIF'
}

/** List of possible types for a GTForm */
export enum GT_TF {
    CREATION = 'creation',
    EDITION = 'edition',
    INSPECTION = 'inspection'
}

/** Class used for the management of generic and specific forms, shown later in GTGenericEditorComponent */
export class GTForm {
    /** Element being treated in case the form is of type edition or inspection */
    elemento: any;
    /** List of GTFormElements to work with */
    controles: GTFormElement[] = [];
    /** Original element, used in edition forms to keep track of the original element */
    elementoOriginal: any;
    /** Number of columns the form will have when displayed */
    numeroColumnas: number = 1;
    /** Exclusive option for requirements. Contains the associated table */
    requerir: string;
    /** Primary key of the element */
    idRequerir: string;
    /** Set of requests to execute prior to closing the dialog, ordered according to the form type */
    peticionesAPI?: {
        creacion?: GTPeticionExpansion,
        edicion?: GTPeticionExpansion
    } = {};
    /** If set, deletion will be allowed with the request defined in peticionesAPI for edition */
    permiteBorrado?: boolean = false;
    /** Extra functions to be executed through buttons */
    extraActions: { label: string, function: Function, close: boolean }[] = [];
    constructor(
        public tipo: GT_TF | string,
        public modelo: string[],
        public visual: string[],
        public titulo: string,
        public aceptar?: boolean,
    ) {
        this.modelo = modelo.map(this.sanitizaModelo);
        this.modelo.forEach(atributo => {
            this.addElement(atributo, new GTFormElement(atributo, GT_TC.TEXTO, this.tipo === GT_TF.INSPECTION));
        });
        this.visual.forEach(atributo => atributo = atributo.replace('<br>', ' '));
        this.elemento = {};
    }

    /**
     * Si el modelo que nos han pasado, se usa en tablas, puede ser que tenga anidación compleja y use los puntos
     * Aquí nos lo cargamos para poder usarlo bien
     * @param modelo Modelo a usar
     */
    sanitizaModelo(modelo: string) {
        return modelo.split('.')[0];
    }

    /**
     * REMPLAZA una serie de validaciones a una serie de atributos. IMPORTANTE, REMPLAZA, no agrega
     *
     * @param validaciones Lista de Validators
     * @param atributos Lista de nombres de atributos de los campos
     */
    setValidations(validaciones: ValidatorFn[], atributos?: string[]): void {
        atributos ?
            atributos.forEach(atributo => this.getElement(atributo).control.setValidators(validaciones)) :
            this.modelo.forEach(atributo => this.getElement(atributo).control.setValidators(validaciones))
    }
    /**
     * Agrega la validación Obligatorio a una serie de controles
     *
     * @param atributos Lista de controles
     */
    addRequired(atributos: string[]): void {
        atributos.forEach(atributo => this.getElement(atributo).control.setValidators([Validators.required]));
    }

    /**
     * Recover a element of the form
     *
     * @param elemento Nombre del elemento a recuperar
     */
    getElement(elemento: string): GTFormElement {
        return this.controles[elemento];
    }

    /**
     * Add/Replace an element from the form
     *
     * En caso de que el elemento ya exista, se conserva su configuración de FxFlex previa.
     *
     * @param nombre nombre del control del elemento
     * @param elemento elemento a insertar
     */
    addElement(nombre: string, elemento: GTFormElement): GTFormElement {
        if (this.controles[nombre]) {
            elemento.fxFlex = this.controles[nombre].fxFlex;
        }
        this.controles[nombre] = elemento;
        return elemento;
    }
    /**
     * Inserta un elemento personalizado en el formulario
     *
     * @param nombre nombre del control del elemento
     * @param elemento elemento a insertar
     */
    addElements(nombres: string[], elementos: GTFormElement[]): void {
        let i = 0;
        nombres.forEach(nombre => { this.controles[nombre] = elementos[i]; i++; });
    }

    /**
     * Deshabilita una lista de controles
     *
     * @param atributos Lista de nombre de controles
     */
    disableControls(atributos?: string[]): void {
        atributos = atributos ?? this.modelo;
        atributos.forEach(atributo => {
            this.getElement(atributo).disabled = true;
            this.getElement(atributo).control.disable();
        });
    }

    /**
     * Habilita una lista de controles
     *
     * @param atributos Lista de nombre de controles
     */
    enableControls(atributos: string[]): void {
        atributos.forEach(atributo => {
            this.getElement(atributo).control.enable();
            this.getElement(atributo).disabled = false;
        });
    }

    /**
     * Cambia el tipo de control a una serie de controles
     *
     * @param tipo Tipo al que cambiar. EJ: 'fecha | euro | porcentaje | orden | texto | numero | checkbox | select | selectPro | selectBooleano'
     * @param atributos Lista de nombres de controles
     */
    changeType(tipo: GT_TC | string, atributos: string[]): void {
        if (tipo === GT_TC.EURO || tipo === GT_TC.PORCENTAJE || tipo === GT_TC.ORDEN) {
            atributos.forEach(atributo => {
                const ele: GTFormElement = this.getElement(atributo);
                if (ele) ele.setFormatoNumero(tipo);
            });
        } else {
            atributos.forEach(atributo => { if (this.getElement(atributo)) this.getElement(atributo).tipo = tipo });
        }

    }

    /**
     * Cambia el tipo de formulario que es
     *
     * @param elemento Elemento asociado por si es de edición o inspección
     * @param tipo Tipo de formulario, puede ser creación, edición e inspección
     * @param titulo Titulo a mostrar para el formulario
     */
    changeTypeForm(elemento?: any, tipo?: GT_TF | string, titulo?: string): void {
        if (this.tipo === GT_TF.INSPECTION && tipo !== GT_TF.INSPECTION) {
            for (const value of Object.values(this.controles)) {
                value.disabled = false;
                value.control.enable();
            }
        }
        this.elemento = elemento;
        this.tipo = tipo ? tipo : this.tipo;
        this.titulo = titulo ? titulo : this.titulo;
    }

    /**
     * Cambia las columnas de modelo y visuales para el formulario
     * @param modelo Columnas modelo
     * @param visual Columnas visuales
     */
    changeColumns(modelo: string[], visual: string[]) {
        this.modelo = modelo;
        this.visual = visual;
    }

    /**
     * Para cambiar el formato que pueden tener los campos
     *
     * @param formato Formato a asignar. EJ: 'euro'
     * @param atributos Lista de nombres de controles al que modificarselo
     * @param mask Objeto opcional con parametros especificos de formato (suffix, decimal, thousands...)
     */
    setFormato(formato: GT_TC | string, atributos: string[], mask?: object): void {
        atributos.forEach(atributo => this.getElement(atributo).setFormatoNumero(formato, mask));
    }

    /**
     * Para cambiar el tamaño de los campos, especificandose por número de orden
     *
     * @param fxFlexes Lista de tamaños
     */
    setFxFlexes(fxFlexes: number[]): void {
        for (let i = 0; i < fxFlexes.length; i++) {
            if (this.controles[this.modelo[i]]) this.controles[this.modelo[i]].fxFlex = fxFlexes[i];
        }
    }

    /** Limpia los controles actuales */
    eliminaControles() {
        this.controles = [];
    }

}
