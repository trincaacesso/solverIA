"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Mesmo motivo de app/page.tsx: redirect no cliente para não quebrar
// o build estático (output: "export") usado pelo app mobile.
export default function ArenaIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/arena/calendar");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-arena-muted">Carregando...</p>
    </div>
  );
}
