import { create } from "zustand";
import { Usuario } from "../types/usuario";
import { getTokenFromStorage } from "../utils/auth";
import { getUltimosMeses } from "../utils/fecha";

export interface loginUser {
  email: string;
  password: string;
}
 export interface HorasMes {
        mes: string;
        horas: number;
  }
interface StoreUserState {
  user: Usuario | null;
  usuarios: Usuario[];
  loading: boolean;
  error: string | null;
  login: (loginUser: loginUser) => Promise<Usuario>;
  setUser: (user: Usuario) => void;
  logout(): void;
  fetchUsuarios(): void;
  addUsuario: (usuario: Usuario) => void;
  update: (usuario: Usuario) => Promise<void>;
  remove: (id: number) => Promise<void>;
  fetchHorasMes: (idFuncionario: number) => Promise<HorasMes[] | undefined>;
}

const useUsersStore = create<StoreUserState>((set) => ({
  user: null,
  usuarios: [],
  loading: false,
  error: null,

  setUser: (user: Usuario) => set({ user }),
  login: async (cliente: loginUser) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Usuario/Login`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || ""}`,
        },
        body: JSON.stringify(cliente),
        redirect: "follow",
      });

      if (!response.ok) {
         const errorData = await response.json();
        throw new Error(errorData.message || "Login fallido");

        return;
      }
      set({ error: null, loading: false });
      const loginFuncionario = await response.json();
      localStorage.setItem("cuidarte_usuario", JSON.stringify({ token: loginFuncionario.token }));
      window.dispatchEvent(new Event("auth-change"));
      set({ user: loginFuncionario });
      return loginFuncionario;
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
        throw error;
      } else {
        set({ error: "Error en el login" });
      }
    }
  },

  logout: async () => {
    localStorage.removeItem("cuidarte_usuario");
    set({ user: null });
    window.dispatchEvent(new Event("auth-change"));
  },
  fetchUsuarios: async () => {
    set({ loading: true, error: null });
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Usuario/ObtenerTodos`,
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
        throw new Error(errorData.message || "Error al obtener funcionarios");
      }
      const data = await response.json();

      set({
        usuarios: data,
        loading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
  addUsuario: async (usuarioACrear: Usuario) => {
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Usuario/Crear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(usuarioACrear),
          redirect: "follow",
        }
      );
      if (!response.ok) {
         const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el funcionario");
      }
      const data = await response.json();
      set((state) => {
        const sinDuplicado = state.usuarios.filter(
          (usuario) => usuario.id !== data.id
        );
        return { usuarios: [...sinDuplicado, data] };
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
  update: async (user: Usuario) => {
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Usuario/Editar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_CUIDARTE_API_KEY || "",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user),
          redirect: "follow",
        }
      );
      if (!response.ok) {
         const errorData = await response.json();
        throw new Error(errorData.message || "Error al editar funcionario");
      }
      const data = await response.json();
      set((state) => ({
        usuarios: state.usuarios.map((user) =>
          user.id == data.id ? data : user
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
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Usuario/Eliminar`,
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
        throw new Error(errorData.message || "Error al eliminar funcionario");
      }
      set((state) => ({
        usuarios: state.usuarios.filter((usuario) => usuario.id !== id),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
  fetchHorasMes: async (idFuncionario: number) => {
    set({ loading: true, error: null });
    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CUIDARTE_API_URL}/Usuario/ObtenerHorasDelMes?idFuncionario=${idFuncionario}`,
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
      const horas = await response.json();
      const meses = getUltimosMeses(horas.length);

     

      const resumen: HorasMes[] = horas.map((h: number, i: number) => ({
        mes: meses[i],
        horas: h,
      }));

      return resumen;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error desconocido",
        loading: false,
      });
    }
  },
}));

export default useUsersStore;
