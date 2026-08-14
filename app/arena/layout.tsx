import type { Metadata } from "next";
import { ArenaChrome } from "@/components/arena/dashboard-layout";
import { AuthProvider, RequireAuth } from "@/components/arena/auth-context";
import { NativeShell } from "@/components/arena/native-shell";
import { InstalarApp } from "@/components/arena/instalar-app";

export const metadata: Metadata = {
  title: "CT VH Futevôlei",
  description: "Sistema de gestão do CT VH — futevôlei.",
};

export default function ArenaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <NativeShell />
      <div className="min-h-screen bg-arena-gradient bg-fixed font-sans text-arena-ink">
        <RequireAuth>
          <ArenaChrome>{children}</ArenaChrome>
          <InstalarApp />
        </RequireAuth>
      </div>
    </AuthProvider>
  );
}
