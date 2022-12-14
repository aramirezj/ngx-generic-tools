import { Formulario } from './Formulario';
import { PeticionExpansion } from './PeticionExpansion';
/** Clase utilizada para que un atributo de una fila de una tabla, pueda ser un objeto complejo y se pueda inspeccionar */
export class ObjetoTabla {
    /** Formulario que se le podrá asignar, en caso de no tener, la tabla creará uno base */
    formulario:Formulario;
    constructor(
        /** Nombre del atributo del que sacar el dato que se mostrará en la fila */
        public nombreAMostrar: string,
        /** Nombre del atributo del padre del que sacar los datos */
        public nombreModelo: string,
        /** Nombre que tendrá la columna del padre */
        public nombreVisual: string,
        /** Atributos visuales con los que pintar el formulario */
        public columnasVisuales: string[],
        /** Modelo del elemento resultante */
        public columnasModelo: string[],
        /** Petición API a ejecutar */
        public peticion?: PeticionExpansion
    ) {

    }
}
