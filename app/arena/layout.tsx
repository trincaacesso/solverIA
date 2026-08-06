import type { Metadata } from "next";
import { ArenaChrome } from "@/components/arena/dashboard-layout";
import { AuthProvider, RequireAuth } from "@/components/arena/auth-context";

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
      <div className="min-h-screen bg-arena-gradient bg-fixed font-sans text-arena-ink">
        <RequireAuth>
          <ArenaChrome>{children}</ArenaChrome>
        </RequireAuth>
      </div>
    </AuthProvider>
  );
}
