import { TipoPlan } from "./tipoPlan";

export interface Empresa {
  id: number;
  nombre?: string;
  telefonoContacto?:string
  TipoPlanId?: number;
  Plan?: TipoPlan;
}