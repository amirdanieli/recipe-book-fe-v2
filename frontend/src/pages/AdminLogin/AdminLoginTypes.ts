import type { FormEvent } from "react";

export interface AdminLoginState {
  email: string;
  password: string;
  errorMessage: string;
  isSubmitting: boolean;
  /** Already logged in: the page redirects instead of showing the form. */
  isAlreadyLoggedIn: boolean;
  /** Where to go after a successful login. */
  redirectTo: string;
}

export interface AdminLoginActions {
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface AdminLoginLogic {
  state: AdminLoginState;
  actions: AdminLoginActions;
}
