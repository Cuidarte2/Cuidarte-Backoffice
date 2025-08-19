"use client";
import { create } from "zustand";
import { TipoPlan } from "../types/tipoPlan";
import { getTokenFromStorage } from "../utils/auth";

interface StoreTipoPlanState {
  tiposPlanes: TipoPlan[];
  loading: boolean;
  error: string | null;
  fetchTipoPlan: () => Promise<void>;
  add: (TipoPlan: TipoPlan) => void;
  update: (tipoPlan: TipoPlan) => void;
  remove: (id: number) => void;
  getById: (id: number) => TipoPlan | undefined;
}

const useTipoPlan = create<StoreTipoPlanState>((set, get) => ({
  tiposPlanes: [],
  loading: false,
  error: null,

  fetchTipoPlan: async () => {
    set({ loading: true, error: null });
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/TipoPlan/ObtenerTodos`,
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
        throw new Error(errorData.message || "Error al obtener tipos de plan");
      }

      const data = await response.json();
      set({ tiposPlanes: data, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },

  add: async (tipoPlan: TipoPlan) => {
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/TipoPlan/Crear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(tipoPlan),
          redirect: "follow",
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al obtener los planes");
      }
      const data = await response.json();
      set((state) => {
        const sinDuplicado = state.tiposPlanes.filter((p) => p.id !== data.id);
        return { tiposPlanes: [...sinDuplicado, data] };
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
  update: async (tipoPlan: TipoPlan) => {
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/TipoPlan/Editar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(tipoPlan),
          redirect: "follow",
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al editar tipo plan");
      }
      const data = await response.json();
      set((state) => ({
        tiposPlanes: state.tiposPlanes.map((tp) =>
          tp.id == data.id ? data : tp
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
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/TipoPlan/Eliminar`,
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
        throw new Error(errorData.message || "Error al eliminar tipo plan");
      }
      set((state) => ({
        tiposPlanes: state.tiposPlanes.filter((tp) => tp.id !== id),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
  getById: (id: number) => get().tiposPlanes.find((plan) => plan.id === id),
}));

export default useTipoPlan;
