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
import useTipoServicio from '@/app/hooks/useTipoServicio';
import { TipoServicio } from '@/app/types/tipoPlan';
import TipoServicioForm from './agregar/agregarTipoServicio';
import TipoServicioDetalle from './detalle/detalleTiposServicio';

const TipoServicioPage = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const { tiposServicios, fetchTipoServicios: fetch } = useTipoServicio();
  const [tipoServicioSeleccionado, setTipoServicioSeleccionado] = useState<TipoServicio | null>(null);

  useEffect(() => {
    fetch();
  }, [fetch]);


  const toggleFormulario = () => {
    setMostrarFormulario((prev) => !prev);
  };

  const verDetalle = (ts: TipoServicio) => {
    setTipoServicioSeleccionado(ts);
  };
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 120 },
    {
      field: 'precioHora',
      headerName: 'Precio por hora',
      width: 140,
      valueGetter: (params) =>
        params !== undefined && params !== null
          ? `$${params}`
          : '—',
    },
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
      {!tipoServicioSeleccionado ? (
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
            <Typography variant="h4">Lista de tipos de servicios</Typography>
            <Button variant="contained" onClick={toggleFormulario}>
              {mostrarFormulario ? 'Ocultar formulario' : 'Agregar tipo de servicio'}
            </Button>
          </Stack>

          <Collapse in={mostrarFormulario}>
            <Paper sx={{ mt: 2, p: 2 }}>
              <TipoServicioForm />
            </Paper>
          </Collapse>

          <Box sx={{ flexGrow: 1, mt: 2 }}>
            <DataGrid
              rows={tiposServicios}
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
        <TipoServicioDetalle
          ts={tipoServicioSeleccionado}
          onVolver={() => setTipoServicioSeleccionado(null)}
        />

      )}
    </>
  );
};

export default TipoServicioPage;