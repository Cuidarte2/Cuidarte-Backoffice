import { useEffect, useRef } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Usuario } from "../types/usuario";
import useUsersStore from "../hooks/useUsersStore";

interface Props {
    value: number;
    onChange: (funcionario: Usuario) => void;
    disabled?: boolean;
}


export default function FuncionarioSelect({ value, onChange, disabled }: Props) {
    const { usuarios, fetchUsuarios } = useUsersStore();
    const didFetchRef = useRef(false);

  useEffect(() => {
    if (didFetchRef.current) return;  
    didFetchRef.current = true;      
    fetchUsuarios();                 
  }, [fetchUsuarios]);                             


    return (
        <FormControl fullWidth>
            <InputLabel>Funcionario</InputLabel>
            <Select
                value={value ?? ""}
                label="Funcionario"
                onChange={(e) => {
                    const id = Number(e.target.value);
                    const usuario = usuarios.find((u) => u.id === id);
                    if (usuario) onChange(usuario);
                }}

                disabled={disabled || !usuarios.length}
            >
                {!usuarios.length ? (
                    <MenuItem disabled>Cargando funcionarios...</MenuItem>
                ) : (
                    usuarios.map((usuario) => (
                        <MenuItem key={usuario.id} value={usuario.id}>
                            {usuario.nombre + " " + usuario.apellido}
                        </MenuItem>
                    ))
                )}
            </Select>
        </FormControl>
    );
}
