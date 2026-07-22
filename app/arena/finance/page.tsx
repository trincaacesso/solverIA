import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  description: string;
  category: string;
  date: string;
  amount: number; // positive = receita, negative = despesa
}

const transactions: Transaction[] = [
  { id: "1", description: "Mensalidade - Carlos Mendes", category: "Mensalidade", date: "20/07", amount: 250 },
  { id: "2", description: "Mensalidade - Fernanda Lima", category: "Mensalidade", date: "19/07", amount: 240 },
  { id: "3", description: "Aluguel da quadra", category: "Custos Fixos", date: "18/07", amount: -1800 },
  { id: "4", description: "Aula avulsa - Gustavo Rocha", category: "Avulso", date: "17/07", amount: 60 },
  { id: "5", description: "Compra de bolas e rede", category: "Equipamentos", date: "15/07", amount: -430 },
  { id: "6", description: "Plano anual - Rafael Souza", category: "Anual", date: "12/07", amount: 2400 },
];

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function FinancePage() {
  const receita = transactions
    .filter((t) => t.amount > 0)
    .reduce((s, t) => s + t.amount, 0);
  const despesa = transactions
    .filter((t) => t.amount < 0)
    .reduce((s, t) => s + t.amount, 0);
  const saldo = receita + despesa;

  const cards = [
    { label: "Receita do mês", value: brl(receita), icon: TrendingUp, tone: "text-arena-green", bg: "bg-arena-green/10" },
    { label: "Despesas do mês", value: brl(Math.abs(despesa)), icon: TrendingDown, tone: "text-arena-red", bg: "bg-arena-red/10" },
    { label: "Saldo", value: brl(saldo), icon: Wallet, tone: "text-arena-blue", bg: "bg-arena-blue/10" },
    { label: "Alunos pagantes", value: "48", icon: Users, tone: "text-arena-orange", bg: "bg-arena-orange/10" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-arena-ink sm:text-3xl">
          Financeiro
        </h1>
        <p className="mt-1 text-sm text-arena-muted">
          Resumo de receitas, despesas e movimentações da arena.
        </p>
      </div>

      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-lg border border-arena-border bg-arena-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-arena-muted">{c.label}</p>
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  c.bg,
                  c.tone,
                )}
              >
                <c.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-arena-ink">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="overflow-hidden rounded-lg border border-arena-border bg-arena-card shadow-sm">
        <div className="border-b border-arena-border px-4 py-3">
          <h2 className="text-base font-semibold text-arena-ink">
            Movimentações recentes
          </h2>
        </div>
        <ul className="divide-y divide-arena-border">
          {transactions.map((t) => {
            const income = t.amount > 0;
            return (
              <li
                key={t.id}
                className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-arena-bg"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full",
                      income
                        ? "bg-arena-green/10 text-arena-green"
                        : "bg-arena-red/10 text-arena-red",
                    )}
                  >
                    {income ? (
                      <ArrowUpRight className="h-5 w-5" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-arena-ink">
                      {t.description}
                    </p>
                    <p className="text-xs text-arena-muted">
                      {t.category} · {t.date}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    income ? "text-arena-green" : "text-arena-red",
                  )}
                >
                  {income ? "+" : "-"} {brl(Math.abs(t.amount))}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
