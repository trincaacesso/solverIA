"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROSTER } from "@/lib/arena-students";

export type Role = "admin" | "aluno";

export interface AuthUser {
  username: string;
  displayName: string;
  role: Role;
}

const STORAGE_KEY = "ctvh-auth";

/** minúsculas + sem acentos, para comparar logins. */
function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Valida credenciais.
 * Admin: vitorhugo / professorvitor.
 * Alunos: primeiro nome / primeironome123 (ex.: pedro / pedro123).
 */
export function authenticate(
  username: string,
  password: string,
): AuthUser | null {
  const u = normalize(username);
  if (u === "vitorhugo" && password === "professorvitor") {
    return { username: u, displayName: "Vitor Hugo", role: "admin" };
  }
  for (const entry of ROSTER) {
    const first = normalize(entry.name.split(" ")[0]);
    if (first === u && password === `${first}123`) {
      return { username: u, displayName: entry.name, role: "aluno" };
    }
  }
  return null;
}

interface AuthContextValue {
  user: AuthUser | null;
  /** false enquanto o localStorage ainda não foi lido. */
  ready: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      // sessão corrompida — ignora e exige novo login
    }
    setReady(true);
  }, []);

  const login = (username: string, password: string) => {
    const found = authenticate(username, password);
    if (!found) return false;
    setUser(found);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    router.replace("/arena/login");
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}

/**
 * Casca da área /arena: página de login renderiza sem sidebar;
 * o restante exige usuário autenticado.
 */
export function RequireAuth({
  children,
  loginPath = "/arena/login",
}: {
  children: ReactNode;
  loginPath?: string;
}) {
  const { user, ready } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === loginPath;

  useEffect(() => {
    if (!ready) return;
    if (!user && !isLoginPage) router.replace(loginPath);
    if (user && isLoginPage) router.replace("/arena/calendar");
  }, [ready, user, isLoginPage, router, loginPath]);

  if (isLoginPage) return <>{children}</>;
  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-arena-bg">
        <p className="text-sm text-arena-muted">Carregando...</p>
      </div>
    );
  }
  return <>{children}</>;
}
