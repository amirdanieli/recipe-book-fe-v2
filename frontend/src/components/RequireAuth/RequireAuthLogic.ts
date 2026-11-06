import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { RequireAuthLogic } from "./RequireAuthTypes";

export const useRequireAuthLogic = (): RequireAuthLogic => {
  const { state: auth } = useAuth();
  const location = useLocation();

  return {
    state: {
      isLoading: auth.isLoading,
      isAllowed: auth.isAdmin,
      loginPath: "/admin/login",
      redirectState: { from: location },
    },
    actions: {},
  };
};
