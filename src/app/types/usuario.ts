export interface Usuario {
  id?: number;
  email?: string;
  nombre?: string;
  apellido?: string;
  password?: string;
  discriminador?: Rol;
  token?: string;
}
export interface UsuarioApi {
  id: number;
  email: {
    value: string;
  };
  nombreCompleto: {
    nombre: string;
    apellido: string;
  };
  password: {
    value: string;
  };
  eliminado: boolean;
  discriminador?: Rol;
}

export const transformarUsuario = (raw: UsuarioApi): Usuario => ({
  id: raw.id,
  email: raw.email?.value,
  nombre: raw.nombreCompleto?.nombre,
  apellido: raw.nombreCompleto?.apellido,
  password: "",
  discriminador: raw.discriminador, 
});


export enum Rol {
  Administrador = "Administrador",
  Funcionario = "Funcionario"
}
