import {
  DollarSign,
  Users,
  UserPlus,
  UserMinus,
  AlertTriangle,
  CalendarCheck,
  Percent,
  Clock,
  TrendingUp,
  TrendingDown,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ── KPIs principais do mês (Julho/2026) ──
const kpis = [
  {
    label: "Receita do mês",
    value: brl(11840),
    delta: "+8,5% vs Junho",
    up: true,
    icon: DollarSign,
    tone: "text-arena-green",
    bg: "bg-arena-green/10",
  },
  {
    label: "Alunos ativos",
    value: "52",
    delta: "+4 vs Junho",
    up: true,
    icon: Users,
    tone: "text-arena-blue",
    bg: "bg-arena-blue/10",
  },
  {
    label: "Inadimplência",
    value: brl(1230),
    delta: "5 mensalidades em atraso",
    up: false,
    icon: AlertTriangle,
    tone: "text-arena-red",
    bg: "bg-arena-red/10",
  },
  {
    label: "Frequência média",
    value: "78%",
    delta: "+3 p.p. vs Junho",
    up: true,
    icon: Percent,
    tone: "text-arena-orange",
    bg: "bg-arena-orange/10",
  },
];

// ── Movimentação de alunos ──
const movimentacao = [
  { label: "Novos alunos", value: 7, icon: UserPlus, tone: "text-arena-green" },
  { label: "Cancelamentos", value: 3, icon: UserMinus, tone: "text-arena-red" },
  {
    label: "Aulas realizadas",
    value: 68,
    icon: CalendarCheck,
    tone: "text-arena-blue",
  },
  {
    label: "Horário mais procurado",
    value: "19h",
    icon: Clock,
    tone: "text-arena-orange",
  },
];

// ── Ocupação média por turma (alunos presentes / vagas) ──
const ocupacao = [
  { turma: "Elite B", pct: 92 },
  { turma: "Feminino Avançado", pct: 85 },
  { turma: "Iniciante", pct: 74 },
  { turma: "Pré-Elite", pct: 70 },
  { turma: "Aprendiz", pct: 61 },
  { turma: "Misto Aprendiz", pct: 55 },
];

// ── Destaques do mês ──
const destaques = [
  "Turma Elite B manteve ocupação acima de 90% pela 3ª vez seguida.",
  "7 novos alunos matriculados — melhor mês do semestre.",
  "Frequência do horário das 15h caiu 12% — avaliar remanejamento.",
  "Torneio interno agendado para Agosto já tem 24 inscritos.",
];

export default function ReportPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-arena-ink sm:text-3xl">
          Relatório Mensal
        </h1>
        <p className="mt-1 text-sm text-arena-muted">
          Visão geral de Julho de 2026 — desempenho financeiro, alunos e
          ocupação das turmas.
        </p>
      </div>

      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-lg border border-arena-border bg-arena-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-arena-muted">{k.label}</p>
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  k.bg,
                  k.tone,
                )}
              >
                <k.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-arena-ink">{k.value}</p>
            <p
              className={cn(
                "mt-1 flex items-center gap-1 text-xs font-medium",
                k.up ? "text-arena-green" : "text-arena-red",
              )}
            >
              {k.up ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {k.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Movimentação de alunos */}
        <div className="rounded-lg border border-arena-border bg-arena-card shadow-sm">
          <div className="border-b border-arena-border px-4 py-3">
            <h2 className="text-base font-semibold text-arena-ink">
              Movimentação do mês
            </h2>
          </div>
          <ul className="divide-y divide-arena-border">
            {movimentacao.map((m) => (
              <li
                key={m.label}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-arena-ink">
                  <m.icon className={cn("h-5 w-5", m.tone)} />
                  {m.label}
                </span>
                <span className="text-base font-bold text-arena-ink">
                  {m.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ocupação por turma */}
        <div className="rounded-lg border border-arena-border bg-arena-card shadow-sm">
          <div className="border-b border-arena-border px-4 py-3">
            <h2 className="text-base font-semibold text-arena-ink">
              Ocupação média por turma
            </h2>
          </div>
          <ul className="space-y-3 p-4">
            {ocupacao.map((o) => (
              <li key={o.turma}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-arena-ink">{o.turma}</span>
                  <span
                    className={cn(
                      "font-semibold",
                      o.pct >= 85
                        ? "text-arena-green"
                        : o.pct >= 65
                          ? "text-arena-blue"
                          : "text-arena-orange",
                    )}
                  >
                    {o.pct}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-arena-bg">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      o.pct >= 85
                        ? "bg-arena-green"
                        : o.pct >= 65
                          ? "bg-arena-blue"
                          : "bg-arena-orange",
                    )}
                    style={{ width: `${o.pct}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Destaques */}
      <div className="mt-6 rounded-lg border border-arena-border bg-arena-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-arena-border px-4 py-3">
          <Trophy className="h-5 w-5 text-arena-orange" />
          <h2 className="text-base font-semibold text-arena-ink">
            Destaques e alertas do mês
          </h2>
        </div>
        <ul className="divide-y divide-arena-border">
          {destaques.map((d, i) => (
            <li
              key={i}
              className="flex items-start gap-3 px-4 py-3 text-sm text-arena-ink"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-arena-blue/10 text-xs font-bold text-arena-blue">
                {i + 1}
              </span>
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
