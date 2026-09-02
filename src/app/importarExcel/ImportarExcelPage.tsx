'use client';

import { useState, type ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Paper, Stack, Typography } from '@mui/material';
import useExcelImport from '../hooks/useImportarExcel';
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
const { uploadExcel, error } = useExcelImport();
export default function ExcelUpload() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState(null);

    const handleFileChange = async (event:ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadExcel(file);
    } catch {
      // el error ya quedó seteado en el store
    } finally {
      event.target.value = "";
    }
  };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
            <Stack spacing={2}>
                <Typography variant="h5">Fondo de Portada</Typography>

                <Button
                    component="label"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                    disabled={loading}
                >
                    {loading ? 'Procesando...' : 'Subir Excel'}
                    <VisuallyHiddenInput
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                    />
                </Button>

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                {data && (
                    <pre style={{ marginTop: 16, maxHeight: 300, overflow: 'auto' }}>
                        {JSON.stringify(data, null, 2)}
                    </pre>
                )}
            </Stack>
        </Paper>


    );
}