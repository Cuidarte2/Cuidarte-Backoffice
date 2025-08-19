'use client';
import { useState } from 'react';
import { Paper, Typography, Button, TextField, Stack } from '@mui/material';
import ConfirmButton from '@/app/components/confirmButton';
import { Usuario } from '@/app/types/usuario';
import useUsersStore from '@/app/hooks/useUsersStore';


interface Props {
  usuario: Usuario;
  onVolver: () => void;

}


export default function UsuarioDetalle({ usuario, onVolver }: Props) {
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({ ...usuario });
  const { update, remove } = useUsersStore();
  const [errors, setErrors] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };
  const handleGuardar = () => {
    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.;,!]).{6,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const newErrors = {
      email: emailRegex.test(formData.email || "") ? "" : "Email inválido.",
      password: regexPass.test(formData.password || "")
        ? ""
        : "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un signo (. ; , !).",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e !== "");
    if (hasErrors) return;

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
        Detalle de usuario
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
          label="Email"
          type="email"
          value={formData.email ?? ''}
          onChange={handleChange('email')}
          fullWidth
          disabled={!editando}
          error={!!errors.email}
          helperText={errors.email}

        />
        <TextField
          label="Contraseña"
          type="password"
          value={formData.password ?? ''}
          onChange={handleChange('password')}
          fullWidth
          disabled={!editando}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Discriminador"
          type="text"
          value={formData.discriminador ?? ''}
          onChange={handleChange('discriminador')}
          fullWidth
          disabled={true}
          error={!!errors.email}
          helperText={errors.email}
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

          onConfirm={() => onEliminar(usuario.id as number)}
          confirmText="¿Eliminar este usuario?"
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
                setFormData({ ...usuario });
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