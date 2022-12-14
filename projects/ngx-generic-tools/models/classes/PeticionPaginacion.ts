import { GTCriterioOrdenacion } from "../interfaces/CriterioOrdenacion";
import { GTPagina } from "../interfaces/Pagina";


/** Clase utilizada para la paginación asincrona en las tablas */
export class GTPeticionPaginacion {
    /** Parametros que pueda necesitar la query de paginación */
    params: any[];
    /** Configuración de orden */
    orden?: GTCriterioOrdenacion
    constructor(
        /** Función inyectada de un servicio para obtener datos */
        public peticion: Function,
        /** Configuración de la paginación a ejecutar */
        public paginacion?: GTPagina,
        /** Parametro para indicar si una vez que se hayan filtrado o paginado elementos nuevos, ha de llamar al componente padre */
        public funcionalidadExterna?: boolean
    ) {
        this.params = [];
        this.paginacion = this.paginacion ? this.paginacion : { numeroRegistrosPagina: 5, numeroRegistrosTotal: 0, numeroPaginasTotal: 0, numeroPagina: 0 } as GTPagina
    }
}
