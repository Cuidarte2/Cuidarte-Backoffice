import { useEffect } from "react";
import useTipoPlan from "../hooks/useTipoPlan";
import { TipoPlan } from "../types/tipoPlan";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface Props {
  value: number;
  onChange: (plan: TipoPlan) => void;
  disabled?: boolean;
}


export default function TipoPlanSelect({ value, onChange, disabled }: Props) {
  const { tiposPlanes, fetchTipoPlan } = useTipoPlan();
useEffect(() => {
  if (!tiposPlanes.length) {
    fetchTipoPlan();
  }
}, [tiposPlanes.length, fetchTipoPlan]);

  return (
    <FormControl fullWidth>
      <InputLabel>Tipo de plan</InputLabel>
      <Select
        value={value}
        label="Tipo de plan"
        onChange={(e) => {
          const id = Number(e.target.value);
          const plan = tiposPlanes.find(p => p.id === id);
          if (plan) onChange(plan);
        }}
        disabled={disabled || !tiposPlanes.length}
      >
        {!tiposPlanes.length ? (
          <MenuItem disabled>Cargando planes...</MenuItem>
        ) : (
          tiposPlanes.map((tipo) => (
            <MenuItem key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}
