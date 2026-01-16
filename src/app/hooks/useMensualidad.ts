"use client";
import { create } from "zustand";
import { getTokenFromStorage } from "../utils/auth";
import { Mensualidad } from "../types/suscripcion";

interface StoreMensualidadState {  
  loading: boolean;
  error: string | null;
  pagarMensualidad: (idSuscripcion: number,idCliente :number) => void;
  pagarMensualidadEmpresa: (idSuscripcion: number) => void;
  fetchMensualidad: (idSuscripcion: number,idCliente: number) => Promise<Mensualidad[] | undefined>;
}

const useMensualidad = create<StoreMensualidadState>((set) => ({
  loading: false,
  error: null,
  pagarMensualidad: async (idSuscripcion: number,idCliente? :number) => {
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Mensualidad/Pagar?idSuscripcion=${idSuscripcion}&idCliente=${idCliente}`,
        {
          method: "POST",
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
  pagarMensualidadEmpresa: async (idSuscripcion: number) => {
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Mensualidad/PagarEmpresa?idSuscripcion=${idSuscripcion}`,
        {
          method: "POST",
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
   fetchMensualidad: async (idSuscripcion: number,idCliente: number) => {
      set({ loading: true, error: null });
      try {
        const token = getTokenFromStorage();
        if (!token) throw new Error("Usuario no autenticado");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Mensualidad/ObtenerTodos?idSuscripcion=${idSuscripcion}&idCliente=${idCliente}`,
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
          throw new Error(errorData.message || "Error al obtener mensualidades");
        }
        return await response.json();

        
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : "Error desconocido",
          loading: false,
        });
      }
    },
}))

export default useMensualidad;
