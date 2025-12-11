'use client';
import { useEffect, useState, useCallback } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography, useMediaQuery } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ApartmentIcon from '@mui/icons-material/Apartment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from "@mui/material/styles";
import TipoServicioPage from "./tipoServicio/TipoServicioPage";
import TareasPage from "./tareas/TareasPage";
import ClientesPage from "./clientes/ClientesPage";
import TipoPlanPage from "./tipoPlan/TipoPlanPage";
import EquiposPage from "./equipo/EquipoPage";
import EmpresasPage from "./empresa/EmpresaPage";
import { useRouter } from "next/navigation";
import { getTokenFromStorage } from "@/app/utils/auth";
import useUsersStore from "@/app/hooks/useUsersStore";
import FondoPortadaPage from "./fondoPortada/FondoPortadaPage";
export default function BackofficePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState("Tareas");
  const [loading, setLoading] = useState(true);
  const { logout } = useUsersStore();
  useEffect(() => {
      const token = getTokenFromStorage();
    if (!token) {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
  if (window.location.pathname.startsWith('/BackOffice')) {
    navigator.serviceWorker.register('/sw.js', { scope: '/backoffice/' });
  }
}, []);

  const handleLogout = useCallback(() => {
    logout();
    router.replace("/login");
  }, [logout, router]);

useEffect(() => {
  if (selectedMenu === 'Logout') {
    handleLogout()
  }
}, [selectedMenu, handleLogout]);


  if (loading) return null;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          width: isMobile ? '100%' : 250,
          height: isMobile ? 'auto' : '100vh',
          bgcolor: theme.palette.background.default,
        }}
      >
        {isMobile ? (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Menú</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <List>
        {[
          "Tareas",
          "Clientes",
          "Equipo",
          "TipoPlan",
          "TipoServicio",
          "Empresa",
          "Fondo Portada",
          "Logout",
        ].map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton onClick={() => setSelectedMenu(item)}>
              <ListItemIcon>
                {item === "Tareas" ? (
                  <AssignmentIcon />
                ) : item === "Clientes" ? (
                  <PersonIcon />
                ) : item === "TipoServicio" ? (
                  <SupportAgentIcon />
                ) : item === "Equipo" ? (
                  <GroupIcon />
                ) : item === "TipoPlan" ? (
                  <DashboardIcon />
                ) : item === "Empresa" ? (
                  <ApartmentIcon />
                ) : item === "Fondo Portada" ? (
                  <PhotoSizeSelectActualIcon />
                ) : (
                  <LogoutIcon />
                )}
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </AccordionDetails>
  </Accordion>
) : (
  <Paper sx={{ width: 250, height: "100vh" }}>
    <List>
         <Paper
          sx={{
            width: '100%',
            height: isMobile ? 'auto' : '100vh',
          }}
        >
          <List>
            {['Tareas', 'Clientes', 'Equipo', 'TipoPlan', 'TipoServicio','Empresa', 'Fondo Portada', 'Logout'].map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton onClick={() => setSelectedMenu(item)}>
                  <ListItemIcon>
                    {item === 'Tareas' ? (
                      <AssignmentIcon />
                    ) : item === 'Clientes' ? (
                      <PersonIcon />
                    ) : item === 'TipoServicio' ? (
                      <SupportAgentIcon />
                    ) : item === 'Equipo' ? (
                      <GroupIcon />
                    ) : item === 'TipoPlan' ? (
                      <DashboardIcon />
                    ) : item === 'Empresa' ? (
                      <ApartmentIcon />
                    ) : item === 'Fondo Portada' ? (
                      <PhotoSizeSelectActualIcon />
                    )  : (
                      <LogoutIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
    </List>
  </Paper>
)}

      </Box>

      <Box
        sx={{
          flexGrow: 1,
          padding: 3,
        }}
      >
        {selectedMenu === 'Tareas' && <TareasPage />}
        {selectedMenu === 'Clientes' && <ClientesPage />}
        {selectedMenu === 'TipoServicio' && <TipoServicioPage />}
        {selectedMenu === 'TipoPlan' && <TipoPlanPage />}
        {selectedMenu === 'Equipo' && <EquiposPage />}
        {selectedMenu === 'Empresa' && <EmpresasPage />}
        {selectedMenu === 'Fondo Portada' && <FondoPortadaPage />}
       {selectedMenu === 'Logout' && (
  <Typography variant="h4">Cerrando sesión...</Typography>
)}

      </Box>
    </Box>
  );
};
