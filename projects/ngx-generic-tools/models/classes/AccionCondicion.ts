
/** Tipo de condiciones posible */
export enum GTTipoCondicion {
    BOOLEAN = 'boolean',
    EQUAL = 'equal',
    DIFFERENT = 'different',
}

/** Lógica de condiciones posible */
export enum GTLogicaCondicion {
    REQUIRED = 'required',
    MISSING = 'missing'
}


export class GTAccionCondicion {
    /** Resultado final de una condición en concreto.  */
    resultado: boolean;
    constructor(
        /** Atributo que se evaluará  */
        public atributo: string,
        /** Tipo de condición que se está evaluando, puede ser boolean, equal, y different */
        public tipoCondicion: GTTipoCondicion | string,
        /** Logica de la condición, si el tipo es boolean, será required o missing, y si es equal o different, será a lo que tiene que ser igual o diferente */
        public logica: GTLogicaCondicion | string
    ) {
    }
}
