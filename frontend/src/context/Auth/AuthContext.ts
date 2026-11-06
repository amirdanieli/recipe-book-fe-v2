import { createContext } from "react";
import type { AuthProviderLogic } from "./AuthProviderTypes";

// Kept in its own non-component module so React Fast Refresh keeps working.
export const AuthContext = createContext<AuthProviderLogic | undefined>(undefined);
