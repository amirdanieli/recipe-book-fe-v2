import { apiClient } from "./apiClient";
import type { LoginResponse, User } from "../utils/types";

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    return apiClient<LoginResponse>("/auth/admin/login", {
        method: "POST",
        body: { email, password },
    });
};

export const logout = async (): Promise<void> => {
  return apiClient("/auth/admin/logout", {
    method: "POST",
  });
};

export const verifySession = async (): Promise<User | null> => {
  try {
    const data = await apiClient<{ user: User }>("/auth/admin/verify");
    return data.user;
  } catch (error) {
    return null;
  }
};
