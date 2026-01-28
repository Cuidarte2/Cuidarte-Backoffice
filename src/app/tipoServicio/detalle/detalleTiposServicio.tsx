'use client';
import { useEffect, useState } from 'react';
import { Paper, Typography, Button, TextField, Stack, Snackbar, Alert } from '@mui/material';
import { TipoServicio } from '@/app/types/tipoPlan';
import useTipoServicio from '@/app/hooks/useTipoServicio';
import ConfirmButton from '@/app/components/confirmButton';

interface Props {
  ts: TipoServicio;
  onVolver: () => void;

}

export default function TipoServicioDetalle({ ts, onVolver }: Props) {
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({ ...ts });
  const { update, remove, error } = useTipoServicio();
  const [apiError, setApiError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
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

  const handleGuardar = () => {
    update(formData);
    setEditando(false);
  };

  const onEliminar = (id: number) => {
    remove(id);
    onVolver();
  }

  return (
    <Paper sx={{ width: '100%', height: '100vh', p: 4 }} elevation={3}>
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
        Detalle de tipo de servicio
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
          label="precio"
          type="number"
          value={formData.precioHora ?? ''}
          onChange={handleChange('precioHora')}
          fullWidth
          disabled={!editando}
        />
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
          confirmText="¿Eliminar este tipo de servicio?"
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
