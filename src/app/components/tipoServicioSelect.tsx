import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useEffect } from "react";
import useTipoServicio from "@/app/hooks/useTipoServicio";

interface Props {
    value: number;
    onChange: (id: number) => void;
}

export default function TipoServicioSelect({ value, onChange }: Props) {
    const { tiposServicios, fetchTipoServicios: fetch } = useTipoServicio();

    useEffect(() => {
        if (tiposServicios.length === 0) fetch();
    }, [fetch, tiposServicios.length]);


    return (
        <FormControl fullWidth>
            <InputLabel>Tipo de servicio</InputLabel>
            <Select
                value={value}
                label="Tipo de servicio"
                onChange={(e) => onChange(Number(e.target.value))}
            >
                {tiposServicios.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}