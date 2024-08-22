import { Profile, Token } from "@/types/api";
import { create } from "zustand";
import client from "@/api/request";
import { getProfile } from "@/api/profile";

interface AuthState {
  token: Token | null;
  authenticated: boolean;
  profile: Profile | null;
  setToken: (token: Token) => void;
  loadAuth: () => void;
  loadProfile: () => void;
  updateMyProfile: (profile: Profile) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()((set, get) => ({
  token: null,
  authenticated: false,
  profile: null,
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

    get().loadProfile();
  },
  loadAuth: () => {
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

      get().loadProfile();
    }
  },
  loadProfile: async () => {
    try {
      const res = await getProfile();
      if (res.status === 200 && res.data) {
        set({ profile: res.data.data });
      }
    } catch (error) {
      console.error(error);
    }
  },
  updateMyProfile: (profile) => {
    set({ profile });
  },
  clearAuth: () => {
    localStorage.removeItem("token");
    set({ token: null, authenticated: false, profile: null });
  },
}));

export default useAuthStore;
