import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Rating,
  Button
} from '@mui/material'
import { useState, useEffect } from 'react'

interface CalificarTareaModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: { nota: number; comentario: string }) => void
  confirmText?: string
}

export default function CalificarTareaModal({
  open,
  onClose,
  onConfirm,
  confirmText = 'Calificá la tarea'
}: CalificarTareaModalProps) {
  const [nota, setNota] = useState<number | null>(null)
  const [comentario, setComentario] = useState('')

  useEffect(() => {
    if (!open) {
      setNota(null)
      setComentario('')
    }
  }, [open])

  const handleConfirm = () => {
    if (nota !== null) {
      onConfirm({ nota, comentario })
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{confirmText}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography gutterBottom>¿Qué nota le das?</Typography>
        <Rating
          value={nota}
          onChange={(_, value) => setNota(value)}
          precision={1}
          max={5}
        />
        <TextField
          label="Comentario"
          multiline
          fullWidth
          minRows={3}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          sx={{ mt: 3 }}
          placeholder="Contanos qué te pareció la tarea..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          variant="contained"
          disabled={nota === null}
        >
          Enviar calificación
        </Button>
      </DialogActions>
    </Dialog>
  )
}