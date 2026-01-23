'use client';
import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Paper,
  Typography,
  Button,
  Stack,
  Box,
  Collapse,
} from '@mui/material';
import { useEffect } from 'react';
import { Usuario } from '@/app/types/usuario';
import useUsersStore from '@/app/hooks/useUsersStore';
import UsuarioForm from './agregar/agregarUsuario';
import UsuarioDetalle from './detalle/detalleUsuario';


const EquiposPage = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const { usuarios, fetchUsuarios } = useUsersStore();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
   const didFetchRef = React.useRef(false);

  useEffect(() => {
    if (didFetchRef.current) return;  
    didFetchRef.current = true;      
    fetchUsuarios();                 
  }, [fetchUsuarios]);                             



  const toggleFormulario = () => {
    setMostrarFormulario((prev) => !prev);
  };
  const handleVolver = () => {
    setUsuarioSeleccionado(null);
  };
  const verDetalle = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
  };

  const columns: GridColDef<Usuario>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 120 },
    { field: 'apellido', headerName: 'Apellido', flex: 1, minWidth: 120 },
     { field: 'discriminador', headerName: 'Rol', flex: 1, minWidth: 120 },
    {
      field: 'detalle',
      headerName: 'Detalle',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => verDetalle(params.row)}
        >
          Ver detalle
        </Button>
      ),
    },
  ];

  return (
    <>
      {!usuarioSeleccionado ? (
        <Paper
          elevation={3}
          sx={{
            minHeight: 500,
            maxWidth: {
              xs: '95vw',
              sm: '90vw',
              md: '85vw',
              lg: '70vw',
            },
            mx: 'auto',
            p: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4">Lista de usuarios</Typography>
            <Button variant="contained" onClick={toggleFormulario}>
              {mostrarFormulario ? 'Ocultar formulario' : 'Agregar Funcionario'}
            </Button>
          </Stack>

          <Collapse in={mostrarFormulario}>
            <Paper sx={{ mt: 2, p: 2 }}>
              <UsuarioForm />
            </Paper>
          </Collapse>

          <Box sx={{ flexGrow: 1, mt: 2 }}>
            <DataGrid
              rows={usuarios}
              columns={columns}
              pageSizeOptions={[5, 10]}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              sx={{ border: 0 }}
              getRowId={(row) => row.id!}
            />
          </Box>
        </Paper>
      ) : (
        <UsuarioDetalle usuario={usuarioSeleccionado} onVolver={handleVolver} />
      )}
    </>
  );
};

export default EquiposPage;