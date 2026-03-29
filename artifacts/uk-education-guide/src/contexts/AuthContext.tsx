import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { LoginModal } from "@/components/LoginModal";

export interface AuthUser {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  logout: async () => {},
  refetch: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const refetch = useCallback(() => {
    setIsLoading(true);
    fetch("/api/auth/user", { credentials: "include" })
      .then(r => (r.ok ? r.json() : { user: null }))
      .then(d => { setUser(d.user ?? null); setIsLoading(false); })
      .catch(() => { setUser(null); setIsLoading(false); });
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  const login = useCallback(() => setShowModal(true), []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout, refetch }}>
      {children}
      {showModal && (
        <LoginModal
          onClose={() => setShowModal(false)}
          onSuccess={(u) => { setUser(u); setShowModal(false); }}
        />
      )}
    </AuthContext.Provider>
  );
}
