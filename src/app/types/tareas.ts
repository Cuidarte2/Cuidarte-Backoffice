import { ApiCliente, Cliente } from "./cliente";
import { Servicio } from "./tipoPlan";
import { Usuario, UsuarioApi } from "./usuario";

export interface Tarea {
  id?: number;
  clienteId?: number;
  cliente?: Cliente;
  empleadoResponsable?: Usuario;
  responsableId?: number;
  fecha?: Date;
  estado?: EstadoTarea;
  descripcion?: string;
  servicios?: Servicio[];
  serviciosUsados?: Servicio[];
  serviciosExtras?: Servicio[];
  costoTotal?: number;
}

export interface ApiTarea {
  id: number;
  cliente: ApiCliente;
  empleadoResponsable: UsuarioApi;
  fecha: Date;
  estado: string;
  descripcion: string;
  eliminado: boolean;
  serviciosUsados?: Servicio[];
  serviciosExtras?: Servicio[];
  costoTotal?: number;
}

export enum EstadoTarea {
  Pendiente = 0,
  Activo = 1,
  Finalizado = 2,
  NoSeCargo = 3,
}

export const estadoMap: Record<string, EstadoTarea> = {
  Pendiente: EstadoTarea.Pendiente,
  Activo: EstadoTarea.Activo,
  Finalizado: EstadoTarea.Finalizado,
  NoSeCargo: EstadoTarea.NoSeCargo,
};

export function mapTareaToFormData(t: Tarea): Tarea {
  const estadoParsed =
    typeof t.estado === "string"
      ? estadoMap[t.estado] ?? EstadoTarea.NoSeCargo
      : typeof t.estado === "number"
      ? t.estado
      : EstadoTarea.NoSeCargo;

  return {
    id: t.id,
    cliente: t.cliente ?? undefined,
    clienteId: t.cliente?.id ?? 0,

    empleadoResponsable: t.empleadoResponsable ?? undefined,
    responsableId: t.empleadoResponsable?.id ?? 0,

    estado: estadoParsed,
    fecha: t.fecha ? new Date(t.fecha) : undefined,
    descripcion: t.descripcion?.trim() ?? "",
    serviciosUsados: t.serviciosUsados,
    serviciosExtras: t.serviciosExtras,
    costoTotal: t.costoTotal,
  };
}
