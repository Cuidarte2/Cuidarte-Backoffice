"use client";
import { useEffect, useState } from "react";
import { Paper, Typography, Button, TextField, Stack } from "@mui/material";
import ConfirmButton from "@/app/components/confirmButton";
import useClientes from "@/app/hooks/useClientes";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import {
  estadoMap,
  EstadoTarea,
  mapTareaToFormData,
  Tarea,
} from "@/app/types/tareas";
import ClienteSelect from "@/app/components/clienteSelect";
import FuncionarioSelect from "@/app/components/funcionarioSelect";
import EstadoSelect from "@/app/components/EstadoSelect";
import useTareas from "@/app/hooks/useTareas";
import useTipoServicio from "@/app/hooks/useTipoServicio";
import TipoServicioSelect from "@/app/components/tipoServicioSelect";

interface Props {
  tarea: Tarea;
  onVolver: () => void;
}

export default function ClienteDetalle({ tarea, onVolver }: Props) {
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({ ...tarea });
  const { update, remove } = useTareas();
  const { tiposServicios, fetchTipoServicios } = useTipoServicio();
  const {
    clientes,
    loadedPages,
    fetchClientes,
    // ...
  } = useClientes();

  useEffect(() => {
    fetchTipoServicios();
  }, [fetchTipoServicios]);

  useEffect(() => {
    if (!loadedPages.has(0)) {
      fetchClientes(0);
    }
  }, [loadedPages, fetchClientes]);

  useEffect(() => {
    if (tarea && Object.values(clientes).flat().length) {
      const form = mapTareaToFormData(tarea);
      setFormData(form);
    }
  }, [tarea, clientes]);

  const handleChange =
    (field: keyof typeof formData) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [field]: event.target.value });
      };

  const handleGuardar = () => {
    update(formData);
    setEditando(false);
  };

  const onEliminar = (id: number) => {
    remove(id);
    onVolver();
  };
  return (
    <Paper sx={{ width: "100%", minHeight: "100vh", p: 4 }} elevation={3}>
      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" color="primary" onClick={onVolver}>
          Volver
        </Button>
      </Stack>

      <Typography variant="h4" gutterBottom>
        Detalle de tarea
      </Typography>

      <Stack spacing={2}>
        <ClienteSelect
          value={formData.clienteId ?? 0}
          onChange={(c) =>
            setFormData((prev) => ({
              ...prev,
              ...(c ? { cliente: c } : {}),
              clienteId: c?.id ?? 0,
            }))


          }
          disabled={!editando}
        />
        <FuncionarioSelect
          value={formData.responsableId ?? 0}
          onChange={(f) =>
            setFormData((prev) => ({
              ...prev,
              empleadoResponsable: f,
              responsableId: f.id ?? 0,
            }))
          }
          disabled={!editando}
        />
        <EstadoSelect
          value={
            typeof formData.estado === "string"
              ? estadoMap[formData.estado] ?? EstadoTarea.NoSeCargo
              : formData.estado ?? EstadoTarea.NoSeCargo
          }
          onChange={(e) => setFormData({ ...formData, estado: e })}
          disabled={!editando}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DatePicker
            label="Fecha"
            value={formData.fecha ? new Date(formData.fecha) : null}
            onChange={(f) =>
              setFormData({ ...formData, fecha: f ?? undefined })
            }
            slotProps={{ textField: { fullWidth: true } }}
            disabled={!editando}
          />
        </LocalizationProvider>

        <TextField
          label="Descripción"
          name="descripcion"
          multiline
          rows={4}
          value={formData.descripcion}
          onChange={handleChange("descripcion")}
          disabled={!editando}
        />

        <Typography variant="h6" mt={4}>
          Servicios asociados
        </Typography>
        {editando ? (
          <>
            {formData.serviciosUsados?.map((s, index) => (
              <Stack key={index} direction="row" spacing={2}>
                <TipoServicioSelect
                  value={s.tipoServicio?.id || 0}
                  onChange={(id: number) => {
                    const serviciosActualizados = [
                      ...(formData.serviciosUsados || []),
                    ];
                    const tipoSeleccionado = tiposServicios.find(
                      (ts) => ts.id === id
                    );
                    if (serviciosActualizados[index].tipoServicio) {
                      serviciosActualizados[index].tipoServicio.id = id;
                      serviciosActualizados[index].tipoServicio =
                        tipoSeleccionado ?? {
                          id,
                          nombre: "",
                          precioHora: 0,
                        };
                    }

                    setFormData({
                      ...formData,
                      serviciosUsados: serviciosActualizados,
                    });
                  }}
                />
                <TextField
                  label="Cantidad"
                  type="number"
                  value={s.cantServicios ?? 1}
                  onChange={(e) => {
                    const valor = Math.max(1, Number(e.target.value));
                    const serviciosActualizados = [
                      ...(formData.serviciosUsados || []),
                    ];
                    serviciosActualizados[index].cantServicios = valor;
                    setFormData({
                      ...formData,
                      serviciosUsados: serviciosActualizados,
                    });
                  }}
                  error={s.cantServicios < 1}
                  helperText={s.cantServicios < 1 ? "Debe ser al menos 1" : ""}
                  sx={{ width: 120 }}
                />

                <Button
                  color="error"
                  onClick={() => {
                    const serviciosActualizados =
                      formData.serviciosUsados?.filter((_, i) => i !== index) ??
                      [];
                    setFormData({
                      ...formData,
                      serviciosUsados: serviciosActualizados,
                    });
                  }}
                >
                  Quitar
                </Button>
              </Stack>
            ))}

            <Button
              variant="outlined"
              onClick={() => {
                const nuevoServicio = {
                  id: 0,
                  cantServicios: 0,
                  tipoServicio: { id: 0, nombre: "", precioHora: 0 },
                };

                setFormData({
                  ...formData,
                  serviciosUsados: [
                    ...(formData.serviciosUsados ?? []),
                    nuevoServicio,
                  ],
                });
              }}
            >
              + Agregar servicio
            </Button>
          </>
        ) : (
          <>
            <Stack spacing={2}>
              {formData.serviciosUsados?.length === 0 && (
                <Typography color="text.secondary">
                  Esta tarea no tiene servicios asociados.
                </Typography>
              )}

              {formData.serviciosUsados?.map((servicio, index) => (
                <Paper key={index} sx={{ p: 2, backgroundColor: "#f9f9f9" }}>
                  <Typography>
                    <strong>ID tipo servicio:</strong>{" "}
                    {servicio.tipoServicio?.id}
                  </Typography>
                  <Typography>
                    Nombre del servicio:{" "}
                    {tiposServicios.find(
                      (ts) => ts.id === servicio.tipoServicio?.id
                    )?.nombre ?? "Sin nombre"}
                  </Typography>
                  <Typography>Cantidad: {servicio.cantServicios}</Typography>

                  <Typography>
                    <strong>Precio:</strong> $
                    {servicio.tipoServicio?.precioHora}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </>
        )}
        <Typography variant="h6" mt={4}>
          Servicios extra
        </Typography>
        {editando ? (
          <>
            {formData.serviciosExtras?.map((s, index) => (
              <Stack key={index} direction="row" spacing={2}>
                <TipoServicioSelect
                  value={s.tipoServicio?.id || 0}
                  onChange={(id: number) => {
                    const serviciosActualizados = [
                      ...(formData.serviciosExtras || []),
                    ];
                    const tipoSeleccionado = tiposServicios.find(
                      (ts) => ts.id === id
                    );
                    if (serviciosActualizados[index].tipoServicio) {
                      serviciosActualizados[index].tipoServicio.id = id;
                      serviciosActualizados[index].tipoServicio =
                        tipoSeleccionado ?? {
                          id,
                          nombre: "",
                          precioHora: 0,
                        };
                    }

                    setFormData({
                      ...formData,
                      serviciosExtras: serviciosActualizados,
                    });
                  }}
                />
                <TextField
                  label="Cantidad"
                  type="number"
                  value={s.cantServicios ?? 1}
                  onChange={(e) => {
                    const valor = Math.max(1, Number(e.target.value));
                    const serviciosActualizados = [
                      ...(formData.serviciosExtras || []),
                    ];
                    serviciosActualizados[index].cantServicios = valor;
                    setFormData({
                      ...formData,
                      serviciosExtras: serviciosActualizados,
                    });
                  }}
                  error={s.cantServicios < 1}
                  helperText={s.cantServicios < 1 ? "Debe ser al menos 1" : ""}
                  sx={{ width: 120 }}
                />

                <Button
                  color="error"
                  onClick={() => {
                    const serviciosActualizados =
                      formData.serviciosExtras?.filter((_, i) => i !== index) ??
                      [];
                    setFormData({
                      ...formData,
                      serviciosExtras: serviciosActualizados,
                    });
                  }}
                >
                  Quitar
                </Button>
              </Stack>
            ))}

            <Button
              variant="outlined"
              onClick={() => {
                const nuevoServicio = {
                  id: 0,
                  cantServicios: 0,
                  tipoServicio: { id: 0, nombre: "", precioHora: 0 },
                };

                setFormData({
                  ...formData,
                  serviciosExtras: [
                    ...(formData.serviciosExtras ?? []),
                    nuevoServicio,
                  ],
                });
              }}
            >
              + Agregar servicio
            </Button>
          </>
        ) : (
          <>
            <Stack spacing={2}>
              {formData.serviciosExtras?.length === 0 && (
                <Typography color="text.secondary">
                  Esta tarea no tiene servicios extra.
                </Typography>
              )}

              {formData.serviciosExtras?.map((servicio, index) => (
                <Paper key={index} sx={{ p: 2, backgroundColor: "#f9f9f9" }}>
                  <Typography>
                    <strong>ID tipo servicio:</strong>{" "}
                    {servicio.tipoServicio?.id}
                  </Typography>
                  <Typography>
                    Nombre del servicio:{" "}
                    {tiposServicios.find(
                      (ts) => ts.id === servicio.tipoServicio?.id
                    )?.nombre ?? "Sin nombre"}
                  </Typography>
                  <Typography>Cantidad: {servicio.cantServicios}</Typography>

                  <Typography>
                    <strong>Precio:</strong> $
                    {servicio.tipoServicio?.precioHora}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </>
        )}
        <TextField
          label="Costo total"
          value={formData.costoTotal}
          fullWidth
          disabled
        />
        <TextField label="ID" value={formData.id} fullWidth disabled />
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
          onConfirm={() => onEliminar(tarea.id as number)}
          confirmText="¿Eliminar este cliente?"
          buttonProps={{
            variant: "outlined",
            color: "error",
            disabled: editando,
          }}
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
                setFormData({ ...tarea });
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
