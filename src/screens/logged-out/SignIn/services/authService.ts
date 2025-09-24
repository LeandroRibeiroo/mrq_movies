import apiClient from "../../../../services/api";
import { AuthResponseDto, SignInDto } from "../interface/auth";

export const authService = {
  signIn: async (credentials: SignInDto): Promise<AuthResponseDto> => {
    const response = await apiClient.post<AuthResponseDto>(
      "/api/auth/signin",
      credentials
    );
    return response.data;
  },
};

export default authService;
