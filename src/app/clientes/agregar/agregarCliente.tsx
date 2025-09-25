'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, Snackbar, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import useClientes from '@/app/hooks/useClientes';
import TipoPlanSelect from '@/app/components/tipoPlanSelect';
import { validarCedula } from '@/app/types/cliente';

export default function ClienteForm() {
  const { addCliente } = useClientes();

  const [apiError, setApiError] = useState<string | null>(null);
  const [form, setForm] = useState<{
    id: number
    nombre: string;
    apellido: string;
    email: string;
    fechaNacimiento: Date | null;
    direccion: string;
    telefono: string;
    tipoPlanId: number;
    ci: string;
  }>({
    id: 0,
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: null,
    direccion: '',
    telefono: '',
    tipoPlanId: 0,
    ci: '',
  });


  const [errors, setErrors] = useState({
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: "",
    direccion: '',
    telefono: '',
    tipoPlanId: '',
    ci: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "TipoPlan" || name === "tipoPlan" ? Number(value) : value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFechaChange = (fecha: Date | null) => {
    setForm((prev) => ({
      ...prev,
      fechaNacimiento: fecha,
    }));
    setErrors((prev) => ({
      ...prev,
      fechaNacimiento: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {
      nombre: form.nombre ? "" : "El nombre es requerido.",
      apellido: form.apellido ? "" : "El apellido es requerido.",
      email: emailRegex.test(form.email || "") ? "" : "Email inválido.",
      fechaNacimiento: form.fechaNacimiento instanceof Date ? "" : "La fecha es requerida.",
      direccion: form.direccion ? "" : "La dirección es requerida.",
      telefono: form.telefono ? "" : "El teléfono es requerido.",
      tipoPlanId: form.tipoPlanId ? "" : "El tipo de plan es requerido.",
      ci:
        !form.ci
          ? "La CI es requerida."
          : !validarCedula(form.ci)
            ? "La CI no es válida."
            : "",
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((e) => e);
    if (!hasErrors) {
      try {
        await addCliente(form);
        setApiError(null);

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
          Registrar cliente
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
          label="Apellido"
          name="apellido"
          variant="standard"
          value={form.apellido}
          onChange={handleChange}
          fullWidth
          error={!!errors.apellido}
          helperText={errors.apellido}
        />
         <TextField
          label="Email"
          name="email"
          variant="standard"
          value={form.email}
          onChange={handleChange}
          fullWidth
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="CI"
          name="ci"
          variant="standard"
          value={form.ci}
          onChange={handleChange}
          fullWidth
          error={!!errors.ci}
          helperText={errors.ci}
        />
        <TextField
          label="Dirección"
          name="direccion"
          variant="standard"
          rows={4}
          value={form.direccion}
          onChange={handleChange}
          error={!!errors.direccion}
          helperText={errors.direccion}
        />
        <TextField
          label="Telefono"
          name="telefono"
          variant="standard"
          value={form.telefono}
          onChange={handleChange}
          error={!!errors.telefono}
          helperText={errors.telefono}
        />
        <DatePicker
          label="Fecha de nacimiento"
          value={form.fechaNacimiento}
          onChange={handleFechaChange}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <TipoPlanSelect
          value={form.tipoPlanId ?? 0}
          onChange={(plan) => setForm({ ...form, tipoPlanId: plan.id ?? 0 })}
        />
        <Button type="submit" variant="contained">Guardar Cliente</Button>
      </Box>
    </LocalizationProvider>
  );
}