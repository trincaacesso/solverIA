"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Users,
  DollarSign,
  Settings,
  Menu,
  X,
  Search,
  Trophy,
  Zap,
  BarChart3,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Calendário de Aulas", href: "/arena/calendar", icon: CalendarDays },
  { name: "Feed", href: "/arena/feed", icon: Newspaper },
  { name: "Gestão de Alunos", href: "/arena/students", icon: Users },
  { name: "Financeiro", href: "/arena/finance", icon: DollarSign },
  { name: "Relatório Mensal", href: "/arena/report", icon: BarChart3 },
  { name: "CEFFLASH", href: "/arena/cefflash", icon: Zap },
  { name: "Configurações", href: "/arena/settings", icon: Settings },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-arena-blue text-white">
        <Trophy className="h-5 w-5" />
      </span>
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
  return (
    <nav className="flex-1 space-y-1 px-2 py-4">
      {navigation.map((item) => {
        const active = pathname === item.href;
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
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-arena-ink">
                Admin
              </p>
              <p className="text-xs text-arena-muted">Gestor da Arena</p>
            </div>
            <span className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-arena-blue text-sm font-semibold text-white transition-transform duration-200 hover:scale-110">
              AD
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
