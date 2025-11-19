"use client";
import { create } from "zustand";
import { Cliente } from "../types/cliente";
import { getTokenFromStorage } from "../utils/auth";

interface StoreClienteState {
  clientes: Record<number, Cliente[]>;
  clientesFiltradas: Cliente[];
  totalItems: number;
  loading: boolean;
  error: string | null;
  loadedPages: Set<number>;
  fetchClientes: (page: number) => Promise<void>;
  addCliente: (cliente: Cliente) => void;
  getClienteById: (id: number) => Cliente | undefined;
  getClienteByTexto: (valor: string) => Promise<Cliente[]>;
  update: (cliente: Cliente) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

const useClientes = create<StoreClienteState>((set, get) => ({
  clientes: {},
  loading: false,
  error: null,
  clientesFiltradas: [],
  loadedPages: new Set(),
  totalItems: 0,
  fetchClientes: async (page: number) => {
    set({ loading: true, error: null });
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Cliente/ObtenerTodos`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al obtener clientes");
      }
      const data: { items: Cliente[]; totalItems: number } =
        await response.json();
      set((state) => ({
        clientes: {
          ...state.clientes,
          [page]: data.items,
        },
        loadedPages: new Set(state.loadedPages).add(page),
        totalItems: data.totalItems,
        loading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },

  addCliente: async (cliente: Cliente) => {
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Cliente/Crear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cliente),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al obtener los clientes");
      }
      const data = await response.json();
      set((state) => {
        const prevPage0 = state.clientes[0] ?? [];
        const updatedFirstPage = [
          data,
          ...prevPage0.filter((c) => c.id !== data.id),
        ];

        return {
          clientes: {
            ...state.clientes,
            0: updatedFirstPage,
          },
          totalItems: state.totalItems + 1,
        };
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
  update: async (cliente: Cliente) => {
    try {
      const token = getTokenFromStorage();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Cliente/Editar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cliente),
          redirect: "follow",
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log(errorData);
        throw new Error(errorData.message || "Error al editar el cliente");
      }
      const data = await response.json();
      set((state) => {
        const clientePagina = state.clientes[0] ?? [];
        const nuevas = clientePagina.map((t) =>
          t.id === data.id ? data : t
        );
        return {
          clientes: {
            ...state.clientes,
            [0]: nuevas,
          },
        };
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
  remove: async (id: number) => {
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Cliente/Eliminar`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(id),
          redirect: "follow",
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al eliminar el cliente");
      }
      set((state) => {
        const nuevasPages = Object.fromEntries(
          Object.entries(state.clientes).map(([page, clientes]) => [
            Number(page),
            clientes.filter((c) => c.id !== id),
          ])
        );

        return {
          clientes: nuevasPages,
          totalItems: Math.max(state.totalItems - 1, 0),
        };
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
  getClienteById: (id: number) => {
    const pages = get().clientes;

    for (const clientesPagina of Object.values(pages)) {
      const cliente = clientesPagina.find((c) => c.id === id);
      if (cliente) return cliente;
    }

    return undefined;
  },
  getClienteByTexto: async (texto: string) => {
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_CUIDARTE_API_URL
        }/Cliente/ObtenerPorTexto?texto=${encodeURIComponent(texto)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al obtener el cliente");
      }
      const data = await response.json();
      const clientesMap: Cliente[] = [];
      data.map((c: Cliente) => {
        const cliente = c;
        clientesMap.push(cliente);
      });

      set({ clientesFiltradas: clientesMap, loading: false });
      return clientesMap;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
      return [];
    }
  },
}));

export default useClientes;
