import { Autocomplete, TextField, FormControl } from '@mui/material';
import { useState, useEffect } from 'react';
import { Cliente } from '../types/cliente';
import useClientes from '../hooks/useClientes';
import { useDebounce } from '../hooks/useDebounce';

interface Props {
    value: number | null;
    onChange: (cliente: Cliente | null) => void;
    disabled?: boolean;
}

export default function ClienteSelect({ value, onChange, disabled }: Props) {
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [clientesOptions, setClientesOptions] = useState<Cliente[]>([]);

    const { getClienteByTexto, getClienteById } = useClientes();
    const debouncedInput = useDebounce(inputValue, 500);
    useEffect(() => {
        if (value == null) {
            setClienteSeleccionado(null);
            setInputValue('');
            return;
        }

        const cliente = getClienteById(value);
        if (cliente) {
            setClienteSeleccionado(cliente);
            setInputValue(`${cliente.nombre} ${cliente.apellido}`);
        }
    }, [value, getClienteById]);

    useEffect(() => {
        if (!debouncedInput || debouncedInput.length < 3) {
            setClientesOptions([]);
            return;
        }
        let active = true;
        (async () => {
            const resultados = await getClienteByTexto(debouncedInput);
            if (active) setClientesOptions(resultados);
        })();
        return () => { active = false };
    }, [debouncedInput, getClienteByTexto]);


    return (
        <FormControl fullWidth>
            <Autocomplete<Cliente, false, false, false>
                disabled={disabled}
                options={clientesOptions}
                getOptionLabel={(c) => `${c.nombre} ${c.apellido} - ${c.ci}`}
                isOptionEqualToValue={(opt, val) => opt.id === val?.id}

                // Selección
                value={clienteSeleccionado}
                onInputChange={(_, newText, reason) => {
                    if (reason === 'clear') {
                        setClienteSeleccionado(null);
                        onChange(null);
                        setClientesOptions([]);
                        setInputValue('');
                        return;
                    }
                    setInputValue(newText);
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Cliente" variant="standard" />
                )}
            />
        </FormControl>
    );
}