"use client";
import { create } from "zustand";
import { getTokenFromStorage } from "../utils/auth";
import { Empresa } from "../types/empresa";

interface StoreEmpresaState {
  empresas: Empresa[];
  loading: boolean;
  error: string | null;
  fetchEmpresas: () => Promise<void>;
  addEmpresa: (empresa: Empresa) => void;
  update: (empresa: Empresa) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

const useEmpresas = create<StoreEmpresaState>((set) => ({
  empresas: [],
  loading: false,
  error: null,
  fetchEmpresas: async () => {
    set({ loading: true, error: null });
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Empresa/ObtenerTodos`,
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
        throw new Error(errorData.message || "Error al obtener empresas");
      }
      const data = await response.json();
      set({ empresas: data, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },

  addEmpresa: async (empresa: Empresa) => {
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Empresa/Crear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(empresa),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al obtener empresas");
      }
      const data = await response.json();
      set((state) => {
        const sinDuplicado = state.empresas.filter((e) => e.id !== data.id);
        return { empresas: [...sinDuplicado, data] };
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
  update: async (empresa: Empresa) => {
    try {
      const token = getTokenFromStorage();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Empresa/Editar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(empresa),
          redirect: "follow",
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al editar la empresa");
      }
      const data = await response.json();
      set((state) => ({
        empresas: state.empresas.map((e) =>
          e.id == data.id ? data : e
        ),
      }));
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
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Empresa/Eliminar`,
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
        throw new Error(errorData.message || "Error al eliminar el empresa");
      }
        set((state) => ({
        empresas: state.empresas.filter((e) => e.id !== id),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
}));

export default useEmpresas;
