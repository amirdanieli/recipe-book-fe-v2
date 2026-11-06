import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useRequireAuthLogic } from "./RequireAuthLogic";

const RequireAuth = () => {
  const { state } = useRequireAuthLogic();

  if (state.isLoading) return <LoadingSpinner fullPage label="Checking your session…" />;

  if (!state.isAllowed) {
    return <Navigate to={state.loginPath} replace state={state.redirectState} />;
  }

  return <Outlet />;
};

export default RequireAuth;
