export interface Usuario {
  id?: number;
  email?: string;
  nombre?: string;
  apellido?: string;
  password?: string;
  discriminador?: Rol;
  token?: string;
}

export enum Rol {
  Administrador = "Administrador",
  Funcionario = "Funcionario"
}
