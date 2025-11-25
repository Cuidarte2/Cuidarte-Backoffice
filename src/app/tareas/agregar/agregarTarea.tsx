'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, Snackbar, Typography, Stack, Chip } from '@mui/material';
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
import useClientes from '@/app/hooks/useClientes';
import useTipoServicio from '@/app/hooks/useTipoServicio';

export default function TareaForm() {
  const { addTarea } = useTareas();
  const { cliente } = useClientes();
    const { tiposServicios } = useTipoServicio();
  const [apiError, setApiError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const aplicarConsumoServicios = (serviciosSolicitados: Servicio[]) => {
    if (!cliente || !serviciosSolicitados) return;

    let nuevoTotal = 0;
    const clienteServicios = cliente.serviciosDisponibles.map(s => ({...s}));
    serviciosSolicitados.forEach((solicitado) => {
      if (solicitado.cantServicios <= 0 || !solicitado.tipoServicio) return;
      const precio = solicitado.tipoServicio.precioHora ?? 0;
      const disponible = clienteServicios.find(
        (s) => s.tipoServicio.id === solicitado.tipoServicio.id
      );
      if (!disponible || disponible.cantServicios === 0) {
        nuevoTotal += solicitado.cantServicios * precio;
        return;
      }
      if (disponible.cantServicios >= solicitado.cantServicios) {
        disponible.cantServicios -= solicitado.cantServicios;
      } else {
        const cubierto = disponible.cantServicios;
        const excedente = solicitado.cantServicios - cubierto;
        disponible.cantServicios = 0;
        nuevoTotal += excedente * precio;
      }
    });

    setTotal(nuevoTotal);
  };

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
                  const tipo = tiposServicios.find(ts => ts.id === id);
                  updated[index].tipoServicio = tipo ?? { id, precioHora: 0 };
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
                  aplicarConsumoServicios(updated);

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
                tipoServicio: { id: 0, precioHora: 0 },
              } satisfies Servicio
            ];
            setForm({ ...form, servicios: nuevos });
          }}
        >

          + Agregar servicio
        </Button>
        {total > 0 && (
  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
    <Chip
      label={`Total extra: ${total.toLocaleString('es-UY', { style: 'currency', currency: 'UYU' })}`}
      color="success"
      variant="outlined"
      sx={{ fontWeight: 'bold', fontSize: '1rem', px: 2 }}
    />
  </Box>
)}


        <Button type="submit" variant="contained">Guardar Tarea</Button>
      </Box>
    </LocalizationProvider>
  );
}