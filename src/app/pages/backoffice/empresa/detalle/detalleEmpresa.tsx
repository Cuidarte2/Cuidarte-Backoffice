'use client';
import { useEffect, useState } from 'react';
import { Paper, Typography, Button, TextField, Stack } from '@mui/material';
import ConfirmButton from '@/app/components/confirmButton';
import TipoPlanSelect from '@/app/components/tipoPlanSelect';
import useTipoPlan from '@/app/hooks/useTipoPlan';
import { Empresa } from '@/app/types/empresa';
import useEmpresas from '@/app/hooks/useEmpresas';


interface Props {
  empresa: Empresa;
  onVolver: () => void;

}


export default function EmpresaDetalle({ empresa, onVolver }: Props) {
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({ ...empresa });
  const { update, remove } = useEmpresas();
  const { tiposPlanes, fetchTipoPlan } = useTipoPlan();
  const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  useEffect(() => {
    if (tiposPlanes.length === 0) {
      fetchTipoPlan();
    }
  }, [tiposPlanes.length,fetchTipoPlan]);


  useEffect(() => {
    if (!formData.Plan && formData.Plan && tiposPlanes.length) {
      const plan = tiposPlanes.find(p => p.id === formData.Plan);
      if (plan) {
        setFormData((prev) => ({ ...prev, tipoPlan: plan }));
      }
    }
  }, [formData.Plan, formData.TipoPlanId, tiposPlanes]);

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
        {formData.TipoPlanId && tiposPlanes.length ? (
          <TipoPlanSelect
            value={formData.TipoPlanId}
            onChange={(plan) => {
              setFormData({
                ...formData,
                Plan: plan,
                TipoPlanId: plan.id ?? 0
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

          onConfirm={() => onEliminar(empresa.id as number)}
          confirmText="¿Eliminar esta empresa?"
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