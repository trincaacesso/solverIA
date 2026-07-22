import type { Metadata } from "next";
import { DashboardLayout } from "@/components/arena/dashboard-layout";

export const metadata: Metadata = {
  title: "CT VH Futevôlei",
  description: "Sistema de gestão do CT VH — futevôlei.",
};

export default function ArenaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
