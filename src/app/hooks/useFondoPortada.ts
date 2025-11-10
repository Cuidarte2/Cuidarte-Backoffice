import { create } from "zustand";
import { FondoPortada } from "../types/fondoPortada";
import { getTokenFromStorage } from "../utils/auth";

interface StoreFondoPortadaState {
  fondoPortada: FondoPortada | null;
  loading: boolean;
  error: string | null;
  fetchFondoPortada: () => Promise<void>;
  addFondoPortada: (fondo: FondoPortada) => Promise<void>;
}

const API_BASE = process.env.NEXT_PUBLIC_CUIDARTE_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "";

const useFondoPortada = create<StoreFondoPortadaState>((set) => ({
  fondoPortada: null,
  loading: false,
  error: null,

  fetchFondoPortada: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/FondoPortada/Obtener`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        redirect: "follow",
        cache: "no-cache",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const data = await response.json();
      // Suponemos que la API devuelve { url: string | null } o el objeto FondoPortada
      const fondo: FondoPortada | null =
        data && typeof data === "object" && "url" in data
          ? { id: data.id ?? 0, url: (data.url as string) ?? null } as FondoPortada
          : (data as FondoPortada) ?? null;

      set({ fondoPortada: fondo, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },

  addFondoPortada: async (fondo: FondoPortada) => {
    set({ loading: true, error: null });
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");

      // Le enviamos solo el campo necesario al backend
      const payload = { url: fondo.url ?? null };

      // Intentamos primero llamar al endpoint PUT (upsert). Si tu backend usa POST, cambialo.
      const response = await fetch(`${API_BASE}/FondoPortada/Crear`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Si PUT falla con 404/405, intentamos POST por compatibilidad
      let finalResponse = response;
      if (!response.ok && (response.status === 404 || response.status === 405)) {
        finalResponse = await fetch(`${API_BASE}/FondoPortada/Crear`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!finalResponse.ok) {
        const errorData = await finalResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${finalResponse.status}`);
      }

      const data = await finalResponse.json();
      const saved: FondoPortada =
        data && typeof data === "object" && "url" in data
          ? {  url: data.url ?? null }
          : (data as FondoPortada);

      set({ fondoPortada: saved, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
      throw err;
    }
  },
}));

export default useFondoPortada;