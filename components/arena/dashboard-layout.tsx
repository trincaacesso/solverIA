"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  Users,
  Settings,
  Menu,
  X,
  Search,
  Zap,
  BarChart3,
  Newspaper,
  LogOut,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/arena/auth-context";
import { getUnseenPosts, FEED_SEEN_EVENT } from "@/lib/arena-feed";

/** Quantos posts do Feed o usuário logado ainda não viu (atualiza ao visitar o Feed). */
function useFeedUnseenCount() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!user) {
      setCount(0);
      return;
    }
    const compute = () => setCount(getUnseenPosts(user.username).length);
    compute();
    window.addEventListener(FEED_SEEN_EVENT, compute);
    return () => window.removeEventListener(FEED_SEEN_EVENT, compute);
  }, [user]);
  return count;
}

const navigation = [
  { name: "Calendário de Aulas", href: "/arena/calendar", icon: CalendarDays, adminOnly: false },
  { name: "Feed", href: "/arena/feed", icon: Newspaper, adminOnly: false },
  { name: "Gestão de Alunos", href: "/arena/students", icon: Users, adminOnly: true },
  { name: "Relatório Mensal", href: "/arena/report", icon: BarChart3, adminOnly: true },
  { name: "CEFFLASH", href: "/arena/cefflash", icon: Zap, adminOnly: false },
  { name: "Configurações", href: "/arena/settings", icon: Settings, adminOnly: true },
];

// Recriação em SVG da logo VH (raio entre o V e o H, roxo sobre preto).
// Usada enquanto public/logo-ctvh.png não existir.
function LogoVH() {
  return (
    <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden="true">
      <rect width="64" height="64" rx="12" fill="#050308" />
      <text
        x="5"
        y="45"
        fontFamily="Arial Black, Arial, sans-serif"
        fontStyle="italic"
        fontWeight="900"
        fontSize="34"
        fill="#7c3aed"
      >
        V
      </text>
      <text
        x="31"
        y="45"
        fontFamily="Arial Black, Arial, sans-serif"
        fontStyle="italic"
        fontWeight="900"
        fontSize="34"
        fill="#8b5cf6"
      >
        H
      </text>
      <polygon
        points="38,8 26,32 32,32 27,56 42,29 35,29"
        fill="#8b5cf6"
        stroke="#050308"
        strokeWidth="1.5"
      />
      <path
        d="M10 53 H54"
        stroke="#7c3aed"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Brand() {
  // Logo oficial em public/logo-ctvh.png; se ausente, usa a versão SVG.
  const [logoFailed, setLogoFailed] = useState(false);
  return (
    <div className="flex items-center gap-2.5">
      {logoFailed ? (
        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-black">
          <LogoVH />
        </span>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-ctvh.png"
            alt="Logo CT VH Futevôlei"
            className="h-9 w-9 object-cover"
            onError={() => setLogoFailed(true)}
          />
        </span>
      )}
      <span className="text-base font-bold leading-tight text-arena-ink">
        CT VH
        <span className="block text-xs font-medium text-arena-muted">
          Futevôlei
        </span>
      </span>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const feedUnseen = useFeedUnseenCount();
  const items = navigation.filter(
    (item) => !item.adminOnly || user?.role === "admin",
  );
  return (
    <nav className="flex-1 space-y-1 px-2 py-4">
      {items.map((item) => {
        const active = pathname === item.href;
        const badge = item.href === "/arena/feed" ? feedUnseen : 0;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-arena-blue text-white shadow-sm"
                : "text-arena-ink hover:bg-arena-blue/10 hover:text-arena-blue",
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
            {badge > 0 && (
              <span
                className={cn(
                  "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold",
                  active ? "bg-white text-arena-blue" : "bg-arena-red text-white",
                )}
              >
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Casca visual da área /arena: página de login sem sidebar,
 * demais páginas com o dashboard completo.
 */
export function ArenaChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/arena/login") return <>{children}</>;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function userInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const feedUnseen = useFeedUnseenCount();
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-arena-bg text-arena-ink">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r border-arena-border bg-arena-card shadow-sm md:flex">
        <div className="flex h-16 items-center border-b border-arena-border px-4">
          <Brand />
        </div>
        <NavLinks />
      </aside>

      {/* Mobile drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-arena-card shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-arena-border px-4">
              <Brand />
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-md p-1.5 text-arena-muted hover:bg-arena-bg"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks onNavigate={() => setIsSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-arena-border bg-arena-card px-4 shadow-sm">
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-md p-2 text-arena-ink transition-transform duration-200 hover:scale-110 active:scale-95"
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-base font-semibold text-arena-ink">
              CT VH Futevôlei
            </span>
          </div>

          <div className="hidden flex-1 justify-center px-4 md:flex">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-arena-muted" />
              <input
                type="search"
                placeholder="Buscar alunos, aulas..."
                className="w-full rounded-md border border-arena-border bg-arena-bg py-2 pl-9 pr-3 text-sm text-arena-ink outline-none transition-colors placeholder:text-arena-muted focus:border-arena-blue focus:bg-arena-bg"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/arena/feed")}
              className="relative rounded-md p-2 text-arena-muted transition-colors hover:bg-arena-blue/10 hover:text-arena-blue"
              aria-label={
                feedUnseen > 0
                  ? `${feedUnseen} novidades no Feed`
                  : "Notificações"
              }
              title="Novidades do Feed"
            >
              <Bell className="h-5 w-5" />
              {feedUnseen > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-arena-red px-1 text-[10px] font-bold text-white">
                  {feedUnseen}
                </span>
              )}
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-arena-ink">
                {user?.displayName ?? ""}
              </p>
              <p className="text-xs text-arena-muted">
                {user?.role === "admin" ? "Administrador" : "Aluno"}
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-arena-blue text-sm font-semibold text-white">
              {user ? userInitials(user.displayName) : "?"}
            </span>
            <button
              onClick={logout}
              className="rounded-md p-2 text-arena-muted transition-colors hover:bg-arena-red/10 hover:text-arena-red"
              aria-label="Sair"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
