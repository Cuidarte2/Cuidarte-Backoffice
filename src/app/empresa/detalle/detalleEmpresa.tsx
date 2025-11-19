'use client';
import { useEffect, useState } from 'react';
import { Paper, Typography, Button, TextField, Stack, Snackbar, Alert } from '@mui/material';
import ConfirmButton from '@/app/components/confirmButton';
import TipoPlanSelect from '@/app/components/tipoPlanSelect';
import useTipoPlan from '@/app/hooks/useTipoPlan';
import { Empresa } from '@/app/types/empresa';
import useEmpresas from '@/app/hooks/useEmpresas';
import useMensualidad from '@/app/hooks/useMensualidad';
import { DataGrid, GridColDef, GridValueGetter } from '@mui/x-data-grid';
import { Mensualidad, MensualidadEstado } from '@/app/types/suscripcion';


interface Props {
  empresa: Empresa;
  onVolver: () => void;

}


export default function EmpresaDetalle({ empresa, onVolver }: Props) {
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({ ...empresa });
  const { update, remove, error } = useEmpresas();
    const [apiError, setApiError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { pagarMensualidad } = useMensualidad();
  const { tiposPlanes, fetchTipoPlan } = useTipoPlan();
  const { fetchMensualidad } = useMensualidad();
  const [mensualidades, setMensualidades] = useState<Mensualidad[] | null>(null);
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
    if (tiposPlanes.length === 0) {
      fetchTipoPlan();
    }
  }, [tiposPlanes.length,fetchTipoPlan]);

    const onPagarMensualidad = (id: number) => {
     pagarMensualidad(id);
  };

 useEffect(() => {
    const fetchData = async () => {
      if (empresa.suscripcion?.id) {
        const result = await fetchMensualidad(empresa.suscripcion.id as number);
        if (result != undefined) setMensualidades(result);
      }
    };
    fetchData();
  }, [empresa.suscripcion?.id, fetchMensualidad]);


  useEffect(() => {
    if (!formData.Plan && formData.Plan && tiposPlanes.length) {
      const plan = tiposPlanes.find(p => p.id === formData.Plan);
      if (plan) {
        setFormData((prev) => ({ ...prev, tipoPlan: plan }));
      }
    }
  }, [formData.Plan, formData.tipoPlanId, tiposPlanes]);

  const handleGuardar = () => {
    update(formData);
    setEditando(false);
  };

  const onEliminar = (id: number) => {
    remove(id);
    onVolver();
  }
  const columns: GridColDef<Mensualidad>[] = [
      {
        field: 'periodoDesde',
        headerName: 'Periodo desde',
        width: 150,
        valueGetter: (params: Parameters<GridValueGetter>[0]) =>
          params ? new Date(params as string | number | Date).toLocaleDateString() : ''
      },
      {
        field: 'periodoHasta',
        headerName: 'Periodo hasta',
        width: 150,
        valueGetter: (params: Parameters<GridValueGetter>[0]) =>
          params ? new Date(params as string | number | Date).toLocaleDateString() : ''
      },
         {
      field: 'precio',
      headerName: 'Monto',
      width: 150,
      renderCell: () => {
        return <span>{tiposPlanes.find((tipo) => tipo.id === empresa.tipoPlanId)?.precio ?? '—'}</span>;
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
        Detalle de empresa
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
          label="Teléfono"
          type="text"
          value={formData.telefonoContacto ?? ''}
          onChange={handleChange('telefonoContacto')}
          fullWidth
          disabled={!editando}
        />
        {formData.tipoPlanId && tiposPlanes.length ? (
          <TipoPlanSelect
            value={formData.tipoPlanId}
            onChange={(plan) => {
              setFormData({
                ...formData,
                Plan: plan,
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

          onConfirm={() => onEliminar(empresa.id as number)}
          confirmText="¿Eliminar esta empresa?"
          buttonProps={{ variant: "outlined", color: "error", disabled: editando }}
        >
          Eliminar
        </ConfirmButton>
          <ConfirmButton
                  onConfirm={() => onPagarMensualidad(empresa.suscripcion?.id as number)}
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
                setFormData({ ...empresa });
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