"use client";
import { create } from "zustand";
import { getTokenFromStorage } from "../utils/auth";

interface StoreMensualidadState {  
  loading: boolean;
  error: string | null;
  pagarMensualidad: (id: number) => void;
}

const useMensualidad = create<StoreMensualidadState>((set) => ({
  loading: false,
  error: null,
  pagarMensualidad: async (idSuscripcion: number) => {
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Mensualidad/Pagar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(idSuscripcion),
          redirect: "follow",
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al obtener las mensualidades");
      }
      await response.json();
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
}))

export default useMensualidad;
