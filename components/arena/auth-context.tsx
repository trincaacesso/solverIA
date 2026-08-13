"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase, emailFromUsername, setRemember } from "@/lib/supabase";

export type Role = "admin" | "aluno";

export interface AuthUser {
  /** uuid do Supabase — usado nas consultas e nas regras de RLS. */
  id: string;
  username: string;
  displayName: string;
  role: Role;
  turma: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  /** false enquanto a sessão ainda não foi lida. */
  ready: boolean;
  /** remember=true mantém a sessão depois de fechar o app/navegador. */
  login: (
    username: string,
    password: string,
    remember?: boolean,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Busca o cadastro do CT (nome, turma, cargo) para o usuário logado.
 *
 * O cargo vem SEMPRE da tabela profiles, nunca do user_metadata: o
 * próprio usuário consegue editar o próprio metadata pela API, então
 * usá-lo para autorização deixaria qualquer aluno virar admin. A tabela
 * profiles só o admin escreve — é o que as policies de RLS conferem.
 */
async function loadProfile(userId: string): Promise<AuthUser | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, role, turma")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    username: data.username,
    displayName: data.full_name,
    role: data.role as Role,
    turma: data.turma ?? "—",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let alive = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!alive) return;
      if (data.session) {
        const profile = await loadProfile(data.session.user.id);
        if (alive) setUser(profile);
      }
      if (alive) setReady(true);
    });

    // Mantém o app em dia quando o token é renovado ou a sessão expira.
    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!alive) return;
        setUser(session ? await loadProfile(session.user.id) : null);
      },
    );

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(
    async (username: string, password: string, remember = false) => {
      setRemember(remember); // precisa vir antes: define onde a sessão é gravada

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailFromUsername(username),
        password,
      });
      if (error || !data.user) return false;

      setUser(await loadProfile(data.user.id));
      return true;
    },
    [],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.replace("/arena/login");
  }, [router]);

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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-arena-muted">Carregando...</p>
      </div>
    );
  }
  return <>{children}</>;
}

/**
 * Envolve as telas que só o professor pode ver.
 *
 * Isto é conveniência de interface, NÃO segurança: quem protege os dados
 * são as policies de RLS no banco. Mesmo que alguém burlasse este
 * componente, as consultas voltariam vazias.
 */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user && user.role !== "admin") {
      router.replace("/arena/calendar");
    }
  }, [ready, user, router]);

  if (!ready || user?.role !== "admin") return null;
  return <>{children}</>;
}
