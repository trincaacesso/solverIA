import type { Metadata } from "next";
import { DashboardLayout } from "@/components/arena/dashboard-layout";

export const metadata: Metadata = {
  title: "Arena Futevôlei OS",
  description: "Sistema de gestão para arenas de futevôlei.",
};

export default function ArenaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
