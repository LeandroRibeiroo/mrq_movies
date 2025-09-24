import { create } from "zustand";
import { clearStorage, tokenStorage, userStorage } from "../services/storage";
import { AuthResponseDto } from "../types/api";

interface User {
  id: string;
  username: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthActions {
  login: (authData: AuthResponseDto) => void;
  logout: () => void;
  initializeAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export interface AuthStore extends AuthState, AuthActions {}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true,

  login: (authData: AuthResponseDto) => {
    const { access_token, user } = authData;

    tokenStorage.setToken(access_token);
    userStorage.setUser(user);

    set({
      isAuthenticated: true,
      user,
      token: access_token,
      isLoading: false,
    });
  },

  logout: () => {
    clearStorage();

    set({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
    });
  },

  initializeAuth: () => {
    try {
      const token = tokenStorage.getToken();
      const user = userStorage.getUser();

      if (token && user) {
        set({
          isAuthenticated: true,
          user,
          token,
          isLoading: false,
        });
      } else {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      });
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
