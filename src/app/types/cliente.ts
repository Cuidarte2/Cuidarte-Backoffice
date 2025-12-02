import { Suscripcion } from "./suscripcion";
import { Servicio, TipoPlan } from "./tipoPlan";

export interface Cliente {
  id: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  fechaNacimiento?: Date | null;
  direccion?: string;
  telefono: string;
  celular?: string;
  tipoPlanId: number;
  tipoPlan?: TipoPlan;
  ci: string;
  responsablePago: string;
  formaPago: string;
  observaciones: string;
  suscripcion?: Suscripcion;
  serviciosDisponibles?: Servicio[];
}


export function validarCedula(ci: string): boolean {
  const limpia = ci.replace(/\D/g, "").padStart(8, "0");
  if (!/^\d{8}$/.test(limpia)) return false;

  const coeficientes = [2, 9, 8, 7, 6, 3, 4];
  const suma = coeficientes.reduce(
    (acc, coef, i) => acc + parseInt(limpia[i]) * coef,
    0
  );

  const digitoCalculado = (10 - (suma % 10)) % 10;
  const digitoReal = parseInt(limpia[7]);
  return digitoCalculado === digitoReal;
}
