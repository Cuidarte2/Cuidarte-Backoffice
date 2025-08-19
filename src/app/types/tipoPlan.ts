export interface TipoPlan {
    id?: number;
    nombre?: string;
    servicios?: Servicio[]
}

export interface Servicio {
    id?: number;
    tipoServicio?: TipoServicio;
    cantServicios: number;
    
}



export interface TipoServicio {
    id?: number;
    nombre?: string;
    precioHora?: number;
    
}