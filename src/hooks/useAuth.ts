import { useMutation, UseMutationResult } from "@tanstack/react-query";
import {
  AuthResponseDto,
  SignInDto,
} from "../screens/logged-out/SignIn/interface/auth";
import { authService } from "../screens/logged-out/SignIn/services/authService";
import { ApiError } from "../shared/interfaces/api";
import { useAuthStore } from "../store/authStore";

export const useSignIn = (): UseMutationResult<
  AuthResponseDto,
  ApiError,
  SignInDto
> => {
  const login = useAuthStore((state) => state.login);
  const setLoading = useAuthStore((state) => state.setLoading);

  return useMutation<AuthResponseDto, ApiError, SignInDto>({
    mutationFn: authService.signIn,
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

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);

  return () => {
    logout();
  };
};
