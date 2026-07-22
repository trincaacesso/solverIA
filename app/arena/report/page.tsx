"use client";

import { useState } from "react";
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
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROSTER } from "@/lib/arena-students";
import { useAuth } from "@/components/arena/auth-context";

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

// ── Controle de pagamentos ──
const PAYMENT_METHODS = ["—", "Pix", "Dinheiro", "Cartão", "Transferência"];

interface PaymentInfo {
  method: string; // forma de pagamento
  day: string; // dia do mês em que costuma pagar
  paid: boolean; // já pagou este mês?
}

const emptyPayment: PaymentInfo = { method: "—", day: "", paid: false };

// ── Destaques do mês ──
const destaques = [
  "Turma Elite B manteve ocupação acima de 90% pela 3ª vez seguida.",
  "7 novos alunos matriculados — melhor mês do semestre.",
  "Frequência do horário das 15h caiu 12% — avaliar remanejamento.",
  "Torneio interno agendado para Agosto já tem 24 inscritos.",
];

export default function ReportPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  // Pagamento por aluno (nome → info). Inicia vazio ("—", pendente).
  const [payments, setPayments] = useState<Record<string, PaymentInfo>>({});

  const getPayment = (name: string) => payments[name] ?? emptyPayment;

  const updatePayment = (name: string, patch: Partial<PaymentInfo>) => {
    if (!isAdmin) return;
    setPayments((prev) => ({
      ...prev,
      [name]: { ...getPayment(name), ...patch },
    }));
  };

  const paidCount = ROSTER.filter((r) => getPayment(r.name).paid).length;

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

      {/* Controle de pagamentos */}
      <div className="mt-6 overflow-hidden rounded-lg border border-arena-border bg-arena-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-arena-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-arena-blue" />
            <h2 className="text-base font-semibold text-arena-ink">
              Pagamentos dos alunos
            </h2>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              paidCount === ROSTER.length
                ? "bg-arena-green/15 text-arena-green"
                : "bg-arena-orange/15 text-arena-orange",
            )}
          >
            {paidCount}/{ROSTER.length} pagos
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-arena-border bg-arena-bg text-xs uppercase tracking-wide text-arena-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Aluno</th>
                <th className="px-4 py-3 font-semibold">Turma</th>
                <th className="px-4 py-3 font-semibold">Forma de pagamento</th>
                <th className="px-4 py-3 font-semibold">Dia que paga</th>
                <th className="px-4 py-3 font-semibold">Situação do mês</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-arena-border">
              {ROSTER.map((r) => {
                const p = getPayment(r.name);
                return (
                  <tr
                    key={r.name}
                    className="transition-colors hover:bg-arena-bg"
                  >
                    <td className="px-4 py-2.5 font-medium text-arena-ink">
                      {r.name}
                    </td>
                    <td className="px-4 py-2.5 text-arena-muted">{r.turma}</td>
                    <td className="px-4 py-2.5">
                      <select
                        disabled={!isAdmin}
                        value={p.method}
                        onChange={(e) =>
                          updatePayment(r.name, { method: e.target.value })
                        }
                        className="rounded-md border border-arena-border bg-arena-bg px-2 py-1.5 text-sm text-arena-ink outline-none transition-colors focus:border-arena-blue disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {PAYMENT_METHODS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        disabled={!isAdmin}
                        type="number"
                        min={1}
                        max={31}
                        placeholder="—"
                        value={p.day}
                        onChange={(e) =>
                          updatePayment(r.name, { day: e.target.value })
                        }
                        className="w-16 rounded-md border border-arena-border bg-arena-bg px-2 py-1.5 text-sm text-arena-ink outline-none transition-colors placeholder:text-arena-muted focus:border-arena-blue disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        disabled={!isAdmin}
                        onClick={() =>
                          updatePayment(r.name, { paid: !p.paid })
                        }
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-150",
                          p.paid
                            ? "bg-arena-green/15 text-arena-green"
                            : "bg-arena-orange/15 text-arena-orange",
                          isAdmin && "hover:scale-105 active:scale-95",
                          !isAdmin && "cursor-default",
                        )}
                      >
                        {p.paid ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Pago
                          </>
                        ) : (
                          <>
                            <Clock className="h-3.5 w-3.5" />
                            Pendente
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
