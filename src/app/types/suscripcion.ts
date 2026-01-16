import { Cliente } from "./cliente";
import { Usuario } from "./usuario";

export interface Suscripcion {
  id?: number;
  clienteId?: number;
  cliente?: Cliente;
  responsable?: Usuario;
  responsableId?: number;
  fechaInicioMensualidad?: Date;
  fechaFinMensualidad?: Date;
  descripcion?: string;
}

export interface Mensualidad {
id: number;
subscriptionId: number;
subscription?: Suscripcion;
fechaGeneracion: Date;
periodoDesde: Date;
periodoHasta: Date;
estado: MensualidadEstado;
precioProximaMensualidad?: number;
}
export enum MensualidadEstado {
	Pagada,     
	Fallida,    
	Cancelada
}