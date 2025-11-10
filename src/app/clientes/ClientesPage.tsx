'use client';
import * as React from 'react';
import { useState } from 'react';
import { Cliente } from '@/app/types/cliente';
import { DataGrid, GridColDef, GridValueGetter } from '@mui/x-data-grid';
import {
  Paper,
  Typography,
  Button,
  Stack,
  Box,
  Collapse,
  InputBase,
  styled,
  alpha,
  Pagination,
} from '@mui/material';
import ClienteForm from './agregar/agregarCliente';
import ClienteDetalle from './detalle/detalleCliente';
import { useEffect } from 'react';
import useTipoPlan from '@/app/hooks/useTipoPlan';
import useClientes from '@/app/hooks/useClientes';
import SearchIcon from "@mui/icons-material/Search";


const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
}));
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer"
}));


const ClientesPage = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const { clientes, clientesFiltradas, totalItems, fetchClientes, getClienteByTexto } = useClientes();
  const { tiposPlanes, fetchTipoPlan } = useTipoPlan();
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [search, setSearch] = useState<string>("");
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [page, setPage] = useState(0)
  const clientesParaGrid = clientes[page] ?? []
  const listaAMostrar = busquedaActiva ? clientesFiltradas : clientesParaGrid;


  const buscar = () => {
    if (search.trim()) {
      setBusquedaActiva(true);
      getClienteByTexto(search);
    } else {
      setBusquedaActiva(false);
    }
  };
  const pageSize = 20;
  const pageCount = Math.ceil(totalItems / pageSize);

  useEffect(() => {
    if (tiposPlanes.length === 0) fetchTipoPlan();
  }, [tiposPlanes, fetchTipoPlan]);

  useEffect(() => {
    fetchClientes(page)
  }, [fetchClientes, page])

  const toggleFormulario = () => {
    setMostrarFormulario((prev) => !prev);
  };
  const handleVolver = () => {
    setClienteSeleccionado(null);
  };
  const verDetalle = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
  };

  const columns: GridColDef<Cliente>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 50 },
    { field: 'apellido', headerName: 'Apellido', flex: 1, minWidth: 50 },
    { field: 'ci', headerName: 'CI', flex: 1, minWidth: 140 },
    { field: 'telefono', headerName: 'Teléfono', width: 140 },
    { field: 'celular', headerName: 'Celular', width: 140 },
    { field: 'email', headerName: 'Email', width: 140 },
    {
      field: 'fechaNacimiento',
      headerName: 'Nacimiento',
      width: 130,
      valueGetter: (params: Parameters<GridValueGetter>[0]) =>
        params ? new Date(params as string | number | Date).toLocaleDateString() : ''
    },
    {
      field: 'tipoPlan',
      headerName: 'Plan',
      width: 150,
      renderCell: (params: { row: Cliente }) => {
        return <span>{tiposPlanes.find((tipo) => tipo.id === params.row.tipoPlanId)?.nombre ?? '—'}</span>;
      }
    },
    { field: 'responsablePago', headerName: 'Responsable de Pago', width: 180 },
    { field: 'formaPago', headerName: 'Forma de Pago', width: 150 },
    { field: 'observaciones', headerName: 'Observaciones', width: 200 },
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
      {!clienteSeleccionado ? (
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
          <Box display="flex" justifyContent="center" my={2}>
            <Search>
              <SearchIconWrapper
                role="button"
                tabIndex={0}
                onClick={buscar}
              >
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                aria-label="search"
                value={search}
                onChange={(e) => {
                  const texto = e.target.value;
                  setSearch(texto);
                  if (texto.trim() === '') {
                    setBusquedaActiva(false);
                  }
                }}

                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setBusquedaActiva(true);
                    buscar();
                  }
                }}
              />

            </Search>
          </Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4">Lista de clientes</Typography>
            <Button variant="contained" onClick={toggleFormulario}>
              {mostrarFormulario ? 'Ocultar formulario' : 'Agregar cliente'}
            </Button>
          </Stack>

          <Collapse in={mostrarFormulario}>
            <Paper sx={{ mt: 2, p: 2 }}>
              <ClienteForm />
            </Paper>
          </Collapse>

          <Box sx={{ flexGrow: 1, mt: 2 }}>
            <Stack spacing={2}>
              <DataGrid
                rows={listaAMostrar}
                columns={columns}
                getRowId={row => row.id}
                hideFooter
                autoHeight
                sx={{ border: 0 }}
              />
              {!busquedaActiva && (
                <Pagination
                  count={pageCount}
                  page={page + 1}
                  onChange={(_, value) => setPage(value - 1)}
                  color="primary"
                />
              )}
            </Stack>
          </Box>
        </Paper>
      ) : (
        <ClienteDetalle cliente={clienteSeleccionado} onVolver={handleVolver} />
      )}
    </>
  );
};

export default ClientesPage;