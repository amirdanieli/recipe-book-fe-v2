import type { ReactNode } from "react";
import type { User } from "../../utils/types";

export interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthState {
  user: User | null;
  isAdmin: boolean;
  /** True until the initial session check has finished. */
  isLoading: boolean;
}

export interface AuthActions {
  login: (user: User) => void;
  logout: () => Promise<void>;
}

/** Returned by useAuthProviderLogic() and exposed to consumers via useAuth(). */
export interface AuthProviderLogic {
  state: AuthState;
  actions: AuthActions;
}
