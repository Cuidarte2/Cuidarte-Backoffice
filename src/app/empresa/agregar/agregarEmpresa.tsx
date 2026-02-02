'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, Snackbar, Typography } from '@mui/material';
import TipoPlanSelect from '@/app/components/tipoPlanSelect';
import useEmpresas from '@/app/hooks/useEmpresas';

export default function EmpresaForm() {
  const { addEmpresa } = useEmpresas();

  const [apiError, setApiError] = useState<string | null>(null);
  const [form, setForm] = useState<{
    id: number
    nombre: string;
    telefonoContacto: string;
    tipoPlanId: number;
  }>({
    id: 0,
    nombre: '',
    telefonoContacto: '',
    tipoPlanId: 0,
  });


  const [errors, setErrors] = useState({
    nombre: '',
    telefonoContacto: '',
    tipoPlanId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "TipoPlan" || name === "tipoPlan" ? Number(value) : value,
    });
    setErrors({ ...errors, [name]: "" });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      nombre: form.nombre ? "" : "El nombre es requerido.",
      telefonoContacto: form.telefonoContacto ? "" : "El teléfono es requerido.",
      tipoPlanId: form.tipoPlanId ? "" : "El tipo de plan es requerido.",
    }
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((e) => e);
    if (!hasErrors) {
      try {
        await addEmpresa(form);
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
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {apiError && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={!!apiError}
          message={apiError}
          autoHideDuration={6000}
          onClose={() => setApiError(null)}
        />
      )}
        <Typography variant="h5" className="mb-6 text-center">
          Registrar empresa
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
          label="Telefono contacto"
          name="telefonoContacto"
          variant="standard"
          value={form.telefonoContacto}
          onChange={handleChange}
          error={!!errors.telefonoContacto}
          helperText={errors.telefonoContacto}
        />
        <TipoPlanSelect
          value={form.tipoPlanId ?? 0}
          onChange={(plan) => setForm({ ...form, tipoPlanId: plan.id ?? 0 })}
        />
        <Button type="submit" variant="contained">Guardar Empresa</Button>
      </Box>
  );
}