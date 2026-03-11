import type { ReactNode } from "react";
import type {
  AuthContextValue,
  AuthState,
  SignInPayload,
  SignUpPayload,
  User,
} from "@/services/auth";

export type { AuthContextValue, AuthState, SignInPayload, SignUpPayload, User };

export interface AuthProviderProps {
  children: ReactNode;
}