import { create } from "zustand";
import { clearSession, getTokenFromStorage } from "../utils/auth";

interface ExcelImportResult {
  rows: number;
  data: Record<string, unknown>[];
}

interface StoreExcelImportState {
  data: Record<string, unknown>[] | null;
  rowCount: number;
  loading: boolean;
  error: string | null;
  uploadExcel: (file: File) => Promise<void>;
  reset: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_CUIDARTE_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "";

const useExcelImport = create<StoreExcelImportState>((set) => ({
  data: null,
  rowCount: 0,
  loading: false,
  error: null,

  uploadExcel: async (file: File) => {
    set({ loading: true, error: null });
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE}/Excel/Importar`, {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 401) {
        clearSession();
        set({ error: "Sesión expirada", loading: false });
        throw new Error("Sesión expirada, vuelva a iniciar sesión");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result: ExcelImportResult = await response.json();

      set({
        data: result.data,
        rowCount: result.rows,
        loading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
      throw err;
    }
  },

  reset: () => set({ data: null, rowCount: 0, error: null }),
}));

export default useExcelImport;