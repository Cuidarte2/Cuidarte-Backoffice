// utils/decodeJwt.ts
import { jwtDecode } from "jwt-decode";

interface MyTokenPayload {
  email: string;
  observaciones: string;
  departamento: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  nombre?: string;
  apellido?: string;
  nombreEmpresa?: string;
  rut?: string;
  nombreContacto?: string;
}

export function decodeToken(token: string): MyTokenPayload {
  return jwtDecode<MyTokenPayload>(token);  
}
