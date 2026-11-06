import { useCallback, useEffect, useMemo, useState } from "react";
import { logout as apiLogout, verifySession } from "../../services/authService";
import type { User } from "../../utils/types";
import type { AuthProviderLogic } from "./AuthProviderTypes";

export const useAuthProviderLogic = (): AuthProviderLogic => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    verifySession().then((sessionUser) => {
      if (!isActive) return;
      setUser(sessionUser);
      setIsLoading(false);
    });
    return () => {
      isActive = false;
    };
  }, []);

  const login = useCallback((loggedInUser: User) => setUser(loggedInUser), []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout request failed", error);
    } finally {
      // Always drop the local session so the UI never stays "logged in".
      setUser(null);
    }
  }, []);

  return useMemo(
    () => ({
      state: { user, isAdmin: user !== null, isLoading },
      actions: { login, logout },
    }),
    [user, isLoading, login, logout],
  );
};
