import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Rol } from "../types/usuario";

interface Props {
    value: Rol
    onChange: (rol: Rol) => void;
    disabled?: boolean;
}


export default function RolUsuarioSelect({ onChange, disabled, value }: Props) {
    const roles = Object.values(Rol);
    return (
        <FormControl fullWidth>
            <InputLabel>Rol usuario</InputLabel>
            <Select
                value={value}
                   label="Rol usuario"
                onChange={(e) => onChange(e.target.value as Rol)}
                  disabled={disabled || !roles.length}
            >
                {Object.values(Rol).map((rol) => (
                    <MenuItem key={rol} value={rol}>
                        {rol}
                    </MenuItem>
                ))}
            </Select>

        </FormControl>
    );
}
