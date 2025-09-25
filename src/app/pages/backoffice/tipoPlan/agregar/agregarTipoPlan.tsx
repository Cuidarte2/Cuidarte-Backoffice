'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, Snackbar, Typography, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import useTipoPlan from '@/app/hooks/useTipoPlan';
import { Servicio, TipoPlan } from '@/app/types/tipoPlan';
import TipoServicioSelect from '@/app/components/tipoServicioSelect';

export default function TipoPlanForm() {
  const { add } = useTipoPlan();
  const [apiError, setApiError] = useState<string | null>(null);
  const [form, setForm] = useState<TipoPlan>({
    nombre: '',
    precio: 0,
    servicios: [],
  });

  const [errors, setErrors] = useState({
    nombre: '',
    precio: '',
  });
  type FormField = keyof typeof form;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name as FormField;
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      nombre: form.nombre ? "" : "El nombre es requerido.",
      precio: form.precio ? "" : "El precio es requerido.",
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((e) => e);
    if (!hasErrors) {
      try {
        await add(form);
        setApiError(null);
        window.dispatchEvent(new Event("auth-change"));
      } catch (error) {
        const errorData = error as { statusCode?: number; message?: string };
        if (errorData.statusCode === 500)
          setApiError("Error del servidor. Intente más tarde.");
        else if (errorData.statusCode === 409)
          setApiError(
            errorData.message ||
            "Datos inválidos. Por favor, revise los campos."
          );
        else if (errorData.statusCode === 400)
          setApiError("Datos inválidos. Por favor, revise los campos.");
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      {apiError && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={!!apiError}
          message={apiError}
          autoHideDuration={6000}
          onClose={() => setApiError(null)}
        />
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" className="mb-6 text-center">
          Crear tipo de plan
        </Typography>
        <TextField
          label="Nombre"
          name="nombre"
          variant="standard"
          value={form.nombre}
          onChange={handleChange}
          fullWidth
          error={!!errors.nombre}
          helperText={errors.nombre}
        />
         <TextField
          label="Precio"
          name="precio"
          variant="standard"
          value={form.precio}
          onChange={handleChange}
          fullWidth
          error={!!errors.precio}
          helperText={errors.precio}
        />
        {form.servicios?.map((s, index) => (
          <Box key={index} sx={{ border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
            <Stack direction="row" spacing={2}>
              <TipoServicioSelect
                value={s.tipoServicio?.id ?? 0}
                onChange={(id) => {
                  const updated = [...form.servicios || []];
                  updated[index].tipoServicio = { id };
                  setForm({ ...form, servicios: updated });
                }}
              />
              <TextField
                label="Cantidad"
                type="number"
                value={s.cantServicios}
                onChange={(e) => {
                  const updated = [...form.servicios || []];
                  updated[index].cantServicios = Number(e.target.value);
                  setForm({ ...form, servicios: updated });
                }}
                sx={{ mt: 2 }}
              />
              <Button
                onClick={() => {
                  const updated = form.servicios?.filter((_, i) => i !== index) ?? [];
                  setForm({ ...form, servicios: updated });
                }}
                color="error"
                sx={{ mt: 2 }}
              >
                <DeleteIcon />
              </Button>
            </Stack>
          </Box>
        ))}
        <Button
          variant="outlined"
          onClick={() => {
            const nuevos = [
              ...(form.servicios ?? []),
              {
                id: 0,
                cantServicios: 0,
                tipoServicio: { id: 0 }, 
              } satisfies Servicio
            ];
            setForm({ ...form, servicios: nuevos });
          }}
        >

          + Agregar servicio
        </Button>

        <Button type="submit" variant="contained">Guardar Plan</Button>
      </Box>
    </LocalizationProvider>
  );
}