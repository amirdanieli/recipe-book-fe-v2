import type { Location } from "react-router-dom";

/** Router state passed to /admin/login so it can send the user back. */
export interface RedirectState {
  from?: Location;
}

export interface RequireAuthState {
  isLoading: boolean;
  isAllowed: boolean;
  loginPath: string;
  redirectState: RedirectState;
}

export type RequireAuthActions = Record<string, never>;

export interface RequireAuthLogic {
  state: RequireAuthState;
  actions: RequireAuthActions;
}
