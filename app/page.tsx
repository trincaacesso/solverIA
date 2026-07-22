import { redirect } from "next/navigation";

// A raiz agora abre o sistema Arena Futevôlei OS.
// A landing page do SolverIA continua disponível em /solveria.
export default function Home() {
  redirect("/arena/calendar");
}
