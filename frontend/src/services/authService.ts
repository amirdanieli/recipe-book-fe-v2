import { apiClient } from "./apiClient";
import type { LoginResponse, User } from "../utils/types";

export const login = (email: string, password: string): Promise<LoginResponse> =>
  apiClient<LoginResponse>("/auth/admin/login", {
    method: "POST",
    body: { email, password },
  });

export const logout = (): Promise<void> =>
  apiClient<void>("/auth/admin/logout", { method: "POST" });

/** Resolves to the logged-in admin, or null when there is no valid session. */
export const verifySession = async (): Promise<User | null> => {
  try {
    const data = await apiClient<{ user: User }>("/auth/admin/verify");
    return data.user;
  } catch {
    return null;
  }
};
