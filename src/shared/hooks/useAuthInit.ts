import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export const useAuthInit = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return { isLoading };
};
