import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { SignIn } from "../interfaces/sign-in";
import { ApiError } from "../interfaces/api-error";
import { useAuthStore } from "../store/authStore";
import { AuthResponse } from "../interfaces/auth-response";
import { signIn } from "./services/signIn";

export const useAuth = (): UseMutationResult<
  AuthResponse,
  ApiError,
  SignIn
> => {
  const login = useAuthStore((state) => state.login);
  const setLoading = useAuthStore((state) => state.setLoading);

  return useMutation<AuthResponse, ApiError, SignIn>({
    mutationFn: signIn,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      login(data);
    },
    onError: () => {
      setLoading(false);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useAuthLogout = () => {
  const logout = useAuthStore((state) => state.logout);

  return () => {
    logout();
  };
};
