import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { EstadoTarea } from "../types/tareas";

export const estadosOptions = [
  { label: "Pendiente", value: EstadoTarea.Pendiente },
  { label: "Activo", value: EstadoTarea.Activo },
  { label: "Finalizado", value: EstadoTarea.Finalizado },
  { label: "No se cargó", value: EstadoTarea.NoSeCargo },
];

interface Props {
  value: EstadoTarea;
  onChange: (value: EstadoTarea) => void;
  disabled?: boolean;
}

export default function EstadoSelect({ value, onChange, disabled }: Props) {
  return (
    <FormControl fullWidth>
      <InputLabel>Estado</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(Number(e.target.value) as EstadoTarea)}
        label="Estado"

        disabled={disabled}
      >
        {estadosOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>

    </FormControl>
  );
}