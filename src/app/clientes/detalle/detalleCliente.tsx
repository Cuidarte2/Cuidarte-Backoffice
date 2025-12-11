'use client';
import { useEffect, useState } from 'react';
import { Paper, Typography, Button, TextField, Stack, Snackbar, Alert } from '@mui/material';
import ConfirmButton from '@/app/components/confirmButton';
import { Cliente, validarCedula } from '@/app/types/cliente';
import useClientes from '@/app/hooks/useClientes';
import TipoPlanSelect from '@/app/components/tipoPlanSelect';
import useTipoPlan from '@/app/hooks/useTipoPlan';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import useMensualidad from '@/app/hooks/useMensualidad';
import { Mensualidad, MensualidadEstado } from '@/app/types/suscripcion';
import { DataGrid, GridColDef, GridValueGetter } from '@mui/x-data-grid';

interface Props {
  cliente: Cliente;
  onVolver: () => void;

}

export default function ClienteDetalle({ cliente, onVolver }: Props) {
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({ ...cliente });
  const { update, remove, error } = useClientes();
  const [apiError, setApiError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { pagarMensualidad, fetchMensualidad } = useMensualidad();
  const { tiposPlanes, fetchTipoPlan } = useTipoPlan();
  const [mensualidades, setMensualidades] = useState<Mensualidad[] | null>(null);
  const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === "ci") {
      if (!validarCedula(value)) {
        setApiError("Cédula inválida");
      } else {
        setApiError("");
      }
    }

  };

  useEffect(() => {
    if (error) {
      setApiError(typeof error === 'string' ? error : 'Ocurrió un error inesperado');
      setOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (tiposPlanes.length === 0) {
      fetchTipoPlan();
    }
  }, [tiposPlanes.length, fetchTipoPlan]);
  useEffect(() => {
    const fetchData = async () => {
      if (cliente.suscripcion?.id) {
        const result = await fetchMensualidad(cliente.suscripcion.id as number);
        if (result != undefined) setMensualidades(result);
      }
    };
    fetchData();
  }, [cliente.suscripcion?.id, fetchMensualidad]);

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

  const onPagarMensualidad = (id: number) => {
    pagarMensualidad(id);
  };

  const columns: GridColDef<Mensualidad>[] = [
    {
      field: 'precio',
      headerName: 'Monto',
      width: 150,
      renderCell: () => {
        return <span>{tiposPlanes.find((tipo) => tipo.id === cliente.tipoPlanId)?.precio ?? '—'}</span>;
      }
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 120,
      valueGetter: (params: Parameters<GridValueGetter>[0]) =>
        MensualidadEstado[params] ?? 'Desconocido'
    },
  ];
  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

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
        <TextField
          label="Cedula de identidad"
          value={formData.ci}
          onChange={handleChange('ci')}
          fullWidth
          disabled={!editando}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DatePicker
            label="Fecha de nacimiento"
            value={formData.fechaNacimiento ? new Date(formData.fechaNacimiento) : null}
            onChange={(newValue) => {
              setFormData((prev) => ({ ...prev, fechaNacimiento: newValue ?? null }));
            }}
            format="yyyy-MM-dd"
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
          label="Celular"
          type="text"
          value={formData.celular ?? ''}
          onChange={handleChange('celular')}
          fullWidth
          disabled={!editando}
        />
        <TextField
          label="Responsable de pago"
          type="text"
          value={formData.responsablePago ?? ''}
          onChange={handleChange('responsablePago')}
          fullWidth
          disabled={!editando}
        />
        <TextField
          label="Forma de pago"
          type="text"
          value={formData.formaPago ?? ''}
          onChange={handleChange('formaPago')}
          fullWidth
          disabled={!editando}
        />
        <TextField
          label="Observaciones"
          type="text"
          value={formData.observaciones ?? ''}
          onChange={handleChange('observaciones')}
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
        {mensualidades && mensualidades.length > 0 && (
          <DataGrid
            rows={mensualidades}
            columns={columns}
            getRowId={row => row.id}
            hideFooter
            autoHeight
            sx={{ border: 0 }}
          />
        )}
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
        <ConfirmButton

          onConfirm={() => onPagarMensualidad(cliente.suscripcion?.id as number)}
          confirmText="¿Pagar mensualidad?"
          buttonProps={{ variant: "outlined", disabled: editando }}
        >
          Pagar mensualidad
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