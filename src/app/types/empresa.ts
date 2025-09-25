import { Suscripcion } from "./suscripcion";
import { TipoPlan } from "./tipoPlan";

export interface Empresa {
  id: number;
  nombre?: string;
  telefonoContacto?:string
  tipoPlanId?: number;
  suscripcion?: Suscripcion;
  Plan?: TipoPlan;
}