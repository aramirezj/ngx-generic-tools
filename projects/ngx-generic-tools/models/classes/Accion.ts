import { BehaviorSubject } from 'rxjs';
import { GTAccionCondicion } from './AccionCondicion';

/** Clase utilizada por las tablas para mostrar los iconos de las acciones y gestionar los eventos */
export class GTAccion {
    /** Catálogo de acciones predefinidas con su descripción e icono */
    static catalogo: object =
        {
            eliminar: { descripcion: 'Eliminar elemento', icono: 'clear' },
            eliminarT: { descripcion: 'Eliminar elemento', icono: 'clear' },
            eliminarSC: { descripcion: 'Eliminar elemento', icono: 'clear' },
            configurar: { descripcion: 'Configurar elemento', icono: 'storage' },
            editar: { descripcion: 'Editar elemento', icono: 'edit' },
            editarT: { descripcion: 'Editar elemento', icono: 'edit' },
            addGestion: { descripcion: 'Añadir gestión', icono: 'add' },
            editIJ: { descripcion: 'Configurar Instrumento Jurídico', icono: 'settings' },
            ver: { descripcion: 'Inspeccionar elemento', icono: 'remove_red_eye' },
            listado: { descripcion: 'Abrir listado', icono: 'remove_red_eye' },
            subir: { descripcion: 'Subir elemento', icono: 'keyboard_arrow_up', },
            bajar: { descripcion: 'Bajar elemento', icono: 'keyboard_arrow_down' },
            buscar: { descripcion: 'Buscar elemento', icono: 'search' },
            addPerson: { descripcion: 'Añadir interesado', icono: 'person_add_alt_1' },
            searchPerson: { descripcion: 'Consultar interesados', icono: 'person_search' },
            addLocation: { descripcion: 'Gestionar ámbitos', icono: 'add_location_alt' },
            presentar: { descripcion: 'Presentar la solicitud', icono: 'grading' },
            guardar: { descripcion: 'Guardar', icono: 'save' },
            guardarSolicitud: { descripcion: 'Guardar solicitud', icono: 'save' },
            continuar: { descripcion: 'Continuar', icono: 'keyboard_arrow_right' },
            volver: { descripcion: 'Volver', icono: 'keyboard_arrow_left' },
            cancelar: { descripcion: 'Cancelar', icono: 'clear' },
            salir: { descripcion: 'Salir', icono: 'clear' },
            diagrama: { descripcion: 'Visualizar Procedimiento', icono: 'account_tree' },
            inspeccionar: { descripcion: 'Inspeccionar', icono: 'search' },
            configAdicional: { descripcion: 'Configuración adicional', icono: 'extension' },
            accederSolicitud: { descripcion: 'Acceder a la solicitud', icono: 'assignment' },
            salirBotonera: { descripcion: 'Salir', icono: 'exit_to_app' },
            addCentro: { descripcion: 'Añadir centro', icono: 'home_work' },
            addAccionFormativa: { descripcion: 'Añadir acción formativa', icono: 'add' },
            editOcupaciones: { descripcion: 'Editar ocupaciones de la especialidad', icono: 'menu_book' },
            verCamposSubsanables: { descripcion: 'Ver listado de campos requeridos', icono: 'menu_book' },
            mostrarRepresentantes: { descripcion: 'Mostrar los datos del representante', icono: 'account_circle' },
            infoComunicacion: { descripcion: 'Medios de comunicación administrativa', icono: 'phone' },
            infoContacto: { descripcion: 'Muestra la información de contacto', icono: 'contact_mail' },
            infoDireccion: { descripcion: 'Muestra la dirección', icono: 'domain' },
            validaDoc: { descripcion: 'Validar la documentación', icono: 'thumb_up_alt' },
            invalidaDoc: { descripcion: 'Invalidar la documentación', icono: 'thumb_down_alt' },
            noNecesario: { descripcion: 'Documentos no necesarios', icono: 'disabled_by_default' },
            rehacer: { descripcion: 'Rehacer', icono: 'repeat' },
            crearDeclaracion: { descripcion: 'Crear declaracion', icono: 'add' },
            crearComposicion: { descripcion: 'Añadir subreport', icono: 'add' },
            borrarComposicion: { descripcion: 'Eliminar subreport', icono: 'clear' },
            crearSubcriterio: { descripcion: 'Añadir subcriterio', icono: 'add' },
            solicitar: { descripcion: 'Solicitar de nuevo', icono: 'restore_page' },
            empaquetar: { descripcion: 'Empaquetar', icono: 'inventory' },
            editarDescripcion: { descripcion: 'Editar descripción', icono: 'edit' },
            aulas: { descripcion: 'Muestra las aulas', icono: 'meeting_room' },
            certificaciones: { descripcion: 'Certificaciones de Calidad', icono: 'military_tech' },
            dotaciones: { descripcion: 'Dotaciones', icono: 'phonelink' },
            desmarcarPrincipal: { descripcion: 'Ya es el representante principal', icono: 'star' },
            marcarPrincipal: { descripcion: 'Marcar representante como principal', icono: 'star_border' },
            cambioTitular: { descripcion: 'Cambiar entidad titular', icono: 'manage_accounts' },
            calcular: { descripcion: 'Realizar cálculo automático', icono: 'calculate' },
            editarDocumento: { descripcion: 'Editar documento', icono: 'attach_file' },
            editarFormulario: { descripcion: 'Editar formulario', icono: 'edit' },
            imprimir: { descripcion: 'Obtener impreso', icono: 'print' },
            eliminarVacio: { descripcion: 'Eliminar elemento', icono: 'clear' },
            huecoVacio: { descripcion: '', icono: '' },
            gestionarLogotipo: { descripcion: 'Gestionar logotipo', icono: 'picture_in_picture' },
            asignarEjecucionAutomatica: { descripcion: 'Asignar ejecución automática', icono: 'alarm' },
            resumenEspecialidad: { descripcion: 'Resumen de la especialidad', icono: 'menu_book' },
        };
    /** Observer para que se suscriba el componente AccionTabla */
    observerCondiciones: BehaviorSubject<any>;
    /** Condiciones que puede tener una GTAccion */
    condiciones: GTAccionCondicion[];
    /** En el caso de tener una accion sustituta, cuando la lógica se cumpla, se sustituirá la acción */
    accionSustituta?: GTAccion;
    constructor(
        public funcion: string,
        public descripcion?: string,
        public icono?: string,
        public disabled?: boolean

    ) {
        this.descripcion = GTAccion.catalogo[this.funcion].descripcion;
        this.icono = GTAccion.catalogo[this.funcion].icono;
        this.disabled = disabled ?? false;
    }
    /**
     * Agrega una serie de condiciones a una serie de acciones, instanciando su BehaviourSubject para luego poder suscribirse
     *
     * @param condiciones Condiciones a asociar
     * @param acciones Acciones a recibir condiciones
     */
    static agregaCondicionesAAcciones(condiciones: GTAccionCondicion[], acciones: GTAccion[]): void {
        condiciones.forEach(condicion => {
            const behaviour = new BehaviorSubject(0);
            acciones.forEach(accion => {
                accion.observerCondiciones = accion.observerCondiciones ? accion.observerCondiciones : behaviour;
                accion.condiciones = accion.condiciones ? accion.condiciones : [];
                accion.condiciones.push(condicion);
            });
        });
    }

    /**
    * Función que convierte las acciones al modelado para obtener sus atributos
    *
    * @param acciones
    * @returns Listado de acciones
    */
    static parseAcciones(acciones: string[]): GTAccion[] {
        if (acciones) {
            const parsedAcciones: GTAccion[] = [];
            for (const accion of acciones) {
                const accionParsed = new GTAccion(accion);
                parsedAcciones.push(accionParsed);
            }
            return parsedAcciones;
        } else {
            return [];
        }
    }


}
