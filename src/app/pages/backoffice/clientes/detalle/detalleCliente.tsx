'use client';
import { useEffect, useState } from 'react';
import { Paper, Typography, Button, TextField, Stack } from '@mui/material';
import ConfirmButton from '@/app/components/confirmButton';
import { Cliente } from '@/app/types/cliente';
import useClientes from '@/app/hooks/useClientes';
import TipoPlanSelect from '@/app/components/tipoPlanSelect';
import useTipoPlan from '@/app/hooks/useTipoPlan';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';


interface Props {
  cliente: Cliente;
  onVolver: () => void;

}


export default function ClienteDetalle({ cliente, onVolver }: Props) {
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({ ...cliente });
  const { update, remove } = useClientes();
  const { tiposPlanes, fetchTipoPlan } = useTipoPlan();
  const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleFechaChange = (value: Date | null) => {
    if (!value) return;

    const fechaLocal = new Date(value.getTime() + value.getTimezoneOffset() * 60000);

    setFormData((prev) => ({
      ...prev,
      fechaNacimiento: fechaLocal,
    }));
  };



  useEffect(() => {
    if (tiposPlanes.length === 0) {
      fetchTipoPlan();
    }
  }, [tiposPlanes.length,fetchTipoPlan]);



  useEffect(() => {
    if (!formData.tipoPlan && formData.tipoPlanId && tiposPlanes.length) {
      const plan = tiposPlanes.find(p => p.id === formData.tipoPlanId);
      if (plan) {
        setFormData((prev) => ({ ...prev, tipoPlan: plan }));
      }
    }
  }, [formData.tipoPlan, formData.tipoPlanId, tiposPlanes]);

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
      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" color="primary" onClick={onVolver}>
          Volver
        </Button>
      </Stack>

      <Typography variant="h4" gutterBottom>
        Detalle de cliente
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
          label="Apellido"
          type="text"
          value={formData.apellido ?? ''}
          onChange={handleChange('apellido')}
          fullWidth
          disabled={!editando}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DatePicker
            label="Fecha de nacimiento"
            value={formData.fechaNacimiento}
            onChange={handleFechaChange}
            slotProps={{ textField: { fullWidth: true } }}
            disabled={!editando}
          />

        </LocalizationProvider>
        <TextField
          label="Dirección"
          type="text"
          value={formData.direccion ?? ''}
          onChange={handleChange('direccion')}
          fullWidth
          disabled={!editando}
        />
        <TextField
          label="Teléfono"
          type="text"
          value={formData.telefono ?? ''}
          onChange={handleChange('telefono')}
          fullWidth
          disabled={!editando}
        />
             <TextField
          label="Email"
          type="text"
          value={formData.email ?? ''}
          onChange={handleChange('email')}
          fullWidth
          disabled={!editando}
        />
        {formData.tipoPlanId && tiposPlanes.length ? (
          <TipoPlanSelect
            value={formData.tipoPlanId}
            onChange={(plan) => {
              setFormData({
                ...formData,
                tipoPlan: plan,
                tipoPlanId: plan.id ?? 0
              });
            }}
            disabled={!editando}
          />
        ) : (
          <Typography variant="body2" color="textSecondary">
            Cargando plan del cliente...
          </Typography>
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

          onConfirm={() => onEliminar(cliente.id as number)}
          confirmText="¿Eliminar este cliente?"
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
                setFormData({ ...cliente });
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