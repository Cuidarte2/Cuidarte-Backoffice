"use client";
import { create } from "zustand";
import { Calificacion, Tarea } from "../types/tareas";
import { getTokenFromStorage } from "../utils/auth";

interface StoreTareaState {
  totalItems: number;
  tareas: Record<number, Tarea[]>;
  tareasFiltradas: Tarea[];
  loadedPages: Set<number>;
  loading: boolean;
  error: string | null;
  fetchTareas: (page: number) => Promise<void>;
  addTarea: (product: Tarea) => void;
  update: (tarea: Tarea) => Promise<void>;
  remove: (id: number) => Promise<void>;
  getTareaById: (id: number) => Tarea | undefined;
  getTareaByTexto: (valor: string) => void;
  calificarTarea: (calificacion: Calificacion) => Promise<Calificacion>;
}

const useTareas = create<StoreTareaState>((set, get) => ({
  tareas: {},
  tareasFiltradas: [],
  loadedPages: new Set(),
  loading: false,
  error: null,
  totalItems: 0,

  fetchTareas: async (page: number) => {
    const { loadedPages } = get();
    if (loadedPages.has(page)) return;

    set({ loading: true, error: null });
    const token = getTokenFromStorage();
    if (!token) throw new Error("Usuario no autenticado");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Tarea/ObtenerTodos?pagina=${page}`,
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
         const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener tareas");
      }
      const data: { items: Tarea[]; totalItems: number } =
        await response.json();
      set((state) => ({
        tareas: { [page]: data.items, ...state.tareas },
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
addTarea: async (tarea: Tarea) => {
  try {
    const token = getTokenFromStorage();
    if (!token) throw new Error("Usuario no autenticado");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Tarea/Crear`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tarea),
        redirect: "follow",
      }
    );
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = "Error al agregar la tarea";

      if (contentType?.includes("application/json")) {
         const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        const errorText = await response.text().catch(() => "");
        if (errorText) errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }
    const data: Tarea = await response.json();

    // Actualizamos el store
    set((state) => {
      const tareasPagina = state.tareas[0] ?? [];
      const sinDuplicado = tareasPagina.filter((t) => t.id !== data.id);

      return {
        tareas: {
          ...state.tareas,
          [0]: [...sinDuplicado, data],
        },
        totalItems: state.totalItems + 1,
        error: null,
        loading: false,
      };
    });
  } catch (err) {
    set({ error: `${err instanceof Error ? err.message : "Error desconocido"} (${Date.now()})`, loading: false });
  }
},
  update: async (tarea: Tarea) => {
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Tarea/Editar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(tarea),
          redirect: "follow",
        }
      );
      if (!response.ok) {
         const errorData = await response.json();
        throw new Error(errorData.message || "Error al editar la tarea");
      }
      const data = await response.json();
      set((state) => {
        const tareasPagina = state.tareas[0] ?? [];
        const nuevas = tareasPagina.map((t) => (t.id === data.id ? data : t));
        return {
          tareas: {
            ...state.tareas,
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
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Tarea/Eliminar`,
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
         const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar la tarea");
      }
      set((state) => {
        const nuevasPages = Object.fromEntries(
          Object.entries(state.tareas).map(([page, tareas]) => [
            Number(page),
            tareas.filter((t) => t.id !== id),
          ])
        );

        return {
          tareas: nuevasPages,
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
  getTareaById: (id: number) => {
    const pages = get().tareas;

    for (const tareasPagina of Object.values(pages)) {
      const tarea = tareasPagina.find((t) => t.id === id);
      if (tarea) return tarea;
    }

    return undefined;
  },
  getTareaByTexto: async (texto: string) => {
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL
        }/Tarea/ObtenerPorTexto?texto=${encodeURIComponent(texto)}`,
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
         const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener las tarea ");
      }
      const data = await response.json();
      set({ tareasFiltradas: data, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
  calificarTarea: async (calificacion: Calificacion) => {
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Tarea/Calificar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(calificacion),
        }
      );
      if (!response.ok) {
         const errorData = await response.json();
        throw new Error(errorData.message || "Error al calificar la tarea");
      }
      const calificacionRes: Calificacion = await response.json();
      set((state) => ({
        tareasFiltradas: state.tareasFiltradas.map((t) =>
          t.id === calificacionRes.idTarea ? { ...t, calificacion: calificacionRes } : t
        ),
        loading: false,
      }));
      return calificacionRes;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
      throw err instanceof Error ? err : new Error("Error desconocido");
    }
  },

}));

export default useTareas;
