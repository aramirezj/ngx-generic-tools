import { FormControl } from "@angular/forms";
import { GTPeticionExpansion } from "./PeticionExpansion";

/** Clase utilizada para mostrar un select pro que haga asignación de elemento*/
export class GTSelectMaestroTabla {
    /** Petición expansión a ejecutar cada vez se cambie a un nuevo valor */
    peticionCambio: GTPeticionExpansion;
    constructor(
        /** Nombre del atributo del elemento al que asignarle el resultado de la selección */
        public columnaModelo: string,
        /** Nombre que tendrá la columna de la tabla */
        public columnaVisual: string,
        /** Nombre del atributo del elemento resultante de la petición para mostrar */
        public label: string,
        /** Nombre del modelo del elemento resultante de la petición para asignarselo al elemento de la tabla según la columnaModelo */
        public value: string,
        /** Petición del que el selectPro sacará los datos */
        public peticion: GTPeticionExpansion,
        /** Control asociado */
        public control?: FormControl,
        /** Si lo tiene, ejecutará la api del selector cogiendo del elemento de la fila, el atributo indicado */
        public atributosFila?: string[],
        /** Lista de atributos adicionales predeterminados para la lista de argumentos de la llamada */
        public extraPath?: object,
        /** Para indicar si el select debe autoseleccionar el primer valor si no encuentra ninguno */
        public precargaUnico: boolean = false
    ) {
    }
}
