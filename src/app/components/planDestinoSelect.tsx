import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { PlanDestino } from "../types/tipoPlan";

export const destinosOptions = [
  { label: "Cliente", value: PlanDestino.Cliente },
  { label: "Empresa", value: PlanDestino.Empresa },

];

interface Props {
  value: PlanDestino;
  onChange: (value: PlanDestino) => void;
  disabled?: boolean;
}

export default function PlanDestinoSelect({ value, onChange, disabled }: Props) {
  return (
    <FormControl fullWidth>
      <InputLabel>Plan Destino</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(Number(e.target.value) as PlanDestino)}
        label="Destino"

        disabled={disabled}
      >
        {destinosOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>

    </FormControl>
  );
}