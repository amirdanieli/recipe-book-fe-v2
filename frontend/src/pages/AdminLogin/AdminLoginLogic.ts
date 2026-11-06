import { useCallback, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { RedirectState } from "../../components/RequireAuth/RequireAuthTypes";
import { useAuth } from "../../hooks/useAuth";
import { ApiError } from "../../services/apiClient";
import { login as apiLogin } from "../../services/authService";
import type { AdminLoginLogic } from "./AdminLoginTypes";

export const useAdminLoginLogic = (): AdminLoginLogic => {
  const { state: auth, actions: authActions } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If RequireAuth sent us here, go back to the page the admin wanted.
  const from = (location.state as RedirectState | null)?.from;
  const redirectTo = from ? `${from.pathname}${from.search}` : "/";

  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmitting) return;
      setErrorMessage("");
      setIsSubmitting(true);

      try {
        const { user } = await apiLogin(email.trim(), password);
        authActions.login(user);
        navigate(redirectTo, { replace: true });
      } catch (err) {
        const isBadCredentials =
          err instanceof ApiError && (err.status === 401 || err.status === 403);
        setErrorMessage(
          isBadCredentials
            ? "Invalid email or password."
            : "Couldn't reach the server. Please try again.",
        );
        setIsSubmitting(false);
      }
    },
    [email, password, isSubmitting, authActions, navigate, redirectTo],
  );

  return {
    state: {
      email,
      password,
      errorMessage,
      isSubmitting,
      isAlreadyLoggedIn: auth.isAdmin && !isSubmitting,
      redirectTo,
    },
    actions: { setEmail, setPassword, submit },
  };
};
