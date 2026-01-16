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
import { TipoPlan} from '@/app/types/tipoPlan';
import TipoServicioForm from './agregar/agregarTipoPlan';
import useTipoPlan from '@/app/hooks/useTipoPlan';
import TipoPlanDetalle from './detalle/detalleTiposPlan';

const TipoPlanPage = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const { tiposPlanes, fetchTipoPlan } = useTipoPlan();
  const [tipoPlanSeleccionado, setTipoPlanSeleccionado] = useState<TipoPlan | null>(null);

  useEffect(() => {
    fetchTipoPlan();
  }, [fetchTipoPlan]);


  const toggleFormulario = () => {
    setMostrarFormulario((prev) => !prev);
  };

  const verDetalle = (tp: TipoPlan) => {
    setTipoPlanSeleccionado(tp);
  };
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 120 },
    { field: 'precio', headerName: 'precio', flex: 1, minWidth: 120 },
    { field: 'precioConDescuento', headerName: 'precio con descuento', flex: 1, minWidth: 120 },
    {
        field: 'Destino',
        headerName: 'Destino',
        width: 100,
        renderCell: (params: { row: TipoPlan }) => {
          return (
            <span>
              {params.row.destino
                ? `${params.row.destino ?? ''}` || '—'
                : '—'}
            </span>
          );
   
        }
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
      {!tipoPlanSeleccionado ? (
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
            <Typography variant="h4">Lista de tipos de planes</Typography>
            <Button variant="contained" onClick={toggleFormulario}>
              {mostrarFormulario ? 'Ocultar formulario' : 'Agregar tipo de plan'}
            </Button>
          </Stack>

          <Collapse in={mostrarFormulario}>
            <Paper sx={{ mt: 2, p: 2 }}>
              <TipoServicioForm />
            </Paper>
          </Collapse>

          <Box sx={{ flexGrow: 1, mt: 2 }}>
            <DataGrid
              rows={tiposPlanes}
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
        <TipoPlanDetalle
          ts={tipoPlanSeleccionado}
          onVolver={() => setTipoPlanSeleccionado(null)}
        />

      )}
    </>
  );
};

export default TipoPlanPage;