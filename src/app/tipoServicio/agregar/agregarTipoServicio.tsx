'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, Snackbar, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import useTipoServicio from '@/app/hooks/useTipoServicio';

export default function TipoServicioForm() {
  const { add } = useTipoServicio();
  const [apiError, setApiError] = useState<string | null>(null);
  const [form, setForm] = useState({
    nombre: '',
    precioHora: 0,
  });

  const [errors, setErrors] = useState({
    nombre: '',
    precioHora: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "precioHora" ? Number(value) : value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      nombre: form.nombre ? "" : "El nombre es requerido.",
      precioHora: form.precioHora > 0 ? "" : "El precio por hora debe ser mayor a 0."
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
          Crear tipo de servicio
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
          label="Precio por hora"
          name="precioHora"
          variant="standard"
          value={form.precioHora}
          onChange={handleChange}
          fullWidth
          error={!!errors.precioHora}
          helperText={errors.precioHora}
        />
        <Button type="submit" variant="contained">Guardar Cliente</Button>
      </Box>
    </LocalizationProvider>
  );
}