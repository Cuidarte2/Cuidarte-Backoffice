'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, Snackbar, Typography } from '@mui/material';
import RolUsuarioSelect from '@/app/components/rolUsuarioSelect';
import { Rol } from '@/app/types/usuario';
import useUsersStore from '@/app/hooks/useUsersStore';

export default function UsuarioForm() {
  const { addUsuario } = useUsersStore();
  const [apiError, setApiError] = useState<string | null>(null);
  const [form, setForm] = useState<{
    nombre: string;
    apellido: string;
    email: string,
    password: string;
    discriminador: Rol;
  }>({
    nombre: '',
    apellido: '',
    email: "",
    password: '',
    discriminador: Rol.Funcionario,
  });


  const [errors, setErrors] = useState<{
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    discriminador: string;
  }>({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    discriminador: "",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.;,!]).{6,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {
      nombre: form.nombre ? "" : "El nombre es requerido.",
      apellido: form.apellido ? "" : "El apellido es requerido.",
      email: emailRegex.test(form.email || "") ? "" : "Email inválido.",
      password: regexPass.test(form.password || "")
        ? ""
        : "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un signo (. ; , !).",
      discriminador: form.discriminador ? "" : "El tipo de usuario es requerido."
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e);
    if (!hasErrors) {
      try {
        await addUsuario(form);
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
        Registrar funcionario
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
        type='email'
        value={form.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        label="Contraseña"
        name="password"
        variant="standard"
        type='password'
        value={form.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
      />
      <RolUsuarioSelect
        value={form.discriminador ?? Rol.Funcionario}
        onChange={(discriminador) => setForm({ ...form, discriminador })}
      />
      <Button type="submit" variant="contained">Crear Usuario</Button>
    </Box>
  );
}