import { AuthContext } from "./AuthContext";
import { useAuthProviderLogic } from "./AuthProviderLogic";
import type { AuthProviderProps } from "./AuthProviderTypes";

const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuthProviderLogic();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
