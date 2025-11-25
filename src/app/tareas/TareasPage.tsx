'use client'
import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef, GridValueGetter } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Typography, Button, Stack, Box, Collapse, styled, InputBase, alpha, Pagination } from '@mui/material';
import { Tarea } from '@/app/types/tareas';
import TareaDetalle from './detalle/detalleTarea';
import useTareas from '@/app/hooks/useTareas';
import TareaForm from './agregar/agregarTarea';
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


const TareasPage = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const { tareas, tareasFiltradas, totalItems, fetchTareas, getTareaByTexto } = useTareas();
  const [search, setSearch] = useState<string>("");
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [page, setPage] = useState(0)
  const tareasParaGrid = tareas[page] ?? []
  const listaAMostrar = busquedaActiva ? tareasFiltradas : tareasParaGrid;
  const pageSize = 20;
  const pageCount = Math.ceil(totalItems / pageSize);
  const buscar = () => {
    if (search.trim()) {
      setBusquedaActiva(true);
      getTareaByTexto(search);
    } else {
      setBusquedaActiva(false);
    }
  };
useEffect(() => {
  const fetchData = async () => {
    try {
      await fetchTareas(page);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
    }
  };

  fetchData();
}, [page,fetchTareas,tareas]);


  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null);
  const onVerDetalle = (tarea: Tarea) => {
    setTareaSeleccionada(tarea);
  };
  const toggleFormulario = () => {
    setMostrarFormulario(prev => !prev);
  };

  const handleVolver = () => {
    setTareaSeleccionada(null);
  };
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'descripcion', headerName: 'Descripción', flex: 1, minWidth: 220 },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 100,
      renderCell: (params: { row: Tarea }) => {
        
        return (
          <span>
            {params.row.estado
              ? `${params.row.estado ?? ''}` || '—'
              : '—'}
          </span>
        );

      }
    },
    {
      field: 'fecha',
      headerName: 'Fecha',
      width: 120,
      valueGetter: (params: Parameters<GridValueGetter>[0]) =>
        params ? new Date(params as string | number | Date).toLocaleDateString() : '',
    },
    {
      field: 'responsable',
      headerName: 'Responsable',
      width: 250,
      renderCell: (params: { row: Tarea }) => {
        return (
          <span>
            {params.row.responsable
              ? `${params.row.responsable.nombre ?? ''} ${params.row.responsable.apellido ?? ''}`.trim() || '—'
              : '—'}
          </span>
        );

      }
    },
    {
      field: 'clienteId',
      headerName: 'Cliente',
      width: 250,
      renderCell: (params: { row: Tarea }) => {
        return (
          <span>
            {params.row.cliente
              ? `${params.row.cliente.nombre ?? ''} ${params.row.cliente.apellido ?? ''} ${params.row.cliente.ci ?? ''}`.trim() || '—'
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
          onClick={() => onVerDetalle(params.row)}
        >
          Ver detalle
        </Button>
      ),
    },
  ];


  return (
    <>
      {!tareaSeleccionada ? (
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
            <Typography variant="h4">Lista de tareas</Typography>
            <Button variant="contained" onClick={toggleFormulario}>
              {mostrarFormulario ? 'Ocultar formulario' : 'Agregar tarea'}
            </Button>
          </Stack>
          <Collapse in={mostrarFormulario}>
            <Paper sx={{ mt: 2, p: 2 }}>
              <TareaForm />
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
        <TareaDetalle tarea={tareaSeleccionada} onVolver={handleVolver} />
      )}
    </>
  );
};

export default TareasPage;