import { AuthResponseDto } from "../../screens/logged-out/SignIn/interface/auth";

export interface AuthActions {
  login: (authData: AuthResponseDto) => void;
  logout: () => void;
  initializeAuth: () => void;
  setLoading: (loading: boolean) => void;
}
