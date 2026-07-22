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
      <RequireAuth>
        <ArenaChrome>{children}</ArenaChrome>
      </RequireAuth>
    </AuthProvider>
  );
}
