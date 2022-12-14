
/** Tipo de condiciones posible */
export enum TipoCondicion {
    BOOLEAN = 'boolean',
    EQUAL = 'equal',
    DIFFERENT = 'different',
}

/** Lógica de condiciones posible */
export enum LogicaCondicion {
    REQUIRED = 'required',
    MISSING = 'missing'
}


export class AccionCondicion {
    /** Resultado final de una condición en concreto.  */
    resultado: boolean;
    constructor(
        /** Atributo que se evaluará  */
        public atributo: string,
        /** Tipo de condición que se está evaluando, puede ser boolean, equal, y different */
        public tipoCondicion: TipoCondicion | string,
        /** Logica de la condición, si el tipo es boolean, será required o missing, y si es equal o different, será a lo que tiene que ser igual o diferente */
        public logica: LogicaCondicion | string
    ) {
    }
}
