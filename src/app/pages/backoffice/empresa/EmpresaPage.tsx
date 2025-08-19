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
import useTipoPlan from '@/app/hooks/useTipoPlan';
import useEmpresas from '@/app/hooks/useEmpresas';
import { Empresa } from '@/app/types/empresa';
import EmpresaForm from './agregar/agregarEmpresa';
import EmpresaDetalle from './detalle/detalleEmpresa';

const EmpresasPage = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const { empresas, fetchEmpresas} = useEmpresas();
  const { tiposPlanes, fetchTipoPlan } = useTipoPlan();
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<Empresa | null>(null);

  useEffect(() => {
    if (tiposPlanes.length === 0) fetchTipoPlan();
  }, [tiposPlanes, fetchTipoPlan]);

  useEffect(() => {
    fetchEmpresas()
  }, [fetchEmpresas])

  const toggleFormulario = () => {
    setMostrarFormulario((prev) => !prev);
  };
  const handleVolver = () => {
    setEmpresaSeleccionada(null);
  };
  const verDetalle = (empresa: Empresa) => {
    setEmpresaSeleccionada(empresa);
  };

  const columns: GridColDef<Empresa>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 50 },
    { field: 'telefonoContacto', headerName: 'Teléfono  contacto', width: 140 },
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
      {!empresaSeleccionada ? (
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
            <Typography variant="h4">Lista de empresas</Typography>
            <Button variant="contained" onClick={toggleFormulario}>
              {mostrarFormulario ? 'Ocultar formulario' : 'Agregar empresa'}
            </Button>
          </Stack>

          <Collapse in={mostrarFormulario}>
            <Paper sx={{ mt: 2, p: 2 }}>
              <EmpresaForm />
            </Paper>
          </Collapse>

          <Box sx={{ flexGrow: 1, mt: 2 }}>
                      <DataGrid
                        rows={empresas}
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
        <EmpresaDetalle empresa={empresaSeleccionada} onVolver={handleVolver} />
      )}
    </>
  );
};

export default EmpresasPage;