import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';

interface ConfirmButtonProps {
  onConfirm: () => void;
  confirmText?: string;
  children: React.ReactNode;
  buttonProps?: React.ComponentProps<typeof Button>;
}

export default function ConfirmButton({
  onConfirm,
  confirmText = '¿Estás seguro?',
  children,
  buttonProps,
}: ConfirmButtonProps) {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <>
      <Button onClick={handleClick} {...buttonProps}>
        {children}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{confirmText}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Cancelar</Button>
          <Button onClick={handleConfirm} color="primary" variant="contained" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
