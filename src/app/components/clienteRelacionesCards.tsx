"use client";
 
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Cliente } from "../types/cliente";
 
 
function nombreCompleto(c: Cliente) {
  return [c.nombre, c.apellido].filter(Boolean).join(" ") || `Cliente #${c.id}`;
}
 
function iniciales(c: Cliente) {
  const n = (c.nombre?.[0] ?? "").toUpperCase();
  const a = (c.apellido?.[0] ?? "").toUpperCase();
  return `${n}${a}` || "?";
}
 
interface ClienteRelacionesProps {
  cliente: Cliente;
}
 
export default function ClienteRelacionesCards({ cliente }: ClienteRelacionesProps) {
  const tieneResponsable = !!cliente.responsablePago;
  const tieneACargo = !!cliente.clientesACargo && cliente.clientesACargo.length > 0;
 
  if (!tieneResponsable && !tieneACargo) return null;
 
  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      {tieneResponsable && (
        <Card variant="outlined">
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <PaymentsIcon color="primary" fontSize="small" />
              <Typography variant="subtitle1" fontWeight={600}>
                Responsable de pago
              </Typography>
            </Stack>
            <Divider sx={{ mb: 1.5 }} />
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main" }}>
                {iniciales(cliente.responsablePago!)}
              </Avatar>
              <Box>
                <Typography variant="body1">
                  {nombreCompleto(cliente.responsablePago!)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CI: {cliente.responsablePago!.ci} · Tel:{" "}
                  {cliente.responsablePago!.telefono}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}
 
      {tieneACargo && (
        <Card variant="outlined">
          <CardContent>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1.5 }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <GroupsIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Clientes a cargo
                </Typography>
              </Stack>
              <Chip
                size="small"
                label={cliente.clientesACargo!.length}
                color="primary"
                variant="outlined"
              />
            </Stack>
            <Divider sx={{ mb: 1 }} />
            <List dense disablePadding>
              {cliente.clientesACargo!.map((dependiente) => (
                <ListItem key={dependiente.id} disableGutters>
                  <ListItemAvatar>
                    <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                      {iniciales(dependiente)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={nombreCompleto(dependiente)}
                    secondary={`CI: ${dependiente.ci} · Tel: ${dependiente.telefono}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
