'use client';
import * as React from 'react';
import { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import useFondoPortada from '@/app/hooks/useFondoPortada';

export default function FondoPortadaPage() {
  const { fondoPortada, loading, error, addFondoPortada } = useFondoPortada();
  const [url, setUrl] = useState<string>(fondoPortada?.url ?? '');
  const [previewUrl, setPreviewUrl] = useState<string | null>(fondoPortada?.url ?? null);
  const [localError, setLocalError] = useState<string | null>(null);

  React.useEffect(() => {
    setUrl(fondoPortada?.url ?? '');
    setPreviewUrl(fondoPortada?.url ?? null);
  }, [fondoPortada?.url]);

  const validateUrl = (value: string) => {
    if (!value) return 'La URL no puede estar vacía';
    try {
      // valida que sea URL válida
      // permite http(s) y data: para preview local si lo necesitás
      const u = new URL(value);
      if (!['http:', 'https:', 'data:'].includes(u.protocol)) return 'Protocolo no soportado';
      return null;
    } catch {
      return 'URL inválida';
    }
  };

  const handlePreview = () => {
    const v = url.trim();
    const err = validateUrl(v);
    setLocalError(err);
    if (!err) setPreviewUrl(v);
  };

  const handleSave = async () => {
    const v = url.trim();
    const err = v === '' ? null : validateUrl(v);
    setLocalError(err);
    if (err) return;
    try {
      await addFondoPortada({ url: v });
    } catch {
      // error ya seteado por hook
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Stack spacing={2}>
        <Typography variant="h5">Fondo de Portada</Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="URL de la imagen"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
              helperText="Dejá vacío para remover el fondo y usar el fallback."
              error={!!localError}
            />
            {localError && <Alert severity="warning">{localError}</Alert>}

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={handlePreview}>Preview</Button>
              <Button variant="contained" onClick={handleSave}>Guardar</Button>
            </Stack>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Preview actual</Typography>
              <Paper
                elevation={1}
                sx={{
                  height: 220,
                  mt: 1,
                  backgroundColor: '#f5f5f5',
                  backgroundImage: previewUrl ? `url(${previewUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                {!previewUrl && (
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body2">No hay fondo definido, se mostrará el fallback.</Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
}