"use client";

import { useState } from "react";
import { Search, UserPlus, Phone, Mail, Pencil, X, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROSTER } from "@/lib/arena-students";
import { useAuth } from "@/components/arena/auth-context";

type Status = "Ativo" | "Inadimplente" | "Inativo";
type Plan =
  | "Mensal"
  | "Trimestral"
  | "Semestral"
  | "Anual"
  | "Passe Livre"
  | "Avulso";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: Plan;
  level: string; // turma
  aulas: number; // quantidade de aulas por semana
  status: Status;
}

const PLANS: Plan[] = [
  "Mensal",
  "Trimestral",
  "Semestral",
  "Anual",
  "Passe Livre",
  "Avulso",
];
const STATUSES: Status[] = ["Ativo", "Inadimplente", "Inativo"];
const TURMAS = [
  "—",
  "Iniciante",
  "Aprendiz",
  "Pré-Elite",
  "Elite B",
  "Feminino",
  "Feminino Avançado",
];

// Roster compartilhado (lib/arena-students.ts) — também usado no login.
// Contato ainda não informado (plano padrão: Mensal).
const initialStudents: Student[] = ROSTER.map((entry, i) => ({
  id: String(i + 1),
  name: entry.name,
  email: "",
  phone: "",
  plan: "Mensal",
  level: entry.turma,
  aulas: 2,
  status: "Ativo",
}));

const statusStyles: Record<Status, string> = {
  Ativo: "bg-arena-green/15 text-arena-green",
  Inadimplente: "bg-arena-orange/15 text-arena-orange",
  Inativo: "bg-arena-muted/15 text-arena-muted",
};

const inputClass =
  "w-full rounded-md border border-arena-border bg-arena-bg px-3 py-2 text-sm text-arena-ink outline-none transition-colors placeholder:text-arena-muted focus:border-arena-blue";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

interface StudentForm {
  name: string;
  phone: string;
  email: string;
  plan: Plan;
  level: string;
  aulas: string;
  status: Status;
}

const emptyForm: StudentForm = {
  name: "",
  phone: "",
  email: "",
  plan: "Mensal",
  level: "—",
  aulas: "2",
  status: "Ativo",
};

export default function StudentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [query, setQuery] = useState("");
  // editingId: null = modal fechado, "new" = novo aluno, senão = id em edição.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<StudentForm>(emptyForm);
  const [error, setError] = useState("");
  const [nextId, setNextId] = useState(100);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
  );

  const stats = [
    { label: "Total de Alunos", value: students.length },
    { label: "Ativos", value: students.filter((s) => s.status === "Ativo").length },
    { label: "Inadimplentes", value: students.filter((s) => s.status === "Inadimplente").length },
    { label: "Inativos", value: students.filter((s) => s.status === "Inativo").length },
  ];

  const openNew = () => {
    setForm(emptyForm);
    setError("");
    setEditingId("new");
  };

  const openEdit = (s: Student) => {
    setForm({
      name: s.name,
      phone: s.phone,
      email: s.email,
      plan: s.plan,
      level: s.level,
      aulas: String(s.aulas),
      status: s.status,
    });
    setError("");
    setEditingId(s.id);
  };

  const save = () => {
    const name = form.name.trim();
    if (!name) {
      setError("Informe o nome do aluno.");
      return;
    }
    const data = {
      name,
      phone: form.phone.trim(),
      email: form.email.trim(),
      plan: form.plan,
      level: form.level,
      aulas: Math.max(0, parseInt(form.aulas, 10) || 0),
      status: form.status,
    };
    if (editingId === "new") {
      setStudents((prev) => [...prev, { id: String(nextId), ...data }]);
      setNextId((n) => n + 1);
    } else {
      setStudents((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...data } : s)),
      );
    }
    setEditingId(null);
  };

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
        {isAdmin && (
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-md bg-arena-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-arena-blue-dark active:scale-95"
          >
            <UserPlus className="h-5 w-5" />
            Novo Aluno
          </button>
        )}
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
                <th className="px-4 py-3 font-semibold">Aulas</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                {isAdmin && <th className="px-4 py-3 font-semibold">Ações</th>}
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
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-arena-blue/10 px-2.5 py-0.5 text-xs font-semibold text-arena-blue">
                      {s.aulas}x/semana
                    </span>
                  </td>
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
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openEdit(s)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-arena-border px-2.5 py-1.5 text-xs font-semibold text-arena-ink transition-colors hover:border-arena-blue hover:text-arena-blue"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={isAdmin ? 7 : 6}
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

      {/* Student modal (novo / edição) */}
      {isAdmin && editingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setEditingId(null)}
          />
          <div className="relative w-full max-w-md rounded-xl border border-arena-border bg-arena-card p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-arena-ink">
                {editingId === "new" ? "Novo Aluno" : "Editar Aluno"}
              </h2>
              <button
                onClick={() => setEditingId(null)}
                className="rounded-md p-1.5 text-arena-muted hover:bg-arena-bg"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-arena-ink">
                  Nome
                </label>
                <input
                  autoFocus
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome do aluno"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-arena-ink">
                    Telefone
                  </label>
                  <input
                    className={inputClass}
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="(31) 90000-0000"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-arena-ink">
                    E-mail
                  </label>
                  <input
                    type="email"
                    className={inputClass}
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="aluno@email.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-arena-ink">
                    Plano
                  </label>
                  <select
                    className={inputClass}
                    value={form.plan}
                    onChange={(e) =>
                      setForm({ ...form, plan: e.target.value as Plan })
                    }
                  >
                    {PLANS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-arena-ink">
                    Turma
                  </label>
                  <select
                    className={inputClass}
                    value={form.level}
                    onChange={(e) =>
                      setForm({ ...form, level: e.target.value })
                    }
                  >
                    {TURMAS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-arena-ink">
                    Aulas por semana
                  </label>
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    value={form.aulas}
                    onChange={(e) =>
                      setForm({ ...form, aulas: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-arena-ink">
                    Status
                  </label>
                  <select
                    className={inputClass}
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as Status })
                    }
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <p className="text-sm font-medium text-arena-red">{error}</p>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setEditingId(null)}
                className="rounded-md border border-arena-border px-4 py-2 text-sm font-semibold text-arena-ink transition-colors hover:bg-arena-bg"
              >
                Cancelar
              </button>
              <button
                onClick={save}
                className="inline-flex items-center gap-2 rounded-md bg-arena-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-arena-blue-dark"
              >
                <Save className="h-4 w-4" />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
