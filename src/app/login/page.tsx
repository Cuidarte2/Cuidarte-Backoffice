"use client";
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Collapse,
  Box,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useRouter } from "next/navigation";
import ArrowBack from "@/app/ui/arrowBack";
import { decodeToken } from "@/app/utils/decodeJwt";
import { Usuario } from "@/app/types/usuario";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useUsersStore from "@/app/hooks/useUsersStore";
import { getTokenFromStorage } from "@/app/utils/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login, error } = useUsersStore();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);


  useEffect(() => {
    if (error) {
      setApiError(error);
    }
  }, [error]);


  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = getTokenFromStorage();
    if (token) {
      router.replace("..");
    }
  }, [router]);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.;,!]).{6,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const newErrors = {
      email: emailRegex.test(form.email) ? "" : "Email inválido.",
      password: regexPass.test(form.password)
        ? ""
        : "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un signo (. ; , !).",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((e) => e);
    if (!hasErrors) {
      try {
        const token: Usuario = await login(form);
        setApiError(null);
        if (token.token) {
          localStorage.setItem(
            "cuidarte_usuario",
            JSON.stringify({
              ...decodeToken(token.token),
              token: token.token,
            })
          );
        }
        router.replace("..");
      } catch (error) {
        const errorData = error as { statusCode?: number; message?: string };
        if (errorData.statusCode === 500)
          setApiError("Error del servidor. Intente más tarde.");

        else if (errorData.statusCode === 409) setApiError(errorData.message || "Datos inválidos. Por favor, revise los campos.")
        else if (errorData.statusCode === 400)
          setApiError("Datos inválidos. Por favor, revise los campos.");
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">

      <Paper
        elevation={0}
        className="p-8 w-full max-w-md "
        sx={{ backgroundColor: "inherit" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
          <Collapse in={!!apiError} sx={{ width: "100%", maxWidth: 500 }}>
            <Alert severity="error" onClose={() => setApiError(null)}>
              {apiError}
            </Alert>
          </Collapse>
        </Box>

        <ArrowBack />
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-4">
          <Typography variant="h5" className="mb-6 text-center">
            Login
          </Typography>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            sx={{
              boxShadow: 'none',
              '& .MuiInput-root': {
                boxShadow: 'none',
              },
              '& input': {
                boxShadow: 'none',
              },
            }}

          />
          <TextField
            label="Contraseña"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Paper>
    </div>
  );
}
