"use client";

import { useState } from "react";
import {
  Zap,
  Plus,
  Trash2,
  Shuffle,
  Trophy,
  Crown,
  ArrowLeft,
  Users,
  PlusCircle,
} from "lucide-react";
import {
  buildBracket,
  recomputeBracket,
  roundLabel,
  championOf,
  type Round,
} from "@/lib/bracket";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/arena/auth-context";

interface Championship {
  id: string;
  name: string;
  rounds: Round[];
  pairsCount: number;
}

const inputClass =
  "w-full rounded-md border border-arena-border bg-arena-bg px-3 py-2 text-sm text-arena-ink outline-none transition-colors placeholder:text-arena-muted focus:border-arena-blue";

export default function CefflashPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Começa vazio — as competições são criadas pelo administrador.
  const [championships, setChampionships] = useState<Championship[]>([]);
  // null = lista de competições; "new" = formulário; senão id da competição aberta.
  const [view, setView] = useState<string | null>(null);
  const [nextId, setNextId] = useState(100);

  // Formulário de nova competição
  const [name, setName] = useState("");
  const [pairs, setPairs] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState("");

  const active = championships.find((c) => c.id === view) ?? null;

  const updatePair = (i: number, value: string) =>
    setPairs((p) => p.map((v, idx) => (idx === i ? value : v)));

  const addPair = () => setPairs((p) => [...p, ""]);

  const removePair = (i: number) =>
    setPairs((p) => (p.length <= 2 ? p : p.filter((_, idx) => idx !== i)));

  const shuffle = () =>
    setPairs((p) => {
      const arr = [...p];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });

  const openNewForm = () => {
    setName("");
    setPairs(["", "", "", ""]);
    setError("");
    setView("new");
  };

  const generate = () => {
    const clean = pairs.map((p) => p.trim()).filter(Boolean);
    if (!name.trim()) {
      setError("Dê um nome ao campeonato.");
      return;
    }
    if (clean.length < 2) {
      setError("Cadastre pelo menos 2 duplas.");
      return;
    }
    if (new Set(clean.map((c) => c.toLowerCase())).size !== clean.length) {
      setError("Há nomes de duplas repetidos.");
      return;
    }
    setError("");
    const id = String(nextId);
    setNextId((n) => n + 1);
    setChampionships((prev) => [
      ...prev,
      { id, name: name.trim(), rounds: buildBracket(clean), pairsCount: clean.length },
    ]);
    setView(id);
  };

  const removeChampionship = (id: string) =>
    setChampionships((prev) => prev.filter((c) => c.id !== id));

  const pickWinner = (roundIdx: number, matchIdx: number, side: "a" | "b") => {
    if (!isAdmin || !active) return;
    setChampionships((prev) =>
      prev.map((c) => {
        if (c.id !== active.id) return c;
        const rounds = c.rounds.map((r) => r.map((m) => ({ ...m })));
        const match = rounds[roundIdx][matchIdx];
        if (side === "a" ? !match.a : !match.b) return c; // empty slot
        match.winner = match.winner === side ? null : side;
        recomputeBracket(rounds);
        return { ...c, rounds };
      }),
    );
  };

  const champion = active ? championOf(active.rounds) : null;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-arena-orange/15 text-arena-orange">
          <Zap className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-arena-ink sm:text-3xl">CEFFLASH</h1>
          <p className="text-sm text-arena-muted">
            {view === null
              ? "Clique em uma competição para entrar."
              : view === "new"
                ? "Monte a nova competição e gere o chaveamento."
                : "Acompanhe o chaveamento da competição."}
          </p>
        </div>
      </div>

      {view === null ? (
        /* ---------- Lista de competições ---------- */
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {championships.map((c) => {
            const done = championOf(c.rounds);
            return (
              <button
                key={c.id}
                onClick={() => setView(c.id)}
                className="group relative flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border border-arena-border bg-arena-card p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-arena-blue hover:shadow-md"
              >
                {isAdmin && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeChampionship(c.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        removeChampionship(c.id);
                      }
                    }}
                    className="absolute right-2 top-2 rounded p-1 text-arena-muted opacity-0 transition-opacity hover:bg-arena-red/10 hover:text-arena-red group-hover:opacity-100"
                    aria-label="Excluir competição"
                  >
                    <Trash2 className="h-4 w-4" />
                  </span>
                )}
                <span
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl",
                    done
                      ? "bg-arena-orange/15 text-arena-orange"
                      : "bg-arena-blue/10 text-arena-blue",
                  )}
                >
                  {done ? (
                    <Crown className="h-7 w-7" />
                  ) : (
                    <Trophy className="h-7 w-7" />
                  )}
                </span>
                <span className="line-clamp-2 text-sm font-bold text-arena-ink">
                  {c.name}
                </span>
                <span className="flex items-center gap-1 text-xs text-arena-muted">
                  <Users className="h-3.5 w-3.5" />
                  {c.pairsCount} duplas
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    done
                      ? "bg-arena-orange/15 text-arena-orange"
                      : "bg-arena-green/15 text-arena-green",
                  )}
                >
                  {done ? `Campeão: ${done}` : "Em andamento"}
                </span>
              </button>
            );
          })}

          {isAdmin && (
            <button
              onClick={openNewForm}
              className="flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-arena-border bg-transparent p-4 text-arena-muted transition-all duration-200 hover:-translate-y-1 hover:border-arena-blue hover:text-arena-blue"
            >
              <PlusCircle className="h-10 w-10" />
              <span className="text-sm font-semibold">Nova competição</span>
            </button>
          )}

          {championships.length === 0 && !isAdmin && (
            <p className="col-span-full py-10 text-center text-sm text-arena-muted">
              Nenhuma competição no momento.
            </p>
          )}
        </div>
      ) : view === "new" ? (
        /* ---------- Formulário de nova competição ---------- */
        <div className="max-w-2xl space-y-6">
          <button
            type="button"
            onClick={() => setView(null)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-arena-blue transition-opacity hover:opacity-80"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar às competições
          </button>

          <section className="rounded-lg border border-arena-border bg-arena-card p-5 shadow-sm">
            <label className="mb-1.5 block text-sm font-medium text-arena-ink">
              Nome do campeonato
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Copa CT VH de Verão"
              className={inputClass}
            />
          </section>

          <section className="rounded-lg border border-arena-border bg-arena-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-arena-ink">
                Duplas ({pairs.filter((p) => p.trim()).length})
              </h2>
              <button
                type="button"
                onClick={shuffle}
                className="inline-flex items-center gap-1.5 rounded-md border border-arena-border px-3 py-1.5 text-xs font-semibold text-arena-ink transition-colors hover:border-arena-blue hover:text-arena-blue"
              >
                <Shuffle className="h-4 w-4" />
                Sortear ordem
              </button>
            </div>

            <div className="space-y-2">
              {pairs.map((pair, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 text-center text-sm font-semibold text-arena-muted">
                    {i + 1}
                  </span>
                  <input
                    value={pair}
                    onChange={(e) => updatePair(i, e.target.value)}
                    placeholder={`Dupla ${i + 1}`}
                    className={cn(inputClass, "flex-1")}
                  />
                  <button
                    type="button"
                    onClick={() => removePair(i)}
                    disabled={pairs.length <= 2}
                    className="rounded-md p-2 text-arena-muted transition-colors hover:text-arena-red disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Remover dupla"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addPair}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-arena-blue transition-opacity hover:opacity-80"
            >
              <Plus className="h-4 w-4" />
              Adicionar dupla
            </button>
          </section>

          {error && <p className="text-sm font-medium text-arena-red">{error}</p>}

          <button
            type="button"
            onClick={generate}
            className="inline-flex items-center gap-2 rounded-md bg-arena-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-arena-blue-dark active:scale-95"
          >
            <Trophy className="h-5 w-5" />
            Gerar chaveamento
          </button>
        </div>
      ) : active ? (
        /* ---------- Chaveamento da competição ---------- */
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <button
                type="button"
                onClick={() => setView(null)}
                className="mb-1 inline-flex items-center gap-1.5 text-sm font-semibold text-arena-blue transition-opacity hover:opacity-80"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar às competições
              </button>
              <h2 className="text-xl font-bold text-arena-ink">{active.name}</h2>
            </div>
          </div>

          {champion && (
            <div className="mb-5 flex items-center gap-3 rounded-lg border border-arena-orange/40 bg-arena-orange/10 p-4">
              <Crown className="h-7 w-7 text-arena-orange" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-arena-orange">
                  Campeão
                </p>
                <p className="text-lg font-bold text-arena-ink">{champion}</p>
              </div>
            </div>
          )}

          <p className="mb-3 text-sm text-arena-muted">
            {isAdmin
              ? "Clique na dupla vencedora de cada confronto para avançá-la."
              : "Acompanhe os confrontos — apenas o administrador registra os vencedores."}
          </p>

          <div className="overflow-x-auto pb-4">
            <div className="flex min-w-max gap-6">
              {active.rounds.map((round, rIdx) => (
                <div
                  key={rIdx}
                  className="flex w-56 flex-shrink-0 flex-col justify-around gap-4"
                >
                  <h3 className="text-center text-xs font-bold uppercase tracking-wide text-arena-muted">
                    {roundLabel(round.length)}
                  </h3>
                  {round.map((match, mIdx) => (
                    <div
                      key={mIdx}
                      className="overflow-hidden rounded-lg border border-arena-border bg-arena-card shadow-sm"
                    >
                      {(["a", "b"] as const).map((side, sIdx) => {
                        const team = match[side];
                        const isWinner = match.winner === side;
                        const isBye = !team;
                        return (
                          <button
                            key={side}
                            type="button"
                            disabled={isBye || !isAdmin}
                            onClick={() => pickWinner(rIdx, mIdx, side)}
                            className={cn(
                              "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors",
                              sIdx === 0 && "border-b border-arena-border",
                              isWinner
                                ? "bg-arena-blue/15 font-semibold text-arena-ink"
                                : "text-arena-ink",
                              isAdmin && !isBye && "hover:bg-arena-bg",
                              isBye && "cursor-default text-arena-muted",
                              !isAdmin && "cursor-default",
                            )}
                          >
                            <span className="truncate">{team ?? "—"}</span>
                            {isWinner && (
                              <Trophy className="ml-2 h-4 w-4 flex-shrink-0 text-arena-blue" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
