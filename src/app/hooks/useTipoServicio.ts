"use client";
import { create } from "zustand";
import { TipoServicio } from "../types/tipoPlan";
import { clearSession, getTokenFromStorage } from "../utils/auth";

interface StoreTipoServicioState {
  tiposServicios: TipoServicio[];
  loading: boolean;
  error: string | null;
  fetchTipoServicios: () => Promise<void>;
  add: (tipoServicio: TipoServicio) => void;
  update: (tipoServicio: TipoServicio) => void;
  remove: (id: number) => void;
  getById: (id: number) => TipoServicio | undefined;
}

const useTipoServicio = create<StoreTipoServicioState>((set, get) => ({
  tiposServicios: [],
  loading: false,
  error: null,

  fetchTipoServicios: async () => {
    set({ loading: true, error: null });
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/TipoServicio/ObtenerTodos`,
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
        if (response.status === 401) {
          clearSession();
          set({ tiposServicios: [], loading: false, error: "Sesión expirada" });
          throw new Error("Sesión expirada, vuelva a iniciar sesión");
        }
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al obtener tipos de servicio"
        );
      }

      const data = await response.json();
      set({ tiposServicios: data, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },

  add: async (tipoServicio: TipoServicio) => {
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/TipoServicio/Crear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(tipoServicio),
          redirect: "follow",
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          clearSession();
          set({ tiposServicios: [], loading: false, error: "Sesión expirada" });
          throw new Error("Sesión expirada, vuelva a iniciar sesión");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al editar tipo servicio");
      }
      const data = await response.json();
      set((state) => ({
        tiposServicios: [...state.tiposServicios, data],
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
  update: async (tipoServicio: TipoServicio) => {
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/TipoServicio/Editar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(tipoServicio),
          redirect: "follow",
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          clearSession();
          set({ tiposServicios: [], loading: false, error: "Sesión expirada" });
          throw new Error("Sesión expirada, vuelva a iniciar sesión");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al editar tipo servicio");
      }
      const data = await response.json();
      set((state) => ({
        tiposServicios: state.tiposServicios.map((ts) =>
          ts.id == data.id ? data : ts
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
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/TipoServicio/Eliminar`,
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
        if (response.status === 401) {
          clearSession();
          set({ tiposServicios: [], loading: false, error: "Sesión expirada" });
          throw new Error("Sesión expirada, vuelva a iniciar sesión");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar tipo servicio");
      }
      set((state) => ({
        tiposServicios: state.tiposServicios.filter((ts) => ts.id !== id),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
  getById: (id: number) =>
    get().tiposServicios.find((cliente) => cliente.id === id),
}));

export default useTipoServicio;
