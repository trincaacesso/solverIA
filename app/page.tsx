"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// A raiz abre o sistema Arena Futevôlei OS.
// A landing page do SolverIA continua disponível em /solveria.
//
// O redirect roda no cliente (e não com redirect() do next/navigation)
// porque o build estático do app mobile — output: "export" — não suporta
// redirect de Server Component.
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/arena/calendar");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-950">
      <p className="text-sm text-slate-400">Abrindo o CT VH...</p>
    </main>
  );
}
