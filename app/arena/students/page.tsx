"use client";

import { useState } from "react";
import { Search, UserPlus, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "Ativo" | "Inadimplente" | "Inativo";
type Plan = "Mensal" | "Trimestral" | "Anual" | "Avulso";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: Plan;
  level: string;
  status: Status;
  since: string;
}

// Turma atribuída a partir das listas de treino; "—" = a definir.
// Contato e plano ainda não informados (plano padrão: Mensal).
function aluno(id: number, name: string, level: string): Student {
  return {
    id: String(id),
    name,
    email: "",
    phone: "",
    plan: "Mensal",
    level,
    status: "Ativo",
    since: "—",
  };
}

const students: Student[] = [
  aluno(1, "Acacio", "Pré-Elite"),
  aluno(2, "Aline", "Iniciante"),
  aluno(3, "Amanda Pereira", "Iniciante"),
  aluno(4, "Ana Beatriz", "Aprendiz"),
  aluno(5, "Ana Clara", "Iniciante"),
  aluno(6, "Ana Luisa", "Iniciante"),
  aluno(7, "Anderson Luis", "—"),
  aluno(8, "Andressa Gomes", "—"),
  aluno(9, "Anna Julia", "Iniciante"),
  aluno(10, "Bernardo Duarte", "Elite B"),
  aluno(11, "Brendon", "Iniciante"),
  aluno(12, "Camila Rodrigues", "Feminino Avançado"),
  aluno(13, "Cecilia Gramschelli", "Feminino"),
  aluno(14, "Cindya", "Aprendiz"),
  aluno(15, "Clarckson Marques", "Iniciante"),
  aluno(16, "Daniel Alves", "—"),
  aluno(17, "Daniel Lages", "—"),
  aluno(18, "Daniel Silva Baia", "Pré-Elite"),
  aluno(19, "David Madalena", "—"),
  aluno(20, "David Silva", "Elite B"),
  aluno(21, "Eduarda Marques", "Aprendiz"),
  aluno(22, "Enzo Felipe", "Elite B"),
  aluno(23, "Enzo Neves", "Pré-Elite"),
  aluno(24, "Ericky", "Elite B"),
  aluno(25, "Francielle", "Feminino Avançado"),
  aluno(26, "Gabriel Avelino (Caixa)", "Iniciante"),
  aluno(27, "Giovanna Teixeira", "—"),
  aluno(28, "Guilherme Almeida", "Aprendiz"),
  aluno(29, "Guilherme Pereira", "—"),
  aluno(30, "Hugo Oliveira", "Aprendiz"),
  aluno(31, "Jotinha", "Aprendiz"),
  aluno(32, "Karla Thais", "Iniciante"),
  aluno(33, "Kauã Martins", "Elite B"),
  aluno(34, "Lara Grazielle", "Aprendiz"),
  aluno(35, "Laura", "—"),
  aluno(36, "Livia Eduarda", "Aprendiz"),
  aluno(37, "Mariana Fagundes", "Feminino Avançado"),
  aluno(38, "Nicolas Taylor", "Iniciante"),
  aluno(39, "Pedro Dias", "Pré-Elite"),
  aluno(40, "Pedro Henrique", "Aprendiz"),
  aluno(41, "Phillip Maximo", "—"),
  aluno(42, "Ruivo", "Aprendiz"),
  aluno(43, "Ryan Pablo", "—"),
  aluno(44, "Victor Gabriel", "Elite B"),
  aluno(45, "Vinicius Lacerda", "Elite B"),
  aluno(46, "Yasmin Lawrence", "Feminino Avançado"),
  aluno(47, "Yasmin Silva", "Aprendiz"),
  aluno(48, "Yuri Victor", "—"),
];

const statusStyles: Record<Status, string> = {
  Ativo: "bg-arena-green/15 text-arena-green",
  Inadimplente: "bg-arena-orange/15 text-arena-orange",
  Inativo: "bg-arena-muted/15 text-arena-muted",
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function StudentsPage() {
  const [query, setQuery] = useState("");

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
  );

  const stats = [
    { label: "Total de Alunos", value: students.length },
    { label: "Ativos", value: students.filter((s) => s.status === "Ativo").length },
    { label: "Inadimplentes", value: students.filter((s) => s.status === "Inadimplente").length },
    { label: "Inativos", value: students.filter((s) => s.status === "Inativo").length },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-arena-ink sm:text-3xl">
            Gestão de Alunos
          </h1>
          <p className="mt-1 text-sm text-arena-muted">
            Acompanhe matrículas, planos e status dos alunos.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-arena-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-arena-blue-dark active:scale-95">
          <UserPlus className="h-5 w-5" />
          Novo Aluno
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-arena-border bg-arena-card p-4 shadow-sm"
          >
            <p className="text-sm text-arena-muted">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-arena-ink">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-arena-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar aluno pelo nome..."
          className="w-full rounded-md border border-arena-border bg-arena-card py-2 pl-9 pr-3 text-sm text-arena-ink outline-none transition-colors placeholder:text-arena-muted focus:border-arena-blue"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-arena-border bg-arena-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-arena-border bg-arena-bg text-xs uppercase tracking-wide text-arena-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Aluno</th>
                <th className="px-4 py-3 font-semibold">Contato</th>
                <th className="px-4 py-3 font-semibold">Plano</th>
                <th className="px-4 py-3 font-semibold">Turma</th>
                <th className="px-4 py-3 font-semibold">Desde</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-arena-border">
              {filtered.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-arena-bg">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-arena-blue/10 text-xs font-semibold text-arena-blue">
                        {initials(s.name)}
                      </span>
                      <span className="font-medium text-arena-ink">
                        {s.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {s.phone || s.email ? (
                      <>
                        {s.phone && (
                          <p className="flex items-center gap-1.5 text-arena-muted">
                            <Phone className="h-3.5 w-3.5" /> {s.phone}
                          </p>
                        )}
                        {s.email && (
                          <p className="flex items-center gap-1.5 text-arena-muted">
                            <Mail className="h-3.5 w-3.5" /> {s.email}
                          </p>
                        )}
                      </>
                    ) : (
                      <span className="text-arena-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-arena-ink">{s.plan}</td>
                  <td className="px-4 py-3 text-arena-ink">{s.level}</td>
                  <td className="px-4 py-3 text-arena-muted">{s.since}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        statusStyles[s.status],
                      )}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-arena-muted"
                  >
                    Nenhum aluno encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
