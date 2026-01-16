export interface TipoPlan {
    id?: number;
    nombre?: string;
    servicios?: Servicio[]
    precio?: number;
    precioConDescuento?: number;
    destino? : PlanDestino;
}

export interface Servicio {
    id?: number;
    tipoServicio: TipoServicio;
    cantServicios: number;
    
}



export interface TipoServicio {
    id?: number;
    nombre?: string;
    precioHora?: number;
    
}

	export enum PlanDestino
	{
		Cliente = 0,
		Empresa = 1,
	}


    export const destinoMap: Record<string, PlanDestino> = {
      Cliente: PlanDestino.Cliente,
      Empresa: PlanDestino.Empresa,   
    };
    