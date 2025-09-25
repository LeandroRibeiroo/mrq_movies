import { SignIn } from "../../interfaces/sign-in";
import { AuthResponse } from "../../interfaces/auth-response";
import { apiClient } from "../../services/api";

const signIn = async (credentials: SignIn): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    "/api/auth/signin",
    credentials
  );
  return response.data;
};

export { signIn };
