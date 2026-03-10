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

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { signInRequest, signUpRequest, signOutRequest } from "@/services/auth";
import type {
  AuthContextValue,
  AuthState,
  SignInPayload,
  SignUpPayload,
  User,
} from "@/services/auth";

// ─── Storage Keys ─────────────────────────────────────────────────────────────
// Uncomment and use tokenStorage from axiosClient when real API is ready
const USER_STORAGE_KEY = "quantexq_user";

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Rehydrate session on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        setState({ user, isAuthenticated: true, isLoading: false });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    } catch {
      setState((s) => ({ ...s, isLoading: false }));
    }
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

// ─── Hook ──────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
  return ctx;
};
