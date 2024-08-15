import { Token } from "@/types/api";
import { create } from "zustand";
import client from "@/api/request";

interface AuthState {
  token: Token | null;
  authenticated: boolean;
  setToken: (token: Token) => void;
  removeToken: () => void;
  loadAuth: () => void;
}

const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  authenticated: false,
  setToken: (token) => {
    localStorage.setItem("token", JSON.stringify(token));
    set({ token, authenticated: true });

    client.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  },
  removeToken: () => {
    localStorage.removeItem("token");
    set({ token: null, authenticated: false });
  },
  loadAuth: () => {
    console.log("loadAuth");

    const tokenStr = localStorage.getItem("token");
    if (tokenStr) {
      const token = JSON.parse(tokenStr) as Token;
      set({ token, authenticated: true });

      client.interceptors.request.use(
        (config) => {
          if (token) {
            config.headers.Authorization = `Bearer ${token.accessToken}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    }
  },
}));

export default useAuthStore;
