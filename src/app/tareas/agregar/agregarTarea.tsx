'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, Snackbar, Typography, Stack } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import useTareas from '@/app/hooks/useTareas';
import { es } from 'date-fns/locale';
import ClienteSelect from '@/app/components/clienteSelect';
import FuncionarioSelect from '@/app/components/funcionarioSelect';
import TipoServicioSelect from '@/app/components/tipoServicioSelect';
import { Tarea } from '@/app/types/tareas';
import { GridDeleteIcon } from '@mui/x-data-grid';
import { Servicio } from '@/app/types/tipoPlan';

export default function TareaForm() {
  const { addTarea } = useTareas();
  const [apiError, setApiError] = useState<string | null>(null);
  const [form, setForm] = useState<Tarea>({
    clienteId: 0,
    responsableId: 0,
    fecha: new Date,
    descripcion: "",
    servicios: [],
  });

  const [errors, setErrors] = useState({
    clienteId: "",
    responsableId: "",
    fecha: "",
    descripcion: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      clienteId: form.clienteId ? "" : "El cliente es requerido.",
      responsableId: form.responsableId ? "" : "El responsable es requerido.",
      fecha: form.fecha ? "" : "La fecha es requerida.",
      descripcion: form.descripcion ? "" : "La descripción es requerida.",
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e);
    if (!hasErrors) {
      try {
        await addTarea(form);
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
          Crear tarea
        </Typography>
        <ClienteSelect
        value={form.clienteId ?? null}
        onChange={(c) => {
        setForm({ ...form, clienteId: c?.id ?? 0 });
        }}
        disabled={false}
/>

        <FuncionarioSelect
          value={form.responsableId ?? 0}
          onChange={(f) => setForm({ ...form, responsableId: f.id ?? 0 })}
        />
        <DatePicker
          label="Fecha"
          name="fecha"
          value={form.fecha}
          slotProps={{
            textField: {
              error: !!errors.fecha,
              helperText: errors.fecha,
              fullWidth: true,
            },
          }}
        />

        <TextField
          label="Descripción"
          name="descripcion"
          multiline
          rows={4}
          value={form.descripcion}
          onChange={handleChange}
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
                <GridDeleteIcon />
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
        <Button type="submit" variant="contained">Guardar Tarea</Button>
      </Box>
    </LocalizationProvider>
  );
}