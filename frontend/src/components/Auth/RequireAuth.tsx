import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../Loader/LoadingSpinner";

const RequireAuth = () => {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
