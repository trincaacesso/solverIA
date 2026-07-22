"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/components/arena/auth-context";

const inputClass =
  "w-full rounded-md border border-arena-border bg-arena-bg py-2.5 pl-10 pr-10 text-sm text-arena-ink outline-none transition-colors placeholder:text-arena-muted focus:border-arena-blue";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(username, password)) {
      setError("Login ou senha incorretos.");
      return;
    }
    router.replace("/arena/calendar");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-arena-bg p-4">
      <div className="w-full max-w-sm">
        {/* Marca */}
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-black shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-ctvh.png"
              alt="Logo CT VH Futevôlei"
              className="h-20 w-20 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </span>
          <h1 className="text-2xl font-bold text-arena-ink">CT VH Futevôlei</h1>
          <p className="mt-1 text-sm text-arena-muted">
            Entre para acessar o painel
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-xl border border-arena-border bg-arena-card p-6 shadow-xl"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-arena-ink">
                Login
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-arena-muted" />
                <input
                  autoFocus
                  className={inputClass}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  placeholder="Seu login"
                  autoComplete="username"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-arena-ink">
                Senha
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-arena-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  className={inputClass}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Sua senha"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-arena-muted hover:text-arena-ink"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-md bg-arena-red/10 px-3 py-2 text-sm font-medium text-arena-red">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-arena-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-arena-blue-dark active:scale-[0.98]"
            >
              <LogIn className="h-4 w-4" />
              Entrar
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-arena-muted">
          Alunos: use seu primeiro nome como login.
        </p>
      </div>
    </div>
  );
}
