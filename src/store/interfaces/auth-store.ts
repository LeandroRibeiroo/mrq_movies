import { AuthActions } from "./auth-actions";
import { AuthState } from "./auth-state";

export interface AuthStore extends AuthState, AuthActions {}
