/**
 * Auth API Service
 *
 * Handles sign-in, sign-up, sign-out, and token refresh calls.
 * Real API calls are commented out — uncomment when the backend is ready.
 * The apiClient (axios instance w/ interceptors) is imported but commented
 * out; swap the mock Promise calls with apiClient calls when integrating.
 */

// import apiClient from "./axiosClient";
import type { AuthResponse, SignInPayload, SignUpPayload } from "./auth.types";

// ─── Sign In ──────────────────────────────────────────────────────────────────

export const signInRequest = async (
  payload: SignInPayload,
): Promise<AuthResponse> => {
  // TODO: Uncomment when real API is ready
  // const response = await apiClient.post<AuthResponse>(SERVER_ROUTES.AUTH.SIGN_IN, payload);
  // return response.data;

  // MOCK RESPONSE
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        payload.email === "operator@quantexq.com" &&
        payload.password === "password123"
      ) {
        resolve({
          success: true,
          data: {
            user: {
              id: "usr_001",
              email: payload.email,
              name: "QuantexQ Operator",
              role: "Systems Engineer",
              accessTier: 2,
            },
            tokens: {
              accessToken: "mock_access_token_xyz",
              refreshToken: "mock_refresh_token_xyz",
              expiresIn: 3600,
            },
          },
          message: "Signed in successfully",
        });
      } else {
        reject(new Error("Invalid email or password."));
      }
    }, 800);
  });
};

// ─── Sign Up ──────────────────────────────────────────────────────────────────

export const signUpRequest = async (
  payload: SignUpPayload,
): Promise<AuthResponse> => {
  // TODO: Uncomment when real API is ready
  // const response = await apiClient.post<AuthResponse>(SERVER_ROUTES.AUTH.SIGN_UP, payload);
  // return response.data;

  // MOCK RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          user: {
            id: "usr_" + Math.random().toString(36).slice(2, 8),
            email: payload.email,
            name: payload.name,
            role: "Field Engineer",
            accessTier: 1,
          },
          tokens: {
            accessToken: "mock_access_token_new",
            refreshToken: "mock_refresh_token_new",
            expiresIn: 3600,
          },
        },
        message: "Account created successfully",
      });
    }, 1000);
  });
};

// ─── Sign Out ────────────────────────────────────────────────────────────────

export const signOutRequest = async (): Promise<void> => {
  // TODO: Uncomment when real API is ready
  // await apiClient.post(SERVER_ROUTES.AUTH.SIGN_OUT);

  // MOCK: no-op
  return Promise.resolve();
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

// export const refreshTokenRequest = async (refreshToken: string) => {
//   const response = await apiClient.post<{ data: { accessToken: string } }>(
//     SERVER_ROUTES.AUTH.REFRESH,
//     { refreshToken }
//   );
//   return response.data;
// };
