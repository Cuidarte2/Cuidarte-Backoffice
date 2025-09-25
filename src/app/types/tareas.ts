import { Cliente } from "./cliente";
import { Servicio } from "./tipoPlan";
import { Usuario } from "./usuario";

export interface Tarea {
  id?: number;
  clienteId?: number;
  cliente?: Cliente;
  responsable?: Usuario;
  responsableId?: number;
  fecha?: Date;
  estado?: EstadoTarea;
  descripcion?: string;
  servicios?: Servicio[];
  serviciosUsados?: Servicio[];
  serviciosExtra?: Servicio[];
  costo?: number;
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
