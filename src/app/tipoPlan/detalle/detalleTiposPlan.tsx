'use client';
import { useEffect, useState } from 'react';
import { Paper, Typography, Button, TextField, Stack, Snackbar, Alert } from '@mui/material';
import useTipoPlan from '@/app/hooks/useTipoPlan';
import ConfirmButton from '@/app/components/confirmButton';
import { destinoMap, PlanDestino, TipoPlan } from '@/app/types/tipoPlan';
import TipoServicioSelect from '@/app/components/tipoServicioSelect';
import useTipoServicio from '@/app/hooks/useTipoServicio';
import PlanDestinoSelect from '@/app/components/planDestinoSelect';

interface Props {
  ts: TipoPlan;
  onVolver: () => void;

}


export default function TipoPlanDetalle({ ts, onVolver }: Props) {
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({ ...ts });
  const { update, remove, error } = useTipoPlan();
  const [apiError, setApiError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { tiposServicios, fetchTipoServicios: fetch } = useTipoServicio();
  const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  useEffect(() => {
    if (error) {
      setApiError(typeof error === 'string' ? error : 'Ocurrió un error inesperado');
      setOpen(true);

    }
  }, [error]);


  useEffect(() => {
    if (tiposServicios.length === 0) {
      fetch();
    }
  }, [tiposServicios.length, fetch]);


  const handleGuardar = () => {
    update(formData);
    setEditando(false);
  };

  const onEliminar = (id: number) => {
    remove(id);
    onVolver();
  }

  return (
    <Paper sx={{ width: '100%', minHeight: '100vh', p: 4 }} elevation={3}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {apiError}
        </Alert>
      </Snackbar>
      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" color="primary" onClick={onVolver}>
          Volver
        </Button>
      </Stack>

      <Typography variant="h4" gutterBottom>
        Detalle de tipo de plan
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Nombre"
          value={formData.nombre}
          onChange={handleChange('nombre')}
          fullWidth
          disabled={!editando}
        />
        <TextField
          label="Precio"
          value={formData.precio}
          onChange={handleChange('precio')}
          fullWidth
          disabled={!editando}
        />
        <PlanDestinoSelect
          value={
                    typeof formData.destino === "string"
                      ? destinoMap[formData.destino] ?? PlanDestino.Cliente
                      : formData.destino ?? PlanDestino.Cliente
                  }
                  onChange={(e) => setFormData({ ...formData, destino: e })}
                  disabled={!editando}
        />
        <Typography variant="h6" mt={4}>Servicios asociados</Typography>
        {editando ? (
          <>
            <Typography variant="h6">Servicios del plan</Typography>
            {formData.servicios?.map((s, index) => (
              <Stack key={index} direction="row" spacing={2}>
                <TipoServicioSelect
                  value={s.tipoServicio?.id || 0}
                  onChange={(id: number) => {
                    const serviciosActualizados = [...formData.servicios || []];
                    const tipoSeleccionado = tiposServicios.find(ts => ts.id === id);
                    if (serviciosActualizados[index].tipoServicio) {
                      serviciosActualizados[index].tipoServicio.id = id;
                      serviciosActualizados[index].tipoServicio = tipoSeleccionado ?? {
                        id,
                        nombre: '',
                        precioHora: 0
                      };

                    }

                    setFormData({ ...formData, servicios: serviciosActualizados });
                  }}
                />
                <TextField
                  label="Cantidad"
                  type="number"
                  value={s.cantServicios ?? 1}
                  onChange={(e) => {
                    const valor = Math.max(1, Number(e.target.value));
                    const serviciosActualizados = [...formData.servicios || []];
                    serviciosActualizados[index].cantServicios = valor;
                    setFormData({ ...formData, servicios: serviciosActualizados });
                  }}
                  error={s.cantServicios < 1}
                  helperText={s.cantServicios < 1 ? "Debe ser al menos 1" : ""}

                  sx={{ width: 120 }}
                />

                <Button color="error" onClick={() => {
                  const serviciosActualizados = formData.servicios?.filter((_, i) => i !== index) ?? [];
                  setFormData({ ...formData, servicios: serviciosActualizados });
                }}>
                  Quitar
                </Button>
              </Stack>
            ))}

            <Button variant="outlined" onClick={() => {
              const nuevoServicio = {
                id: 0,
                cantServicios: 0,
                tipoServicio: { id: 0, nombre: '', precioHora: 0 }
              };

              setFormData({
                ...formData,
                servicios: [...(formData.servicios ?? []), nuevoServicio]
              });


            }}>
              + Agregar servicio
            </Button>

          </>
        ) : (
          <>
            <Stack spacing={2}>
              {formData.servicios?.length === 0 && (
                <Typography color="text.secondary">Este plan no tiene servicios asociados.</Typography>
              )}

              {formData.servicios?.map((servicio, index) => (
                <Paper key={index} sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                  <Typography><strong>ID tipo servicio:</strong> {servicio.tipoServicio?.id}</Typography>
                  <Typography>
                    Nombre del servicio: {
                      tiposServicios.find(ts => ts.id === servicio.tipoServicio?.id)?.nombre ?? 'Sin nombre'
                    }
                  </Typography>
                  <Typography>
                    Cantidad: {servicio.cantServicios}
                  </Typography>

                  <Typography><strong>Precio:</strong>  ${tiposServicios.find(ts => ts.id === servicio.tipoServicio?.id)?.precioHora ?? 0}</Typography>
                </Paper>
              ))}
            </Stack>
          </>
        )}


        <TextField
          label="ID"
          value={formData.id}
          fullWidth
          disabled
        />
      </Stack>
      <Stack direction="row" spacing={2} mt={4}>
        {!editando && (
          <Button
            variant="contained"
            color="warning"
            onClick={() => setEditando(true)}
          >
            Editar
          </Button>
        )}

        <ConfirmButton

          onConfirm={() => onEliminar(ts.id as number)}
          confirmText="¿Eliminar este tipo de plan?"
          buttonProps={{ variant: "outlined", color: "error", disabled: editando }}
        >
          Eliminar
        </ConfirmButton>

        {editando && (
          <>
            <ConfirmButton
              onConfirm={() => handleGuardar()}
              confirmText="¿Aplicar los cambios realizados?"
              buttonProps={{ variant: "contained", color: "success" }}
            >
              Guardar cambios
            </ConfirmButton>


            <Button
              variant="outlined"
              onClick={() => {
                setFormData({ ...ts });
                setEditando(false);
              }}
            >
              Cancelar
            </Button>
          </>
        )}
      </Stack>

    </Paper>
  );
}
