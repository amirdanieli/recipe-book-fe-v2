import { useContext } from "react";
import { AuthContext } from "../context/Auth/AuthContext";
import type { AuthProviderLogic } from "../context/Auth/AuthProviderTypes";

/** Returns `{ state, actions }` for the current admin session. */
export const useAuth = (): AuthProviderLogic => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
