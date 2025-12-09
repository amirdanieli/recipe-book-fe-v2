import {
  createContext,
  useState,
  type ReactNode,
  useContext,
  useEffect,
} from "react";
import { verifySession, logout as apiLogout } from "../services/authService";

interface AuthContextType {
  user: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (token: string, user: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await verifySession();
        if (data && data.user) {
          setUser(data.user);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (newUser: string) => {
    setUser(newUser);
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAdmin: !!user, isLoading, login, logout }}
    >
      {isLoading ? <div>Loading session...</div> : children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
