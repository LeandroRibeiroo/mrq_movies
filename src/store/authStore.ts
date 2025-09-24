import { create } from "zustand";
import { AuthResponseDto } from "../screens/logged-out/SignIn/interface/auth";
import { clearStorage, tokenStorage, userStorage } from "../services/storage";
import { AuthStore } from "./interfaces/auth-store";

export const useAuthStore = create<AuthStore>((set) => ({
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
