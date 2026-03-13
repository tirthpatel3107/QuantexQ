/**
 * Auth Context
 *
 * Provides global authentication state (user, isAuthenticated, isLoading)
 * and exposes signIn / signUp / signOut actions.
 *
 * Token persistence is currently handled with localStorage (mock).
 * When the real API is integrated, uncomment the tokenStorage calls
 * in auth.api.ts and axiosClient.ts.
 */

import { useCallback, useEffect, useState } from "react";
import { signInRequest, signUpRequest, signOutRequest } from "@/services/auth";
import type {
  AuthProviderProps,
  AuthState,
  SignInPayload,
  SignUpPayload,
  User,
} from "./types";
import { USER_STORAGE_KEY } from "./constants";
import { AuthContext } from "./context";

// ─── Provider ────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Rehydrate session on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          const user: User = JSON.parse(storedUser);
          return { user, isAuthenticated: true, isLoading: false };
        } else {
          return { user: null, isAuthenticated: false, isLoading: false };
        }
      } catch {
        return { user: null, isAuthenticated: false, isLoading: false };
      }
    };

    // Use a timeout to avoid direct setState in effect
    const timeoutId = setTimeout(() => {
      setState(initializeAuth());
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // ─── Sign In ───────────────────────────────────────────────────────────────

  const signIn = useCallback(async (payload: SignInPayload) => {
    const response = await signInRequest(payload);
    const { user } = response.data;
    // TODO: store tokens via tokenStorage when real API is ready
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  // ─── Sign Up ──────────────────────────────────────────────────────────────

  const signUp = useCallback(async (payload: SignUpPayload) => {
    const response = await signUpRequest(payload);
    const { user } = response.data;
    // TODO: store tokens via tokenStorage when real API is ready
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  // ─── Sign Out ─────────────────────────────────────────────────────────────

  const signOut = useCallback(() => {
    signOutRequest();
    // TODO: also call tokenStorage.clearAll() when real API is ready
    localStorage.removeItem(USER_STORAGE_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
